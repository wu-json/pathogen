use crate::profile::Profile;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PathogenAccount {
    pub counter: u32,
    pub profiles: Vec<Profile>,
}
