# noir-zk-proof

A Noir circuit that proves `current_year - birth_year >= min_age` while keeping `birth_year` private. Uses [Noir](https://github.com/Blockchains/noir).

```bash
nargo test      # 3 tests (passes / minor fails / future birth fails)
nargo execute   # solves the witness from Prover.toml
# Proofs + Solidity verifier with Barretenberg:
#   curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/master/barretenberg/bbup/install | bash && bbup
#   bb prove -b target/age_check.json -w target/age_check.gz -o target && bb write_vk -b target/age_check.json -o target && bb verify -k target/vk -p target/proof
```
