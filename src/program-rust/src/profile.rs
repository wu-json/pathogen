use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub enum TestResult {
    Positive,
    Negative,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TestPoint {
    pub test_result: TestResult,
    pub test_date: String,
    pub test_location: String,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct Profile {
    // unidentifiable biographical information
    pub age: u8,
    pub exercising: bool,
    pub height: String,
    pub occupation: String,
    pub state_code: String,
    pub weight: String,

    // infection-specific information
    pub infection_history: Vec<TestPoint>,
    pub latest_test_result: TestResult,
}
