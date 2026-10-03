# uniswap-v4-hook

A Uniswap v4 hook starter taken from [Blockchains/v4-template](https://github.com/Blockchains/v4-template) (MIT, a fork of Uniswap/v4-template). It runs on [v4-core](https://github.com/Blockchains/v4-core) and [v4-periphery](https://github.com/Blockchains/v4-periphery) through OpenZeppelin `uniswap-hooks`. `src/Counter.sol` counts swaps and liquidity changes per pool using `beforeSwap`/`afterSwap`/`beforeAddLiquidity`/`beforeRemoveLiquidity`.

```bash
git submodule update --init --recursive
forge test -vv
# Local v4 deployment + hook + pool + liquidity + swap:
anvil --code-size-limit 40000 &
forge script script/testing/00_DeployV4.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <anvil key>
forge script script/00_DeployHook.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key <anvil key>
```
Hook addresses must encode their permission flags: `script/00_DeployHook.s.sol` mines a CREATE2 salt with `HookMiner`. Licence note: v4-core is BUSL-1.1 for production deployments (with MIT interfaces). Read `lib/uniswap-hooks/lib/v4-core/licenses` before deploying a fork of the core.
