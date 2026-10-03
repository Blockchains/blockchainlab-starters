# erc4337-smart-account

An end-to-end ERC-4337 **v0.8.0** flow on the real `EntryPoint` from [Blockchains/account-abstraction](https://github.com/Blockchains/account-abstraction) (GPL-3.0, tag `v0.8.0`):
- a `SimpleAccount` deployed counterfactually through `initCode` (`SimpleAccountFactory` + `SenderCreator`)
- an owner-signed `PackedUserOperation` (EIP-712 userOpHash) passed to `handleOps` by a bundler EOA
- `AllowlistPaymaster` (extends `BasePaymaster`), which sponsors gas for allowlisted accounts so a user with zero ETH can still transact
- negative tests: a wrong signer (AA24) and a sponsor that refuses (AA34)

```bash
git submodule update --init --recursive
forge test -vv
# Deploy factory + paymaster against the canonical v0.8 EntryPoint 0x4337084D9E255Ff0702461CF8895CE9E3b5Ff108
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --account deployer --broadcast
```
To send real UserOps, point a bundler (e.g. Pimlico, Alchemy, or a self-hosted [Blockchains](https://github.com/Blockchains) fork) at the EntryPoint. Licence: GPL-3.0, inherited from eth-infinitism.
