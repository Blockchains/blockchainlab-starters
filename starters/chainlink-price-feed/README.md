# chainlink-price-feed

`PriceConsumer` reads a Chainlink Data Feed and rejects stale or non-positive answers. The interface is vendored, with attribution, from [Blockchains/chainlink-evm](https://github.com/Blockchains/chainlink-evm) (MIT).

```bash
git submodule update --init --recursive
forge test -vv            # unit tests + live fork test against the real mainnet ETH/USD feed
MAINNET_RPC_URL=https://... forge test --match-test Fork   # use your own RPC instead of the public PublicNode endpoint
FEED=0x694AA1769357215DE4FAC081bf1f309aDC325306 forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --account deployer --broadcast
```
Feed addresses: https://docs.chain.link/data-feeds/price-feeds/addresses
