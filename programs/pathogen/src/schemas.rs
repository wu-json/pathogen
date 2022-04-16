use anchor_lang::prelude::*;

// 1. Account structs
#[account]
pub struct Pathogen {
    pub creator: Pubkey,
    pub name: String,
    pub code: String,
    pub total_profiles: u64,
    pub created_at: i64,
}

#[account]
pub struct Profile {
    pub creator: Pubkey,
    pub age: u8,
    pub latest_test_result: String,
    pub latest_test_result_date: i64,
}

// 2. Sizing constants for determining space requirements
// Shared
const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const STRING_LENGTH_PREFIX: usize = 4; // Stores the size of the string
const TIMESTAMP_LENGTH: usize = 8;

// Pathogen account size properties
const MAX_NAME_LENGTH: usize = 50 * 4; // 50 chars max
const MAX_CODE_LENGTH: usize = 25 * 4; // 25 chars max
const TOTAL_PROFILES_LENGTH: usize = 8;

// Profile account size properties
const AGE_LENGTH: usize = 1;
const LATEST_TEST_RESULT_LENGTH: usize = 25 * 4; // 25 chars max

// 3. Total size implementations
impl Pathogen {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Creator
        + (STRING_LENGTH_PREFIX + MAX_NAME_LENGTH) // Name
        + (STRING_LENGTH_PREFIX + MAX_CODE_LENGTH) // Code
        + TOTAL_PROFILES_LENGTH // Total profiles
        + TIMESTAMP_LENGTH; // Created at
}

impl Profile {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH // Creator
        + AGE_LENGTH // Age
        + (STRING_LENGTH_PREFIX + LATEST_TEST_RESULT_LENGTH)  // Latest test result
        + TIMESTAMP_LENGTH; // Latest test result date
}
