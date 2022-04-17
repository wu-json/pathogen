mod errors;
mod schemas;

use anchor_lang::prelude::*;
use errors::{CreatePathogenErrorCode, CreateProfileErrorCode};
use schemas::{Pathogen, Profile};

declare_id!("CYmfp3tVDFtfkK5TeTYbNKRT4kQa5it57jjgERaTpZwh");

#[program]
pub mod pathogen {
    use super::*;

    pub fn create_pathogen(ctx: Context<CreatePathogen>, code: String, name: String) -> Result<()> {
        let pathogen: &mut Account<Pathogen> = &mut ctx.accounts.pathogen;
        let creator: &Signer = &ctx.accounts.creator;
        let clock: Clock = Clock::get().unwrap();

        if code.chars().count() == 0 {
            return Err(CreatePathogenErrorCode::CodeEmpty.into());
        }
        if code.chars().count() > 25 {
            return Err(CreatePathogenErrorCode::CodeTooLong.into());
        }
        if name.chars().count() == 0 {
            return Err(CreatePathogenErrorCode::NameEmpty.into());
        }
        if name.chars().count() > 50 {
            return Err(CreatePathogenErrorCode::NameTooLong.into());
        }

        pathogen.creator = *creator.key;
        pathogen.created_at = clock.unix_timestamp;
        pathogen.code = code;
        pathogen.name = name;
        pathogen.total_profiles = 0;
        Ok(())
    }

    pub fn create_profile(
        ctx: Context<CreateProfile>,
        latest_test_result: String,
        latest_test_result_date: i64,
        age: u8,
    ) -> Result<()> {
        let profile: &mut Account<Profile> = &mut ctx.accounts.profile;
        let pathogen: &mut Account<Pathogen> = &mut ctx.accounts.pathogen;
        let creator: &Signer = &ctx.accounts.creator;

        if latest_test_result.chars().count() == 0 {
            return Err(CreateProfileErrorCode::TestResultEmpty.into());
        }
        if latest_test_result.chars().count() > 25 {
            return Err(CreateProfileErrorCode::TestResultTooLong.into());
        }

        pathogen.total_profiles = pathogen.total_profiles + 1;
        profile.creator = *creator.key;
        profile.pathogen = ctx.accounts.pathogen.key();
        profile.latest_test_result = latest_test_result;
        profile.latest_test_result_date = latest_test_result_date;
        profile.age = age;
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

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(init, payer = creator, space = Profile::LEN)]
    pub profile: Account<'info, Profile>,
    #[account(mut)]
    pub pathogen: Account<'info, Pathogen>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}
