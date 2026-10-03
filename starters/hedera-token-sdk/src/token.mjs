import { TokenCreateTransaction, TokenMintTransaction, TransferTransaction, TokenType, TokenSupplyType, Hbar } from "@hashgraph/sdk";

/** Build (unsigned, unfrozen) HTS fungible token create tx. */
export function buildTokenCreate({ name, symbol, decimals = 2, initialSupply = 0, maxSupply = 1_000_000, treasury, adminKey, supplyKey }) {
  return new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setDecimals(decimals)
    .setInitialSupply(initialSupply)
    .setTokenType(TokenType.FungibleCommon)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(maxSupply)
    .setTreasuryAccountId(treasury)
    .setAdminKey(adminKey)
    .setSupplyKey(supplyKey)
    .setMaxTransactionFee(new Hbar(30));
}
export const buildMint = (tokenId, amount) => new TokenMintTransaction().setTokenId(tokenId).setAmount(amount);
export const buildTransfer = (tokenId, from, to, amount) =>
  new TransferTransaction().addTokenTransfer(tokenId, from, -amount).addTokenTransfer(tokenId, to, amount);
