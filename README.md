# Blockchain Lab starters

[![Use this template](https://img.shields.io/badge/Use%20this-template-2ea44f?logo=github)](https://github.com/new?template_name=blockchainlab-starters&template_owner=Blockchains) [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Blockchains/blockchainlab-starters?quickstart=1) [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Blockchains/blockchainlab-starters) [![CI](https://github.com/Blockchains/blockchainlab-starters/actions/workflows/ci.yml/badge.svg)](https://github.com/Blockchains/blockchainlab-starters/actions/workflows/ci.yml)

Starter templates that build on code in the [Blockchains](https://github.com/Blockchains) forks: OpenZeppelin, Chainlink, Uniswap v4, ERC-4337, Hedera/Hiero, viem + wagmi + RainbowKit, circom and Noir. Each one builds and passes its tests in CI on every push. Catalogue and docs: **https://blockchainlab.com/forge** (index: [Blockchains/awesome-blockchainlab](https://github.com/Blockchains/awesome-blockchainlab), [Blockchains/blockchainlab-index](https://github.com/Blockchains/blockchainlab-index)).

| Starter | Stack | What it shows | Test |
|---|---|---|---|
| [foundry-oz-tokens](starters/foundry-oz-tokens) | Foundry, OpenZeppelin v5.7.0 ([fork](https://github.com/Blockchains/openzeppelin-contracts)) | Capped/burnable/permit ERC-20, ERC-721 with URI + ERC-2981 royalties, deploy script | `forge test` (6) |
| [chainlink-price-feed](starters/chainlink-price-feed) | Foundry, Chainlink AggregatorV3Interface ([fork](https://github.com/Blockchains/chainlink-evm)) | Price reads with staleness and sanity checks. Includes a fork test against the live mainnet ETH/USD feed | `forge test` (5, 1 live fork) |
| [uniswap-v4-hook](starters/uniswap-v4-hook) | Foundry, Uniswap v4 ([v4-template](https://github.com/Blockchains/v4-template), [v4-core](https://github.com/Blockchains/v4-core), [v4-periphery](https://github.com/Blockchains/v4-periphery)), OpenZeppelin uniswap-hooks | Hook with before/after swap and liquidity callbacks, plus pool/liquidity/swap scripts | `forge test` (8) |
| [erc4337-smart-account](starters/erc4337-smart-account) | Foundry, eth-infinitism v0.8.0 ([fork](https://github.com/Blockchains/account-abstraction)) | Account deployed counterfactually via initCode, owner-signed UserOps, allowlist paymaster that sponsors gas | `forge test` (4) |
| [hedera-token-sdk](starters/hedera-token-sdk) | Node 20, @hashgraph/sdk ([hiero-sdk-js fork](https://github.com/Blockchains/hiero-sdk-js)) | Create, mint and transfer an HTS fungible token. Live testnet script | `npm test` |
| [wagmi-rainbowkit-dapp](starters/wagmi-rainbowkit-dapp) | Vite, React, [wagmi](https://github.com/Blockchains/wagmi), [viem](https://github.com/Blockchains/viem), [RainbowKit](https://github.com/Blockchains/rainbowkit) | Wallet connect and live ERC-20 balance reads. Deployed to GitHub Pages | `npm test && npm run build` |
| [circom-zk-proof](starters/circom-zk-proof) | [circom](https://github.com/Blockchains/circom) 2.2.3, [circomlib](https://github.com/Blockchains/circomlib), [snarkjs](https://github.com/Blockchains/snarkjs) | Groth16 proof of a Poseidon preimage, plus an exported Solidity verifier | `npm test` |
| [noir-zk-proof](starters/noir-zk-proof) | [Noir](https://github.com/Blockchains/noir) (nargo) | Age-threshold proof that keeps the birth year private | `nargo test` |

## Use
1. Click **Use this template** (creates your own copy), or open it in Codespaces or Gitpod (toolchains install automatically through `.devcontainer/setup.sh`).
2. `git submodule update --init --recursive` (the Foundry starters pin Blockchains forks as submodules).
3. `cd starters/<name>` and follow that starter's README.

Live dApp demo (GitHub Pages): https://blockchains.github.io/blockchainlab-starters/

## Licences
Starter code is MIT unless the file header says otherwise. `erc4337-smart-account` extends GPL-3.0 code from eth-infinitism, so its own files are GPL-3.0. `hedera-token-sdk` is Apache-2.0. Each dependency keeps its upstream licence, and those are listed in the [awesome-blockchainlab](https://github.com/Blockchains/awesome-blockchainlab) catalogue. None of this code is audited, so do your own review before deploying to mainnet.

## Configuration

Most starters need no configuration. Optional variables:

| Variable | Starter | Purpose |
|---|---|---|
| `MAINNET_RPC_URL` | chainlink-price-feed | RPC for the live mainnet fork test |
| `FEED` | chainlink-price-feed (`script/Deploy.s.sol`) | Chainlink feed address to deploy against |
| `ENTRYPOINT` | erc4337-smart-account (`script/Deploy.s.sol`) | EntryPoint address |
| `HEDERA_OPERATOR_ID`, `HEDERA_OPERATOR_KEY`, `HEDERA_NETWORK` | hedera-token-sdk | Hedera testnet account for the live script |

See each starter's README for details.

## Contributing

Issues and pull requests are welcome. Please read the [contributing guide](https://github.com/Blockchains/.github/blob/main/CONTRIBUTING.md), [code of conduct](https://github.com/Blockchains/.github/blob/main/CODE_OF_CONDUCT.md) and [security policy](https://github.com/Blockchains/.github/blob/main/SECURITY.md) first.

---
Built by Blockchain Lab — [blockchainlab.com](https://blockchainlab.com/?utm_source=github&utm_medium=readme&utm_campaign=blockchainlab-starters)
