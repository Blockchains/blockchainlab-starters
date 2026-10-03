// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {PriceConsumer} from "../src/PriceConsumer.sol";

/// FEED defaults to Sepolia ETH/USD. forge script script/Deploy.s.sol --rpc-url sepolia --account deployer --broadcast
contract Deploy is Script {
    function run() external returns (PriceConsumer c) {
        address feed = vm.envOr("FEED", address(0x694AA1769357215DE4FAC081bf1f309aDC325306));
        vm.startBroadcast();
        c = new PriceConsumer(feed, 1 days);
        vm.stopBroadcast();
        console.log("PriceConsumer", address(c));
    }
}
