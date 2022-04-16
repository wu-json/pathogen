use anchor_lang::prelude::*;

#[error_code]
pub enum CreatePathogenErrorCode {
    #[msg("The provided name should be 50 characters long maximum.")]
    NameTooLong,
    #[msg("The provided code should be 25 characters long maximum.")]
    CodeTooLong,
}
