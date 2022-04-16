mod errors;
mod schemas;

use anchor_lang::prelude::*;
use errors::CreatePathogenErrorCode;
use schemas::Pathogen;

declare_id!("CYmfp3tVDFtfkK5TeTYbNKRT4kQa5it57jjgERaTpZwh");

#[program]
pub mod pathogen {
    use super::*;

    pub fn create_pathogen(ctx: Context<CreatePathogen>, name: String, code: String) -> Result<()> {
        let pathogen: &mut Account<Pathogen> = &mut ctx.accounts.pathogen;
        let creator: &Signer = &ctx.accounts.creator;
        let clock: Clock = Clock::get().unwrap();

        if name.chars().count() > 50 {
            return Err(CreatePathogenErrorCode::NameTooLong.into());
        }
        if code.chars().count() > 25 {
            return Err(CreatePathogenErrorCode::CodeTooLong.into());
        }

        pathogen.creator = *creator.key;
        pathogen.created_at = clock.unix_timestamp;
        pathogen.name = name;
        pathogen.code = code;
        pathogen.total_profiles = 0;
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
