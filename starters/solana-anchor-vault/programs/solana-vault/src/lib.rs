use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("HgXx2egLYpTvXXMGuAAnvmcSgRiWijMyXUijDdP1NiYG");

/// Per-user SOL vault: a PDA state account tracks totals, a PDA system account holds the lamports.
/// Only the owner can withdraw; deposits from anyone are credited to the owner's vault.
#[program]
pub mod solana_vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.owner = ctx.accounts.owner.key();
        state.total_deposited = 0;
        state.total_withdrawn = 0;
        state.state_bump = ctx.bumps.state;
        state.vault_bump = ctx.bumps.vault;
        emit!(VaultInitialized { owner: state.owner });
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);
        transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                Transfer { from: ctx.accounts.payer.to_account_info(), to: ctx.accounts.vault.to_account_info() },
            ),
            amount,
        )?;
        let state = &mut ctx.accounts.state;
        state.total_deposited = state.total_deposited.checked_add(amount).ok_or(VaultError::Overflow)?;
        emit!(Deposited { owner: state.owner, from: ctx.accounts.payer.key(), amount });
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        require!(amount > 0, VaultError::ZeroAmount);
        require!(ctx.accounts.vault.lamports() >= amount, VaultError::InsufficientFunds);
        let owner_key = ctx.accounts.owner.key();
        let seeds: &[&[u8]] = &[b"vault", owner_key.as_ref(), &[ctx.accounts.state.vault_bump]];
        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                Transfer { from: ctx.accounts.vault.to_account_info(), to: ctx.accounts.owner.to_account_info() },
                &[seeds],
            ),
            amount,
        )?;
        let state = &mut ctx.accounts.state;
        state.total_withdrawn = state.total_withdrawn.checked_add(amount).ok_or(VaultError::Overflow)?;
        emit!(Withdrawn { owner: owner_key, amount });
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct VaultState {
    pub owner: Pubkey,
    pub total_deposited: u64,
    pub total_withdrawn: u64,
    pub state_bump: u8,
    pub vault_bump: u8,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = owner, space = 8 + VaultState::INIT_SPACE, seeds = [b"state", owner.key().as_ref()], bump)]
    pub state: Account<'info, VaultState>,
    /// CHECK: lamports-only PDA owned by the system program
    #[account(seeds = [b"vault", owner.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut, seeds = [b"state", state.owner.as_ref()], bump = state.state_bump)]
    pub state: Account<'info, VaultState>,
    #[account(mut, seeds = [b"vault", state.owner.as_ref()], bump = state.vault_bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut, seeds = [b"state", owner.key().as_ref()], bump = state.state_bump, has_one = owner)]
    pub state: Account<'info, VaultState>,
    #[account(mut, seeds = [b"vault", owner.key().as_ref()], bump = state.vault_bump)]
    pub vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[event]
pub struct VaultInitialized {
    pub owner: Pubkey,
}

#[event]
pub struct Deposited {
    pub owner: Pubkey,
    pub from: Pubkey,
    pub amount: u64,
}

#[event]
pub struct Withdrawn {
    pub owner: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum VaultError {
    #[msg("amount must be greater than zero")]
    ZeroAmount,
    #[msg("vault balance is too low")]
    InsufficientFunds,
    #[msg("arithmetic overflow")]
    Overflow,
}
