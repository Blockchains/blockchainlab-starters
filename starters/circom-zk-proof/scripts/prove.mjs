import * as snarkjs from "snarkjs";
import { buildPoseidon } from "circomlibjs";
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const poseidon = await buildPoseidon();
const secret = 123456789n, salt = 42n;
const hash = poseidon.F.toObject(poseidon([secret, salt]));
const { proof, publicSignals } = await snarkjs.groth16.fullProve(
  { secret: secret.toString(), salt: salt.toString(), hash: hash.toString() },
  "build/preimage_js/preimage.wasm", "build/preimage.zkey");
const vkey = JSON.parse(readFileSync("build/verification_key.json", "utf8"));
assert.equal(await snarkjs.groth16.verify(vkey, publicSignals, proof), true, "valid proof must verify");
assert.equal(await snarkjs.groth16.verify(vkey, [(hash + 1n).toString()], proof), false, "tampered public input must fail");
let threw = false;
try { await snarkjs.groth16.fullProve({ secret: "1", salt: "2", hash: hash.toString() }, "build/preimage_js/preimage.wasm", "build/preimage.zkey"); } catch { threw = true; }
assert.equal(threw, true, "wrong witness must not produce a proof");
console.log("calldata:", (await snarkjs.groth16.exportSolidityCallData(proof, publicSignals)).slice(0, 80) + "...");
console.log("PASS: proof verified, tampered input rejected, bad witness rejected");
process.exit(0);
