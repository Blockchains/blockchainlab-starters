# AGENTS.md: blockchainlab-starters

Instructions for AI coding agents (Grok, Cursor, Claude Code, Codex, Copilot and others) working **in** this repo or **using it as a building block**. Humans: see [README.md](README.md).

## What this is

Template repo of 8 CI-tested starters built on Blockchains forks: foundry-oz-tokens, chainlink-price-feed, uniswap-v4-hook, erc4337-smart-account, hedera-token-sdk, wagmi-rainbowkit-dapp, circom-zk-proof and noir-zk-proof.

- Kind: template · stability: `stable` · licence: MIT
- Machine-readable manifest: [`blocks.json`](blocks.json) (schema: [BLOCKS-SCHEMA](https://github.com/Blockchains/.github/blob/main/docs/BLOCKS-SCHEMA.md))
- How it fits with the other Blockchains repos: [Build with Blocks](https://github.com/Blockchains/.github/blob/main/docs/BUILD-WITH-BLOCKS.md)

## Setup

```bash
git submodule update --init --recursive
bash .devcontainer/setup.sh   # optional: installs all toolchains
```

## Build and test

```bash
cd starters/<name> && forge build && forge test   # Foundry starters
cd starters/<name> && npm ci && npm test   # Node starters
cd starters/noir-zk-proof && nargo test
```

Tests hit **live** public networks/APIs (the org rule is no mocks). A failure can be an upstream outage: re-run before changing code.

## Structure

| Path | What |
|---|---|
| `starters/<name>/` | one self-contained starter each, with its own README |
| `.devcontainer/, .gitpod.yml` | toolchain setup |
| `.github/workflows/ci.yml` | matrix build/test per starter + gitleaks |

## Conventions

- Starters stay independent: no shared code between them.
- MIT unless a file header says otherwise (erc4337-smart-account is GPL-3.0, hedera-token-sdk Apache-2.0).

## Extension points

- New starter: `starters/<name>/` with README + tests, add it to the CI matrix and the README table.

## Do

- Keep each starter runnable with one command.

## Don't

- Couple starters to each other.
- Invent data, mock network responses in shipped code, or hard-code values that should come from the live source; every repo here is 'no mocks, real data'.
- Commit secrets, keys or `.env` files. Run `gitleaks` before pushing; CI and the org policy reject leaks.

## Using it from another project

- **Use this template** (git): `GitHub template / Codespaces / Gitpod`
- **starters/<name>/** (file): `cd starters/<name> && follow its README`

See the README section [Use as a building block](README.md#use-as-a-building-block) for a copy-paste example.

## Related blocks

- [Blockchains/blockchainlab-labs](https://github.com/Blockchains/blockchainlab-labs): learn the pattern, then start from the matching starter
- [Blockchains/blockchainlab-sdk](https://github.com/Blockchains/blockchainlab-sdk): add live data to wagmi-rainbowkit-dapp
- [Blockchains/awesome-blockchainlab](https://github.com/Blockchains/awesome-blockchainlab): the forks the starters pin
- [Blockchains/blockchainlab-compose](https://github.com/Blockchains/blockchainlab-compose): generated alternative for token/NFT ideas
