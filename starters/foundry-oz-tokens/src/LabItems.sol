// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/// @title LabItems - ERC-1155 multi-token (game items, tickets, badges) with per-id max supply and a MINTER_ROLE
contract LabItems is ERC1155Supply, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice 0 = id not configured; otherwise the hard cap for that id
    mapping(uint256 => uint256) public maxSupply;

    event ItemConfigured(uint256 indexed id, uint256 maxSupply);

    error ItemNotConfigured(uint256 id);
    error MaxSupplyExceeded(uint256 id, uint256 requested, uint256 available);

    constructor(string memory baseUri, address admin) ERC1155(baseUri) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function configure(uint256 id, uint256 cap) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(cap >= totalSupply(id), "cap below supply");
        maxSupply[id] = cap;
        emit ItemConfigured(id, cap);
    }

    function mint(address to, uint256 id, uint256 amount) external onlyRole(MINTER_ROLE) {
        _checkCap(id, amount);
        _mint(to, id, amount, "");
    }

    function mintBatch(address to, uint256[] calldata ids, uint256[] calldata amounts) external onlyRole(MINTER_ROLE) {
        for (uint256 i; i < ids.length; ++i) {
            _checkCap(ids[i], amounts[i]);
        }
        _mintBatch(to, ids, amounts, "");
    }

    /// @notice {baseUri}{id}.json - e.g. ipfs://<cid>/1.json
    function uri(uint256 id) public view override returns (string memory) {
        return string.concat(super.uri(id), Strings.toString(id), ".json");
    }

    function _checkCap(uint256 id, uint256 amount) private view {
        uint256 cap = maxSupply[id];
        if (cap == 0) revert ItemNotConfigured(id);
        uint256 available = cap - totalSupply(id);
        if (amount > available) revert MaxSupplyExceeded(id, amount, available);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
