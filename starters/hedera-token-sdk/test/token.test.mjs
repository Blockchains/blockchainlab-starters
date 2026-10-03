import { test } from "node:test";
import assert from "node:assert/strict";
import { AccountId, PrivateKey, TransactionId, TokenId, Transaction } from "@hashgraph/sdk";
import { buildTokenCreate, buildMint, buildTransfer } from "../src/token.mjs";

const treasury = AccountId.fromString("0.0.1001");
const key = PrivateKey.generateED25519();
const node = [AccountId.fromString("0.0.3")];

test("token create tx builds, freezes, signs and round-trips offline", async () => {
  const tx = buildTokenCreate({ name: "Lab Token", symbol: "LAB", treasury, adminKey: key.publicKey, supplyKey: key.publicKey })
    .setNodeAccountIds(node).setTransactionId(TransactionId.generate(treasury)).freeze();
  await tx.sign(key);
  const back = Transaction.fromBytes(tx.toBytes());
  assert.equal(back.tokenName, "Lab Token");
  assert.equal(back.tokenSymbol, "LAB");
  assert.equal(Number(back.decimals), 2);
  assert.equal(back.maxSupply.toNumber(), 1_000_000);
});

test("mint and transfer txs encode amounts", () => {
  const tid = TokenId.fromString("0.0.5005");
  assert.equal(buildMint(tid, 500).amount.toNumber(), 500);
  const t = buildTransfer(tid, treasury, AccountId.fromString("0.0.2002"), 25);
  const m = t.tokenTransfers.get(tid);
  assert.equal(m.get(AccountId.fromString("0.0.2002")).toNumber(), 25);
});
