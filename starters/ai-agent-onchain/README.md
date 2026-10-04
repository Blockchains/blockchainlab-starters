# ai-agent-onchain

AI agent with on-chain actions: Grok (xAI, `grok-4.7`) tool calling over [viem](https://github.com/Blockchains/wagmi) tools on Base Sepolia
(any viem chain works). Reads (balances, ERC-20, chain status) go through a public RPC; `send_native` passes a spend policy
(per-transfer cap `AGENT_MAX_ETH`, optional `AGENT_ALLOWLIST`) and only signs when `AGENT_PRIVATE_KEY` is set, otherwise it is a dry run.
No SDK: one `fetch` loop against the OpenAI-compatible xAI API, so it ports to Workers/Actions/browser easily.

```bash
npm ci
npm test                                   # policy unit tests + live Base Sepolia reads (+ live Grok tool-use test when XAI_API_KEY is set)
XAI_API_KEY=... node src/cli.js "What is the USDC balance of 0x4200000000000000000000000000000000000006? USDC is 0x036CbD53842c5426634e7929541eC2318f3dCF7e"
XAI_API_KEY=... AGENT_PRIVATE_KEY=0x... AGENT_MAX_ETH=0.001 node src/cli.js "send 0.0005 ETH to 0x..."   # testnet key only
```

Add a tool: append a JSON-schema spec to `TOOL_SPECS` and an implementation in `makeTools` (`src/tools.js`).
Run it on a schedule with GitHub Actions (store `XAI_API_KEY` / `AGENT_PRIVATE_KEY` as secrets) for a serverless agent.
Bigger frameworks in the catalogue: [Blockchains/eliza](https://github.com/Blockchains/eliza), [Blockchains/intentkit](https://github.com/Blockchains/intentkit).
