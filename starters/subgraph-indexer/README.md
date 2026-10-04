# subgraph-indexer

[The Graph](https://thegraph.com) subgraph starter built with `graph-cli` / `graph-ts` from [Blockchains/graph-tooling](https://github.com/Blockchains/graph-tooling).
Indexes ERC-20 `Transfer` events (USDC on Base by default) into `Transfer` and `Account` entities (balance, sent/received counts,
derived transfer lists) and unit-tests the mapping with [Matchstick](https://github.com/LimeChain/matchstick).

```bash
npm ci
npm test               # graph codegen + graph build (WASM) + Matchstick tests + live check that the data source emits Transfers
npm run check:live     # only the live RPC check
# deploy to Subgraph Studio (free tier): create a subgraph at https://thegraph.com/studio, then
npx graph auth <DEPLOY_KEY> && SUBGRAPH_SLUG=<slug> npm run deploy:studio
```

Change the token/network: edit `subgraph.yaml` (`network`, `source.address`, `startBlock`) — any ERC-20 on any Graph-supported network works.
Matchstick needs `libpq5` on Linux (`sudo apt-get install libpq5`; CI uses ubuntu-22.04).

Query example once deployed:
```graphql
{ accounts(first: 5, orderBy: balance, orderDirection: desc) { id balance sentCount receivedCount } }
```
