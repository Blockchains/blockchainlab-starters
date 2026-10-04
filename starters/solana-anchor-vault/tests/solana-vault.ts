import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { assert } from "chai";
import { SolanaVault } from "../target/types/solana_vault";

const { LAMPORTS_PER_SOL, PublicKey, Keypair, SystemProgram } = anchor.web3;

describe("solana-vault", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.solanaVault as Program<SolanaVault>;
  const owner = provider.wallet.publicKey;
  const [state] = PublicKey.findProgramAddressSync([Buffer.from("state"), owner.toBuffer()], program.programId);
  const [vault] = PublicKey.findProgramAddressSync([Buffer.from("vault"), owner.toBuffer()], program.programId);

  it("initializes the owner's vault", async () => {
    await program.methods.initialize().rpc();
    const s = await program.account.vaultState.fetch(state);
    assert.ok(s.owner.equals(owner));
    assert.equal(s.totalDeposited.toNumber(), 0);
  });

  it("accepts deposits from anyone", async () => {
    await program.methods.deposit(new anchor.BN(LAMPORTS_PER_SOL)).accounts({ state }).rpc();
    const friend = Keypair.generate();
    const sig = await provider.connection.requestAirdrop(friend.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig, "confirmed");
    await program.methods.deposit(new anchor.BN(LAMPORTS_PER_SOL / 2)).accounts({ payer: friend.publicKey, state }).signers([friend]).rpc();
    const s = await program.account.vaultState.fetch(state);
    assert.equal(s.totalDeposited.toNumber(), 1.5 * LAMPORTS_PER_SOL);
    assert.equal(await provider.connection.getBalance(vault), 1.5 * LAMPORTS_PER_SOL);
  });

  it("lets only the owner withdraw", async () => {
    await program.methods.withdraw(new anchor.BN(LAMPORTS_PER_SOL / 2)).rpc();
    const s = await program.account.vaultState.fetch(state);
    assert.equal(s.totalWithdrawn.toNumber(), LAMPORTS_PER_SOL / 2);
    const mallory = Keypair.generate();
    const sig = await provider.connection.requestAirdrop(mallory.publicKey, LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig, "confirmed");
    try {
      await program.methods.withdraw(new anchor.BN(1)).accounts({ owner: mallory.publicKey }).accountsPartial({ state, vault }).signers([mallory]).rpc();
      assert.fail("mallory withdrew");
    } catch (e) {
      assert.match(String(e), /ConstraintSeeds|ConstraintHasOne|seeds constraint|has one/i);
    }
  });

  it("rejects zero and over-balance withdrawals", async () => {
    for (const [amt, re] of [[0, /ZeroAmount/], [100 * LAMPORTS_PER_SOL, /InsufficientFunds/]] as const) {
      try {
        await program.methods.withdraw(new anchor.BN(amt)).rpc();
        assert.fail("should revert");
      } catch (e) {
        assert.match(String(e), re);
      }
    }
  });
});
