// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/contracts/interfaces/IRouterClient.sol";
import {CrossChainMessenger} from "../src/CrossChainMessenger.sol";

/// Live check against the real CCIP deployment on Ethereum Sepolia (forked from a public RPC; override with SEPOLIA_RPC_URL).
contract CrossChainMessengerForkTest is Test {
    address constant ROUTER = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59; // CCIP router, Ethereum Sepolia
    address constant LINK = 0x779877A7B0D9E8603169DdbD7836e478b4624789; // LINK, Ethereum Sepolia
    uint64 constant BASE_SEPOLIA = 10344971235874465080; // CCIP chain selector

    function test_Fork_QuoteRealFeeToBaseSepolia() public {
        vm.createSelectFork(vm.envOr("SEPOLIA_RPC_URL", string("https://ethereum-sepolia-rpc.publicnode.com")));
        assertTrue(IRouterClient(ROUTER).isChainSupported(BASE_SEPOLIA), "lane Sepolia -> Base Sepolia");
        CrossChainMessenger m = new CrossChainMessenger(ROUTER, LINK);
        uint256 fee = m.quote(BASE_SEPOLIA, address(0xBEEF), "gm", address(0), 0);
        assertGt(fee, 0, "real router charges a LINK fee");
        emit log_named_decimal_uint("LINK fee Sepolia -> Base Sepolia", fee, 18);
    }
}
