# solana-anchor-vault

Solana starter on [Anchor](https://github.com/Blockchains/anchor) 0.32.1: a per-user **SOL vault** program — PDA state account + PDA
lamport vault, deposits from anyone via system-program CPI, owner-only withdrawals signed with PDA seeds, `has_one` + seeds constraints,
events and custom errors — with TypeScript (mocha) tests against a local validator.

```bash
# toolchain: Agave 2.3.13 + Anchor 0.32.1 (CI installs both; locally: https://www.anchor-lang.com/docs/installation)
npm ci
anchor keys sync     # writes your program id into lib.rs / Anchor.toml (first time)
anchor test          # builds the SBF program, starts solana-test-validator, runs tests/solana-vault.ts (4 tests)
# devnet
solana config set --url devnet && solana airdrop 2 && anchor deploy --provider.cluster devnet
```

`Cargo.lock` is resolved for Rust 1.84 (the Agave 2.3 platform-tools compiler) using `rust-version = "1.84"` and
`CARGO_RESOLVER_INCOMPATIBLE_RUST_VERSIONS=fallback cargo generate-lockfile` — re-run that after adding crates if the SBF build
complains about `edition2024`.

Front end: pair with [Blockchains/wallet-adapter](https://github.com/Blockchains/wallet-adapter) and the generated IDL in `target/idl/`.
