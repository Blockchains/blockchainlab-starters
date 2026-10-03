// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.28;

import {BasePaymaster} from "account-abstraction/core/BasePaymaster.sol";
import {IEntryPoint} from "account-abstraction/interfaces/IEntryPoint.sol";
import {PackedUserOperation} from "account-abstraction/interfaces/PackedUserOperation.sol";

/// @title AllowlistPaymaster - sponsors gas for allowlisted smart accounts (ERC-4337 v0.8)
/// @notice Extends eth-infinitism BasePaymaster (GPL-3.0) from the Blockchains fork.
contract AllowlistPaymaster is BasePaymaster {
    mapping(address => bool) public sponsored;
    uint256 public maxCostPerOp;

    event SponsorshipSet(address indexed account, bool allowed);

    constructor(IEntryPoint ep, uint256 maxCost) BasePaymaster(ep) {
        maxCostPerOp = maxCost;
    }

    function setSponsored(address account, bool allowed) external onlyOwner {
        sponsored[account] = allowed;
        emit SponsorshipSet(account, allowed);
    }

    function _validatePaymasterUserOp(PackedUserOperation calldata userOp, bytes32, uint256 maxCost)
        internal
        view
        override
        returns (bytes memory context, uint256 validationData)
    {
        if (!sponsored[userOp.sender] || maxCost > maxCostPerOp) return ("", 1); // SIG_VALIDATION_FAILED
        return ("", 0);
    }
}
