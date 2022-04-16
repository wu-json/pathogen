mod accounts;

use accounts::Pathogen;
use anchor_lang::prelude::*;

declare_id!("CYmfp3tVDFtfkK5TeTYbNKRT4kQa5it57jjgERaTpZwh");

#[program]
pub mod pathogen {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePathogen<'info> {
    #[account(init, payer = creator, space = Pathogen::LEN)]
    pub pathogen: Account<'info, Pathogen>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}
