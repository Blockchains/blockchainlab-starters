import { describe, it, expect } from "vitest";
import { formatBalance, parseTokenAddress, erc20Abi } from "./erc20";
describe("erc20 helpers", () => {
  it("formats balances", () => {
    expect(formatBalance(1234567890000000000n)).toBe("1.2345");
    expect(formatBalance(2n * 10n ** 18n)).toBe("2");
    expect(formatBalance(undefined)).toBe("-");
    expect(formatBalance(1500000n, 6)).toBe("1.5");
  });
  it("validates addresses", () => {
    expect(parseTokenAddress("0x5FbDB2315678afecb367f032d93F642f64180aa3")).not.toBeNull();
    expect(parseTokenAddress("nope")).toBeNull();
  });
  it("ships the standard ERC-20 ABI from viem", () => {
    expect(erc20Abi.some((x) => x.type === "function" && x.name === "balanceOf")).toBe(true);
  });
});
