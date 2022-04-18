use anchor_lang::prelude::*;

#[error_code]
pub enum CreatePathogenErrorCode {
    #[msg("The provided name should be 50 characters long maximum.")]
    NameTooLong,
    #[msg("The provided code should be 25 characters long maximum.")]
    CodeTooLong,
    #[msg("The provided name is empty.")]
    NameEmpty,
    #[msg("The provided code is empty.")]
    CodeEmpty,
    #[msg("The reward per profile must be less than the bounty.")]
    RewardGreaterThanBounty,
}

#[error_code]
pub enum CreateProfileErrorCode {
    #[msg("The provided test result should be 25 characters long maximum.")]
    TestResultTooLong,
    #[msg("The provided test result is empty.")]
    TestResultEmpty,
}
