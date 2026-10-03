// Live run on Hedera testnet. Needs env HEDERA_OPERATOR_ID (0.0.x) and HEDERA_OPERATOR_KEY (DER or hex ECDSA/ED25519).
// Get free testnet credentials at https://portal.hedera.com . Never commit keys.
import { Client, AccountId, PrivateKey } from "@hashgraph/sdk";
import { buildTokenCreate, buildMint } from "./token.mjs";

const id = process.env.HEDERA_OPERATOR_ID, key = process.env.HEDERA_OPERATOR_KEY;
if (!id || !key) { console.error("Set HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY"); process.exit(1); }
const operatorId = AccountId.fromString(id);
const operatorKey = PrivateKey.fromStringDer ? (() => { try { return PrivateKey.fromStringDer(key); } catch { return PrivateKey.fromStringECDSA(key); } })() : PrivateKey.fromString(key);
const client = Client.forName(process.env.HEDERA_NETWORK || "testnet").setOperator(operatorId, operatorKey);

const tx = await buildTokenCreate({ name: "Lab Token", symbol: "LAB", treasury: operatorId, adminKey: operatorKey.publicKey, supplyKey: operatorKey.publicKey, initialSupply: 1000 }).freezeWith(client).sign(operatorKey);
const receipt = await (await tx.execute(client)).getReceipt(client);
console.log("Token created:", receipt.tokenId.toString(), `https://hashscan.io/${process.env.HEDERA_NETWORK || "testnet"}/token/${receipt.tokenId}`);
const mint = await (await (await buildMint(receipt.tokenId, 500).freezeWith(client).sign(operatorKey)).execute(client)).getReceipt(client);
console.log("Minted 500, status:", mint.status.toString());
client.close();
