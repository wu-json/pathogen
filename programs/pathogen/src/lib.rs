mod errors;
mod schemas;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};
use errors::{CreatePathogenErrorCode, CreateProfileErrorCode};
use schemas::{Pathogen, Profile};

declare_id!("CYmfp3tVDFtfkK5TeTYbNKRT4kQa5it57jjgERaTpZwh");

#[program]
pub mod pathogen {
    use super::*;

    pub fn create_pathogen(
        ctx: Context<CreatePathogen>,
        code: String,
        name: String,
        bounty: u64,
        reward_per_profile: u64,
    ) -> Result<()> {
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
        if reward_per_profile > bounty {
            return Err(CreatePathogenErrorCode::RewardGreaterThanBounty.into());
        }
        if bounty > **creator.to_account_info().lamports.borrow() {
            return Err(CreatePathogenErrorCode::TooPoor.into());
        }

        // move bounty into account
        if bounty > 0 {
            invoke(
                &transfer(
                    creator.to_account_info().key,
                    pathogen.to_account_info().key,
                    bounty,
                ),
                &[
                    creator.to_account_info(),
                    pathogen.to_account_info(),
                    ctx.accounts.system_program.to_account_info(),
                ],
            )?
        }

        pathogen.creator = *creator.key;
        pathogen.created_at = clock.unix_timestamp;
        pathogen.code = code;
        pathogen.name = name;
        pathogen.total_profiles = 0;
        pathogen.reward_per_profile = reward_per_profile;
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

        // make sure pathogen account can cover profile reward
        let pathogen_sol = **pathogen.to_account_info().lamports.borrow();
        let remaining_sol = pathogen_sol
            .checked_sub(pathogen.reward_per_profile)
            .ok_or(CreateProfileErrorCode::TooPoor)?;

        if remaining_sol > 0 {
            **pathogen.to_account_info().try_borrow_mut_lamports()? -= pathogen.reward_per_profile;
            **creator.to_account_info().try_borrow_mut_lamports()? += pathogen.reward_per_profile;
        } else {
            return Err(CreateProfileErrorCode::TooPoor.into());
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
    #[account(mut, rent_exempt = enforce)]
    pub pathogen: Account<'info, Pathogen>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}
