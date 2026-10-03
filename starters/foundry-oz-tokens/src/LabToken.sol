// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title LabToken - capped, burnable, permit-enabled ERC-20 (OpenZeppelin v5 via Blockchains fork)
contract LabToken is ERC20, ERC20Permit, ERC20Burnable, Ownable {
    uint256 public immutable cap;

    error CapExceeded(uint256 requested, uint256 cap);

    constructor(string memory name_, string memory symbol_, uint256 cap_, address owner_)
        ERC20(name_, symbol_)
        ERC20Permit(name_)
        Ownable(owner_)
    {
        cap = cap_;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        if (totalSupply() + amount > cap) revert CapExceeded(totalSupply() + amount, cap);
        _mint(to, amount);
    }
}
