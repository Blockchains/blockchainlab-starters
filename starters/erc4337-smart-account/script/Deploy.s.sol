// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {SimpleAccountFactory} from "account-abstraction/accounts/SimpleAccountFactory.sol";
import {AllowlistPaymaster} from "../src/AllowlistPaymaster.sol";
import {Counter} from "../src/Counter.sol";

/// Uses the canonical v0.8 EntryPoint (0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108) unless ENTRYPOINT is set.
contract Deploy is Script {
    function run() external {
        IEntryPoint ep = IEntryPoint(vm.envOr("ENTRYPOINT", address(0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108)));
        vm.startBroadcast();
        SimpleAccountFactory factory = new SimpleAccountFactory(ep);
        AllowlistPaymaster pm = new AllowlistPaymaster(ep, 0.01 ether);
        Counter counter = new Counter();
        vm.stopBroadcast();
        console.log("SimpleAccountFactory", address(factory));
        console.log("AllowlistPaymaster", address(pm));
        console.log("Counter", address(counter));
    }
}
