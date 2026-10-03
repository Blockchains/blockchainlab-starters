# wagmi-rainbowkit-dapp

A Vite + React dApp using [RainbowKit](https://github.com/Blockchains/rainbowkit) for the wallet connect, [wagmi](https://github.com/Blockchains/wagmi) hooks and [viem](https://github.com/Blockchains/viem). It reads the symbol, decimals and your balance for any ERC-20 on Sepolia, Base Sepolia, Hedera testnet, Ethereum or Base.

```bash
npm ci
npm run dev        # http://localhost:5173
npm test && npm run build
VITE_WC_PROJECT_ID=<reown cloud id> npm run build   # optional: enables WalletConnect/mobile wallets
```
Without a project id the app uses browser-injected wallets (MetaMask, Rabby, Coinbase extension and so on). Every push to `main` deploys it to GitHub Pages: https://blockchains.github.io/blockchainlab-starters/
