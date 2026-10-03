// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {LabToken} from "../src/LabToken.sol";
import {LabNFT} from "../src/LabNFT.sol";

/// forge script script/Deploy.s.sol --rpc-url $RPC_URL --account deployer --broadcast
contract Deploy is Script {
    function run() external returns (LabToken token, LabNFT nft) {
        vm.startBroadcast();
        address owner = msg.sender;
        token = new LabToken("Lab Token", "LAB", 1_000_000 ether, owner);
        nft = new LabNFT("Lab NFT", "LABNFT", owner, 500);
        token.mint(owner, 1_000 ether);
        vm.stopBroadcast();
        console.log("LabToken", address(token));
        console.log("LabNFT", address(nft));
    }
}
