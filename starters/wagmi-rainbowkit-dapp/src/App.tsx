import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useReadContracts } from "wagmi";
import { erc20Abi, formatBalance, parseTokenAddress } from "./erc20";

export default function App() {
  const { address, chain } = useAccount();
  const [tokenInput, setTokenInput] = useState("");
  const token = parseTokenAddress(tokenInput);
  const { data } = useReadContracts({
    allowFailure: false,
    query: { enabled: Boolean(token && address) },
    contracts: token && address ? [
      { address: token, abi: erc20Abi, functionName: "symbol" },
      { address: token, abi: erc20Abi, functionName: "decimals" },
      { address: token, abi: erc20Abi, functionName: "balanceOf", args: [address] },
    ] : [],
  });
  const [symbol, decimals, balance] = (data ?? []) as [string?, number?, bigint?];
  return (
    <main style={{ fontFamily: "system-ui", maxWidth: 640, margin: "48px auto", padding: 16 }}>
      <h1>Blockchain Lab dApp starter</h1>
      <p>RainbowKit + wagmi + viem. Built from the <a href="https://github.com/Blockchains/blockchainlab-starters">Blockchains starters</a>.</p>
      <ConnectButton />
      <section style={{ marginTop: 24 }}>
        <label>ERC-20 address on {chain?.name ?? "your network"}<br />
          <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="0x..." style={{ width: "100%", padding: 8 }} />
        </label>
        {token && address && <p>Balance: <b>{formatBalance(balance, decimals ?? 18)}</b> {symbol}</p>}
        {!address && <p>Connect a wallet to read balances.</p>}
      </section>
    </main>
  );
}
