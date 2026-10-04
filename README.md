# Blockchain Lab starters

[![Use this template](https://img.shields.io/badge/Use%20this-template-2ea44f?logo=github)](https://github.com/new?template_name=blockchainlab-starters&template_owner=Blockchains) [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/Blockchains/blockchainlab-starters?quickstart=1) [![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Blockchains/blockchainlab-starters) [![CI](https://github.com/Blockchains/blockchainlab-starters/actions/workflows/ci.yml/badge.svg)](https://github.com/Blockchains/blockchainlab-starters/actions/workflows/ci.yml)

Starter templates that build on code in the [Blockchains](https://github.com/Blockchains) forks: OpenZeppelin, Chainlink (feeds + CCIP), Uniswap v4, ERC-4337, Hedera/Hiero, viem + wagmi + RainbowKit, circom, Noir, The Graph, Helia/IPFS, Grok agents, Farcaster Mini Apps and Solana Anchor. Each starter also ships its own `blocks.json`. Each one builds and passes its tests in CI on every push. Catalogue and docs: **https://blockchainlab.com/forge** (index: [Blockchains/awesome-blockchainlab](https://github.com/Blockchains/awesome-blockchainlab), [Blockchains/blockchainlab-index](https://github.com/Blockchains/blockchainlab-index)).

| Starter | Stack | What it shows | Test |
|---|---|---|---|
| [foundry-oz-tokens](starters/foundry-oz-tokens) | Foundry, OpenZeppelin v5.7.0 ([fork](https://github.com/Blockchains/openzeppelin-contracts)) | Capped/burnable/permit ERC-20, ERC-721 with URI + ERC-2981 royalties, ERC-1155 multi-token with per-id caps + MINTER_ROLE, deploy script | `forge test` (12) |
| [chainlink-price-feed](starters/chainlink-price-feed) | Foundry, Chainlink AggregatorV3Interface ([fork](https://github.com/Blockchains/chainlink-evm)) | Price reads with staleness and sanity checks. Includes a fork test against the live mainnet ETH/USD feed | `forge test` (5, 1 live fork) |
| [uniswap-v4-hook](starters/uniswap-v4-hook) | Foundry, Uniswap v4 ([v4-template](https://github.com/Blockchains/v4-template), [v4-core](https://github.com/Blockchains/v4-core), [v4-periphery](https://github.com/Blockchains/v4-periphery)), OpenZeppelin uniswap-hooks | Hook with before/after swap and liquidity callbacks, plus pool/liquidity/swap scripts | `forge test` (8) |
| [erc4337-smart-account](starters/erc4337-smart-account) | Foundry, eth-infinitism v0.8.0 ([fork](https://github.com/Blockchains/account-abstraction)) | Account deployed counterfactually via initCode, owner-signed UserOps, allowlist paymaster that sponsors gas | `forge test` (4) |
| [hedera-token-sdk](starters/hedera-token-sdk) | Node 20, @hashgraph/sdk ([hiero-sdk-js fork](https://github.com/Blockchains/hiero-sdk-js)) | Create, mint and transfer an HTS fungible token. Live testnet script | `npm test` |
| [wagmi-rainbowkit-dapp](starters/wagmi-rainbowkit-dapp) | Vite, React, [wagmi](https://github.com/Blockchains/wagmi), [viem](https://github.com/Blockchains/viem), [RainbowKit](https://github.com/Blockchains/rainbowkit) | Wallet connect and live ERC-20 balance reads. Deployed to GitHub Pages | `npm test && npm run build` |
| [circom-zk-proof](starters/circom-zk-proof) | [circom](https://github.com/Blockchains/circom) 2.2.3, [circomlib](https://github.com/Blockchains/circomlib), [snarkjs](https://github.com/Blockchains/snarkjs) | Groth16 proof of a Poseidon preimage, plus an exported Solidity verifier | `npm test` |
| [noir-zk-proof](starters/noir-zk-proof) | [Noir](https://github.com/Blockchains/noir) (nargo) | Age-threshold proof that keeps the birth year private | `nargo test` |
| [subgraph-indexer](starters/subgraph-indexer) | The Graph `graph-cli`/`graph-ts` ([graph-tooling fork](https://github.com/Blockchains/graph-tooling)), Matchstick | ERC-20 Transfer → Transfer/Account entities with balances (USDC on Base); deploy to Subgraph Studio | `npm test` (codegen, build, 2 Matchstick, live RPC check) |
| [ipfs-upload](starters/ipfs-upload) | Node 20, [Helia](https://github.com/Blockchains/helia) `@helia/unixfs`, `@ipld/car` | Local UnixFS CIDs identical to `ipfs add`, NFT metadata directories, CAR export, Pinata pinning, gateway verification | `npm test` (4 + 1 with `PINATA_JWT`) |
| [ccip-crosschain](starters/ccip-crosschain) | Foundry, Chainlink CCIP + Chainlink Local | Cross-chain text + token messenger with allow-listed senders; simulator e2e tests and a live Sepolia → Base Sepolia fee quote | `forge test` (6 + 1 live fork) |
| [ai-agent-onchain](starters/ai-agent-onchain) | Node 20, Grok (xAI) tool calling, [viem](https://github.com/Blockchains/viem) | Agent that reads balances/ERC-20/chain state and sends policy-capped ETH on Base Sepolia | `npm test` (4 live + 1 Grok with `XAI_API_KEY`) |
| [farcaster-miniapp](starters/farcaster-miniapp) | Vite, `@farcaster/miniapp-sdk`, viem | Mini App with context, in-client wallet, composeCast; `fc:miniapp` embed + `/.well-known/farcaster.json` validated against the official schemas | `npm test` |
| [solana-anchor-vault](starters/solana-anchor-vault) | [Anchor](https://github.com/Blockchains/anchor) 0.32.1, Agave 2.3.13 | Per-user SOL vault program: PDAs, CPI transfers, has_one/seeds constraints, events, errors | `anchor test` (4) |

## Use
1. Click **Use this template** (creates your own copy), or open it in Codespaces or Gitpod (toolchains install automatically through `.devcontainer/setup.sh`).
2. `git submodule update --init --recursive` (the Foundry starters pin Blockchains forks as submodules).
3. `cd starters/<name>` and follow that starter's README.

Live dApp demo (GitHub Pages): https://blockchains.github.io/blockchainlab-starters/

## Licences
Starter code is MIT unless the file header says otherwise. `erc4337-smart-account` extends GPL-3.0 code from eth-infinitism, so its own files are GPL-3.0. `hedera-token-sdk` is Apache-2.0. Each dependency keeps its upstream licence, and those are listed in the [awesome-blockchainlab](https://github.com/Blockchains/awesome-blockchainlab) catalogue. None of this code is audited, so do your own review before deploying to mainnet.

<!-- blocks:start -->
## Use as a building block

> **For AI agents and builders:** read [`AGENTS.md`](AGENTS.md) (setup, commands, structure, rules), [`llms.txt`](llms.txt) (doc map) and the machine-readable [`blocks.json`](blocks.json) ([schema](https://github.com/Blockchains/.github/blob/main/docs/BLOCKS-SCHEMA.md)). How all Blockchains blocks fit together: **[Build with Blocks](https://github.com/Blockchains/.github/blob/main/docs/BUILD-WITH-BLOCKS.md)** · org catalogue: [https://blockchains.github.io/blocks.json](https://blockchains.github.io/blocks.json).

**What it exports**

| Export | Type | Install / access |
|---|---|---|
| `Use this template` | git | `GitHub template / Codespaces / Gitpod` |
| `starters/<name>/` | file | `cd starters/<name> && follow its README` |

**Minimal example** (per the starter READMEs; CI runs each starter on every push)

```bash
git clone --recursive https://github.com/Blockchains/blockchainlab-starters && cd blockchainlab-starters
cd starters/foundry-oz-tokens && forge test        # capped/permit ERC-20 + ERC-721 with royalties
cd ../noir-zk-proof && nargo test                  # private age-threshold proof
```

**Inputs → outputs**

- In: `starter choice` (directory name); `optional env` (env) MAINNET_RPC_URL, FEED, ENTRYPOINT, HEDERA_OPERATOR_ID/KEY/NETWORK
- Out: `working project skeleton` (repo) tests passing in CI

**Composes with**

- [Blockchains/blockchainlab-labs](https://github.com/Blockchains/blockchainlab-labs): learn the pattern, then start from the matching starter
- [Blockchains/blockchainlab-sdk](https://github.com/Blockchains/blockchainlab-sdk): add live data to wagmi-rainbowkit-dapp
- [Blockchains/awesome-blockchainlab](https://github.com/Blockchains/awesome-blockchainlab): the forks the starters pin
- [Blockchains/blockchainlab-compose](https://github.com/Blockchains/blockchainlab-compose): generated alternative for token/NFT ideas

**Versioning & stability:** `stable`. Each starter pins its fork dependencies as submodules or exact versions; upgrades land as PRs with CI green.
<!-- blocks:end -->

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
