# circom-zk-proof

Proves knowledge of `(secret, salt)` with `Poseidon(secret, salt) == hash` without revealing them. Uses [circom](https://github.com/Blockchains/circom) 2.2.3, [circomlib](https://github.com/Blockchains/circomlib) and [snarkjs](https://github.com/Blockchains/snarkjs) (Groth16, BN254).

```bash
npm ci
npm test   # compile -> local powers of tau + zkey -> prove -> verify; also checks a tampered input and a bad witness are rejected
```
Outputs land in `build/`: `verification_key.json` and `Groth16Verifier.sol` (an on-chain verifier you can drop into a Foundry project). The setup is a single-contributor local ceremony meant for development only. For production, use a public Powers of Tau file and a multi-party phase-2.
