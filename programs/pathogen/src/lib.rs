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
pub struct Initialize {}
