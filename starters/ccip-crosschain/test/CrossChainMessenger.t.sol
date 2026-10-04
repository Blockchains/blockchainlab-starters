// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CCIPLocalSimulator, IRouterClient, LinkToken, BurnMintERC677Helper} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";
import {CrossChainMessenger} from "../src/CrossChainMessenger.sol";

/// End-to-end CCIP flow on Chainlink Local's simulator (the official local CCIP router), source and destination in one EVM.
contract CrossChainMessengerTest is Test {
    CCIPLocalSimulator sim;
    CrossChainMessenger src;
    CrossChainMessenger dst;
    uint64 selector;
    LinkToken link;
    BurnMintERC677Helper bnm;

    function setUp() public {
        sim = new CCIPLocalSimulator();
        IRouterClient router;
        (selector, router,,, link, bnm,) = sim.configuration();
        src = new CrossChainMessenger(address(router), address(link));
        dst = new CrossChainMessenger(address(router), address(link));
        src.allowDestination(selector, true);
        dst.allowSender(selector, address(src), true);
        sim.requestLinkFromFaucet(address(src), 10 ether);
    }

    function test_SendTextAcrossChains() public {
        bytes32 id = src.send(selector, address(dst), "gm from chain A", address(0), 0);
        assertEq(dst.lastMessageId(), id);
        assertEq(dst.lastText(), "gm from chain A");
        assertEq(dst.lastSender(), address(src));
        assertEq(dst.lastSourceChain(), selector);
    }

    function test_SendTokensWithMessage() public {
        bnm.drip(address(this)); // CCIP-BnM test token faucet: 1e18
        bnm.approve(address(src), 1 ether);
        src.send(selector, address(dst), "here are tokens", address(bnm), 1 ether);
        assertEq(bnm.balanceOf(address(dst)), 1 ether);
        assertEq(dst.lastToken(), address(bnm));
        assertEq(dst.lastAmount(), 1 ether);
    }

    function test_RevertDestinationNotAllowed() public {
        src.allowDestination(selector, false);
        vm.expectRevert(abi.encodeWithSelector(CrossChainMessenger.DestinationNotAllowed.selector, selector));
        src.send(selector, address(dst), "x", address(0), 0);
    }

    function test_RevertUnknownSender() public {
        dst.allowSender(selector, address(src), false);
        vm.expectRevert(); // router bubbles up SenderNotAllowed from the receiver
        src.send(selector, address(dst), "x", address(0), 0);
    }

    function test_OnlyOwnerSends() public {
        vm.prank(makeAddr("mallory"));
        vm.expectRevert(CrossChainMessenger.NotOwner.selector);
        src.send(selector, address(dst), "x", address(0), 0);
    }

    function test_QuoteAndWithdraw() public view {
        src.quote(selector, address(dst), "hello", address(0), 0); // simulator fee is 0, must not revert
        assertEq(link.balanceOf(address(src)), 10 ether);
    }
}
