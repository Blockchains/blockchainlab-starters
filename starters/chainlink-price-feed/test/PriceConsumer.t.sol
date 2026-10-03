// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {PriceConsumer} from "../src/PriceConsumer.sol";
import {MockV3Aggregator} from "./MockV3Aggregator.sol";

contract PriceConsumerTest is Test {
    MockV3Aggregator feed;
    PriceConsumer consumer;

    function setUp() public {
        vm.warp(1_700_000_000);
        feed = new MockV3Aggregator(8, 3000e8);
        consumer = new PriceConsumer(address(feed), 1 hours);
    }

    function test_LatestPrice() public view {
        (int256 p, uint8 d) = consumer.latestPrice();
        assertEq(p, 3000e8);
        assertEq(d, 8);
    }

    function test_Quote() public view {
        assertEq(consumer.quote(2 ether), 6000 ether);
    }

    function test_RevertWhen_Stale() public {
        vm.warp(block.timestamp + 2 hours);
        vm.expectRevert();
        consumer.latestPrice();
    }

    function test_RevertWhen_NonPositive() public {
        feed.update(0);
        vm.expectRevert(abi.encodeWithSelector(PriceConsumer.InvalidPrice.selector, int256(0)));
        consumer.latestPrice();
    }

    /// Live read of the real Chainlink ETH/USD feed on Ethereum mainnet (fork test, read-only).
    /// Uses MAINNET_RPC_URL if set, otherwise the public PublicNode endpoint.
    function test_Fork_MainnetEthUsd() public {
        string memory rpc = vm.envOr("MAINNET_RPC_URL", string("https://ethereum-rpc.publicnode.com"));
        vm.createSelectFork(rpc);
        PriceConsumer live = new PriceConsumer(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419, 1 days);
        (int256 p, uint8 d) = live.latestPrice();
        assertEq(d, 8);
        assertGt(p, 100e8); // ETH > $100
        assertGt(live.quote(1 ether), 100 ether);
    }
}
