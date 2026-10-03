import { erc20Abi, formatUnits, isAddress, type Address } from "viem";
export { erc20Abi };
export function formatBalance(raw: bigint | undefined, decimals = 18, maxFrac = 4): string {
  if (raw === undefined) return "-";
  const [i, f = ""] = formatUnits(raw, decimals).split(".");
  const frac = f.slice(0, maxFrac).replace(/0+$/, "");
  return frac ? `${i}.${frac}` : i;
}
export function parseTokenAddress(s: string): Address | null {
  return isAddress(s.trim()) ? (s.trim() as Address) : null;
}
