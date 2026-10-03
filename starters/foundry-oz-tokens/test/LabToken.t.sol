// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LabToken} from "../src/LabToken.sol";
import {LabNFT} from "../src/LabNFT.sol";

contract LabTokenTest is Test {
    LabToken token;
    LabNFT nft;
    address owner = address(0xA11CE);
    address bob = address(0xB0B);

    function setUp() public {
        token = new LabToken("Lab Token", "LAB", 1_000_000 ether, owner);
        nft = new LabNFT("Lab NFT", "LABNFT", owner, 500);
    }

    function test_MintWithinCap() public {
        vm.prank(owner);
        token.mint(bob, 100 ether);
        assertEq(token.balanceOf(bob), 100 ether);
    }

    function test_RevertWhen_CapExceeded() public {
        vm.startPrank(owner);
        token.mint(bob, 1_000_000 ether);
        vm.expectRevert(abi.encodeWithSelector(LabToken.CapExceeded.selector, 1_000_000 ether + 1, 1_000_000 ether));
        token.mint(bob, 1);
        vm.stopPrank();
    }

    function test_RevertWhen_NotOwnerMints() public {
        vm.prank(bob);
        vm.expectRevert();
        token.mint(bob, 1);
    }

    function test_Permit() public {
        uint256 pk = 0xBEEF;
        address holder = vm.addr(pk);
        vm.prank(owner);
        token.mint(holder, 10 ether);
        bytes32 structHash = keccak256(abi.encode(
            keccak256("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"),
            holder, bob, 5 ether, token.nonces(holder), block.timestamp + 1 hours));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", token.DOMAIN_SEPARATOR(), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);
        token.permit(holder, bob, 5 ether, block.timestamp + 1 hours, v, r, s);
        assertEq(token.allowance(holder, bob), 5 ether);
    }

    function testFuzz_Burn(uint256 amount) public {
        amount = bound(amount, 0, 1_000_000 ether);
        vm.prank(owner);
        token.mint(bob, amount);
        vm.prank(bob);
        token.burn(amount);
        assertEq(token.totalSupply(), 0);
    }

    function test_NFTMintAndRoyalty() public {
        vm.prank(owner);
        uint256 id = nft.safeMint(bob, "ipfs://example/1.json");
        assertEq(nft.ownerOf(id), bob);
        assertEq(nft.tokenURI(id), "ipfs://example/1.json");
        (address recv, uint256 amt) = nft.royaltyInfo(id, 10_000);
        assertEq(recv, owner);
        assertEq(amt, 500);
    }
}
