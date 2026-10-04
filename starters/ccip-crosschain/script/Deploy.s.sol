// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {CrossChainMessenger} from "../src/CrossChainMessenger.sol";

/// ROUTER / LINK: see https://docs.chain.link/ccip/directory/testnet (e.g. Ethereum Sepolia router 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59,
/// LINK 0x779877A7B0D9E8603169DdbD7836e478b4624789). Deploy on two chains, then allowDestination/allowSender and fund with LINK.
contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        CrossChainMessenger m = new CrossChainMessenger(vm.envAddress("ROUTER"), vm.envAddress("LINK"));
        vm.stopBroadcast();
        console2.log("CrossChainMessenger", address(m));
    }
}
