// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC2981} from "@openzeppelin/contracts/token/common/ERC2981.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title LabNFT - ERC-721 with per-token URI and ERC-2981 royalties
contract LabNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 public nextId = 1;

    constructor(string memory name_, string memory symbol_, address owner_, uint96 royaltyBps)
        ERC721(name_, symbol_)
        Ownable(owner_)
    {
        _setDefaultRoyalty(owner_, royaltyBps);
    }

    function safeMint(address to, string calldata uri) external onlyOwner returns (uint256 id) {
        id = nextId++;
        _safeMint(to, id);
        _setTokenURI(id, uri);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
