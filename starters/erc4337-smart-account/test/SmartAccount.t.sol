// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {EntryPoint} from "account-abstraction/core/EntryPoint.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";
import {SimpleAccount} from "account-abstraction/accounts/SimpleAccount.sol";
import {BaseAccount} from "account-abstraction/core/BaseAccount.sol";
import {SimpleAccountFactory} from "account-abstraction/accounts/SimpleAccountFactory.sol";
import {AllowlistPaymaster} from "../src/AllowlistPaymaster.sol";
import {Counter} from "../src/Counter.sol";

/// End-to-end ERC-4337 v0.8 flow on the real EntryPoint: counterfactual account deployment via initCode,
/// owner-signed UserOperation, self-funded and paymaster-sponsored execution.
contract SmartAccountTest is Test {
    EntryPoint entryPoint;
    SimpleAccountFactory factory;
    AllowlistPaymaster paymaster;
    Counter counter;
    uint256 ownerKey = 0xA11CE;
    address owner;
    address payable bundler = payable(address(0xB0D1E5));

    function setUp() public {
        owner = vm.addr(ownerKey);
        entryPoint = new EntryPoint();
        factory = new SimpleAccountFactory(IEntryPoint(address(entryPoint)));
        counter = new Counter();
        paymaster = new AllowlistPaymaster(IEntryPoint(address(entryPoint)), 1 ether);
        paymaster.deposit{value: 5 ether}();
    }

    function _op(address sender, bytes memory initCode, bytes memory callData, bytes memory pmData)
        internal view returns (PackedUserOperation memory op)
    {
        op.sender = sender;
        op.nonce = entryPoint.getNonce(sender, 0);
        op.initCode = initCode;
        op.callData = callData;
        op.accountGasLimits = bytes32((uint256(1_000_000) << 128) | uint256(200_000));
        op.preVerificationGas = 60_000;
        op.gasFees = bytes32((uint256(1 gwei) << 128) | uint256(2 gwei));
        op.paymasterAndData = pmData;
    }

    function _sign(PackedUserOperation memory op) internal view {
        bytes32 h = entryPoint.getUserOpHash(op);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(ownerKey, h);
        op.signature = abi.encodePacked(r, s, v);
    }

    function _send(PackedUserOperation memory op) internal {
        PackedUserOperation[] memory ops = new PackedUserOperation[](1);
        ops[0] = op;
        vm.prank(bundler, bundler);
        entryPoint.handleOps(ops, bundler);
    }

    function _initCode(uint256 salt) internal view returns (bytes memory) {
        return abi.encodePacked(address(factory), abi.encodeCall(SimpleAccountFactory.createAccount, (owner, salt)));
    }

    function test_DeployAndExecute_SelfFunded() public {
        address sender = factory.getAddress(owner, 0);
        assertEq(sender.code.length, 0);
        vm.deal(sender, 1 ether); // prefund the counterfactual address
        bytes memory call = abi.encodeCall(BaseAccount.execute, (address(counter), 0, abi.encodeCall(Counter.increment, ())));
        PackedUserOperation memory op = _op(sender, _initCode(0), call, "");
        _sign(op);
        _send(op);
        assertGt(sender.code.length, 0, "account deployed");
        assertEq(SimpleAccount(payable(sender)).owner(), owner);
        assertEq(counter.count(sender), 1);
        assertLt(sender.balance, 1 ether, "account paid gas");
        assertGt(bundler.balance, 0, "bundler compensated");
    }

    function test_PaymasterSponsorsGas() public {
        address sender = factory.getAddress(owner, 7);
        paymaster.setSponsored(sender, true);
        bytes memory pm = abi.encodePacked(address(paymaster), uint128(200_000), uint128(50_000));
        bytes memory call = abi.encodeCall(BaseAccount.execute, (address(counter), 0, abi.encodeCall(Counter.increment, ())));
        uint256 depBefore = entryPoint.balanceOf(address(paymaster));
        PackedUserOperation memory op = _op(sender, _initCode(7), call, pm);
        _sign(op);
        _send(op);
        assertEq(counter.count(sender), 1);
        assertEq(sender.balance, 0, "account held no ETH - fully sponsored");
        assertLt(entryPoint.balanceOf(address(paymaster)), depBefore, "paymaster deposit charged");
    }

    function test_RevertWhen_NotSponsored() public {
        address sender = factory.getAddress(owner, 9);
        bytes memory pm = abi.encodePacked(address(paymaster), uint128(200_000), uint128(50_000));
        PackedUserOperation memory op = _op(sender, _initCode(9), abi.encodeCall(BaseAccount.execute, (address(counter), 0, abi.encodeCall(Counter.increment, ()))), pm);
        _sign(op);
        PackedUserOperation[] memory ops = new PackedUserOperation[](1);
        ops[0] = op;
        vm.expectRevert(abi.encodeWithSelector(IEntryPoint.FailedOp.selector, 0, "AA34 signature error"));
        entryPoint.handleOps(ops, bundler);
    }

    function test_RevertWhen_WrongSigner() public {
        address sender = factory.getAddress(owner, 1);
        vm.deal(sender, 1 ether);
        PackedUserOperation memory op = _op(sender, _initCode(1), abi.encodeCall(BaseAccount.execute, (address(counter), 0, abi.encodeCall(Counter.increment, ()))), "");
        bytes32 h = entryPoint.getUserOpHash(op);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(0xBAD, h);
        op.signature = abi.encodePacked(r, s, v);
        PackedUserOperation[] memory ops = new PackedUserOperation[](1);
        ops[0] = op;
        vm.expectRevert(abi.encodeWithSelector(IEntryPoint.FailedOp.selector, 0, "AA24 signature error"));
        entryPoint.handleOps(ops, bundler);
    }
}
