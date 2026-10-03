// Local, NON-PRODUCTION trusted setup (single contributor). For production use a public ptau + ceremony.
import * as snarkjs from "snarkjs";
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("build", { recursive: true });
const curve = await snarkjs.curves.getCurveFromName("bn128");
await snarkjs.powersOfTau.newAccumulator(curve, 10, "build/pot_0.ptau");
await snarkjs.powersOfTau.contribute("build/pot_0.ptau", "build/pot_1.ptau", "lab", "entropy-" + Date.now());
await snarkjs.powersOfTau.preparePhase2("build/pot_1.ptau", "build/pot_final.ptau");
await snarkjs.zKey.newZKey("build/preimage.r1cs", "build/pot_final.ptau", "build/preimage_0.zkey");
await snarkjs.zKey.contribute("build/preimage_0.zkey", "build/preimage.zkey", "lab", "entropy2-" + Date.now());
const vkey = await snarkjs.zKey.exportVerificationKey("build/preimage.zkey");
writeFileSync("build/verification_key.json", JSON.stringify(vkey, null, 2));
const sol = await snarkjs.zKey.exportSolidityVerifier("build/preimage.zkey", { groth16: (await import("node:fs")).readFileSync("node_modules/snarkjs/templates/verifier_groth16.sol.ejs", "utf8") });
writeFileSync("build/Groth16Verifier.sol", sol);
await curve.terminate();
console.log("setup ok: build/preimage.zkey, verification_key.json, Groth16Verifier.sol");
