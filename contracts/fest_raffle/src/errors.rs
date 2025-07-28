use soroban_sdk::contracterror;

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Errors {
    /// Indicates the address is already entered (tested)
    AlreadyEntered = 101,
    /// Indicates the address is not a winner (tested)
    NotWinner = 102,
    /// Indicates the index number for the entry does not exist
    NoEntrantExists = 103,
    /// Indicates the address has already claimed their prize (tested)
    AlreadyClaimed = 104,
    /// Indicates the claim storage entry for provided address does not exist
    NoClaimExists = 105,
    /// Indicates a claim cannot be made, because winners have not yet ben drawn (tested)
    WinnersNotChosen = 106,
    /// Indicates winners have already been chosen, so entries are closed (tested)
    EntryTooLate = 107,
    /// Indicates the admin is up to something and trying to win their own prize (tested)
    AdminCannotEnter = 108,
    /// Indicates the admin is up to something and trying to claim a prize (tested)
    AdminCannotClaim = 109,
    /// Indicates the the prize does not exist for this winner
    NoPrizeExists = 111,
    /// Indicates a prize index was not found for the entrant
    PrizeNotFount = 112,
    /// Indicates there are not enough entrants, and everybody wins (tested)
    NotEnoughEntrants = 201,
    /// Indicates the winners have already been drawn, we cannot draw again (tested)
    WinnersAlreadyChosen = 202,
    /// Indicates the winners haven't been drawn, so we can't map the addresses
    WinnersNotDrawnYet = 203,
}
