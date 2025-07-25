use soroban_sdk::{contracttype, Address};

#[contracttype]
pub struct EntryData {
    pub index: u32,
    pub address: Address,
    pub timestamp: u64,
    pub is_winner: bool,
    pub prize_won: Option<u32>,
}

#[contracttype]
pub struct ClaimTime {
    pub start: u64,
    pub end: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum Storage {
    Admin,          // : address
    TotalEntries,   // : u32
    TotalWinners, // : u32
    WinnersChosen,  // : u64 timestamp
    TotalClaimed,   // : u32
    Entrant(u32),   // : address
    Entry(Address), // : EntryData
    Winner(u32),    // : address
    Claimed(Address), // : u64 timestamp
                    // WinnerIndex(u32), // : address
                    // Winner(Address), // : index
                    // Entry(Address), // : u64 timestamp
                    // Winner(u32), // : WinnerData
}
