# hedera-token-sdk

Creates, mints and transfers a Hedera Token Service fungible token with `@hashgraph/sdk`, the Hiero JavaScript SDK ([Blockchains/hiero-sdk-js](https://github.com/Blockchains/hiero-sdk-js), Apache-2.0).

```bash
npm ci
npm test                      # builds, freezes, signs and decodes real transactions offline
HEDERA_OPERATOR_ID=0.0.x HEDERA_OPERATOR_KEY=302e... npm run create-token   # live on testnet, prints the HashScan link
```
Free testnet account: https://portal.hedera.com. Keep keys in your shell or a secret manager, never in git.
