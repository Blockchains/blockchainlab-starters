# foundry-oz-tokens

ERC-20 (capped, burnable, EIP-2612 permit) and ERC-721 (per-token URI, ERC-2981 royalties), built on OpenZeppelin Contracts **v5.7.0** from [Blockchains/openzeppelin-contracts](https://github.com/Blockchains/openzeppelin-contracts) (pinned submodule, tag `v5.7.0`).

```bash
git submodule update --init --recursive
forge build && forge test -vv
# local deploy
anvil &   # second terminal
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <anvil key #0>
# testnet: import a key with `cast wallet import deployer --interactive`, then
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --account deployer --broadcast --verify
```
Files: `src/LabToken.sol`, `src/LabNFT.sol`, `test/LabToken.t.sol` (mint cap, owner-only, permit signature, fuzzed burn, NFT royalty), `script/Deploy.s.sol`.
