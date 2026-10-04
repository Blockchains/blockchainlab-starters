// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LabItems} from "../src/LabItems.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract LabItemsTest is Test {
    LabItems items;
    address admin = makeAddr("admin");
    address alice = makeAddr("alice");

    function setUp() public {
        items = new LabItems("ipfs://bafy/", admin);
        vm.startPrank(admin);
        items.configure(1, 100);
        items.configure(2, 5);
        vm.stopPrank();
    }

    function test_MintWithinCap() public {
        vm.prank(admin);
        items.mint(alice, 1, 40);
        assertEq(items.balanceOf(alice, 1), 40);
        assertEq(items.totalSupply(1), 40);
    }

    function test_RevertOverCap() public {
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(LabItems.MaxSupplyExceeded.selector, 2, 6, 5));
        items.mint(alice, 2, 6);
    }

    function test_RevertUnconfigured() public {
        vm.prank(admin);
        vm.expectRevert(abi.encodeWithSelector(LabItems.ItemNotConfigured.selector, 9));
        items.mint(alice, 9, 1);
    }

    function test_OnlyMinter() public {
        bytes32 role = items.MINTER_ROLE();
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, alice, role));
        items.mint(alice, 1, 1);
    }

    function test_MintBatchAndUri() public {
        uint256[] memory ids = new uint256[](2);
        uint256[] memory amts = new uint256[](2);
        (ids[0], ids[1], amts[0], amts[1]) = (1, 2, 10, 5);
        vm.prank(admin);
        items.mintBatch(alice, ids, amts);
        assertEq(items.balanceOf(alice, 2), 5);
        assertEq(items.uri(2), "ipfs://bafy/2.json");
    }

    function testFuzz_NeverExceedsCap(uint256 a, uint256 b) public {
        a = bound(a, 0, 100);
        b = bound(b, 0, 200);
        vm.startPrank(admin);
        items.mint(alice, 1, a);
        if (a + b > 100) vm.expectRevert();
        items.mint(alice, 1, b);
        vm.stopPrank();
        assertLe(items.totalSupply(1), 100);
    }
}
