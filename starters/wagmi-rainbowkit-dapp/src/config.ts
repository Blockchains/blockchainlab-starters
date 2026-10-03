import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { injectedWallet, metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia, base, baseSepolia, hederaTestnet } from "wagmi/chains";

// Optional WalletConnect Cloud projectId (https://cloud.reown.com). It is a public id, not a secret.
// Without it the app still works with browser-injected wallets (MetaMask, Rabby, Coinbase extension, ...).
const projectId: string | undefined = import.meta.env.VITE_WC_PROJECT_ID || undefined;

export const chains = [sepolia, baseSepolia, hederaTestnet, mainnet, base] as const;

const connectors = projectId
  ? connectorsForWallets([{ groupName: "Wallets", wallets: [injectedWallet, metaMaskWallet, coinbaseWallet, rainbowWallet, walletConnectWallet] }], { appName: "Blockchain Lab dApp", projectId })
  : connectorsForWallets([{ groupName: "Browser wallets", wallets: [injectedWallet] }], { appName: "Blockchain Lab dApp", projectId: "injected-only" });

export const config = createConfig({
  connectors,
  chains,
  transports: Object.fromEntries(chains.map((c) => [c.id, http()])) as Record<(typeof chains)[number]["id"], ReturnType<typeof http>>,
});
export const walletConnectEnabled = Boolean(projectId);
