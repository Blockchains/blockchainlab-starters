# ccip-crosschain

Cross-chain starter on [Chainlink CCIP](https://docs.chain.link/ccip): `CrossChainMessenger` sends text plus optional tokens to a contract on
another chain (fees in LINK), and the receiver only accepts allow-listed source chains and senders. It is tested end to end in Foundry with
[Chainlink Local](https://github.com/smartcontractkit/chainlink-local)'s `CCIPLocalSimulator`, plus a fork test that quotes a real fee
on the live Ethereum Sepolia → Base Sepolia lane.

```bash
npm ci                      # @chainlink/local (pulls @chainlink/contracts-ccip + OpenZeppelin versions it pins)
git submodule update --init lib/forge-std   # from the repo root: Blockchains/forge-std
forge test -vv              # 6 local simulator tests + 1 Sepolia fork test (SEPOLIA_RPC_URL overrides the public RPC)
# deploy to two testnets (router/LINK addresses: https://docs.chain.link/ccip/directory/testnet)
ROUTER=0x... LINK=0x... forge script script/Deploy.s.sol --rpc-url sepolia --account deployer --broadcast
```

After deploying on both chains: on the source call `allowDestination(destSelector, true)` and fund it with LINK (faucet: https://faucets.chain.link);
on the destination call `allowSender(sourceSelector, sourceMessenger, true)`. Then `send(destSelector, destMessenger, "gm", address(0), 0)` and follow the
message id on https://ccip.chain.link.
