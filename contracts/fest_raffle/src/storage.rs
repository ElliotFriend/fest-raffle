use soroban_sdk::{panic_with_error, Address, Env, Vec};

use crate::{
    errors::Errors,
    types::{ClaimTime, EntryData, Storage},
    WEEK_OF_LEDGERS,
};

pub fn extend_instance_ttl(env: &Env) {
    let max_ttl = env.storage().max_ttl();

    env.storage()
        .instance()
        .extend_ttl(max_ttl - WEEK_OF_LEDGERS, max_ttl);
}

pub fn set_admin(env: &Env, owner: &Address) {
    env.storage().instance().set(&Storage::Admin, owner);
}

pub fn get_admin(env: &Env) -> Address {
    env.storage().instance().get(&Storage::Admin).unwrap()
}

pub fn require_admin_auth(env: &Env) {
    get_admin(env).require_auth();
}

pub fn get_total_entries(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&Storage::TotalEntries)
        .unwrap_or_default()
}

pub fn increment_total_entries(env: &Env, current: &u32) {
    env.storage()
        .instance()
        .set(&Storage::TotalEntries, &(current + 1));
}

pub fn create_entry(env: &Env, entrant: &Address) -> u32 {
    let entry_index = get_total_entries(env);
    let entry_data = EntryData {
        address: entrant.clone(),
        index: entry_index.clone(),
        is_winner: false,
        timestamp: env.ledger().timestamp(),
        prize_won: None,
    };

    env.storage()
        .persistent()
        .set(&Storage::Entry(entrant.clone()), &entry_data);
    env.storage()
        .persistent()
        .set(&Storage::Entrant(entry_index.clone()), entrant);

    increment_total_entries(env, &entry_index);

    return entry_index;
}

pub fn get_entrant_from_index(env: &Env, entry_index: &u32) -> Address {
    env.storage()
        .persistent()
        .get(&Storage::Entrant(entry_index.clone()))
        .unwrap_or_else(|| panic_with_error!(env, Errors::NoEntrantExists))
}

pub fn get_entry(env: &Env, entrant: &Address) -> EntryData {
    env.storage()
        .persistent()
        .get(&Storage::Entry(entrant.clone()))
        .unwrap_or_else(|| panic_with_error!(env, Errors::NotWinner))
}

pub fn has_entry(env: &Env, entrant: &Address) -> bool {
    env.storage()
        .persistent()
        .has(&Storage::Entry(entrant.clone()))
}

pub fn is_winner(env: &Env, entrant: &Address) -> bool {
    let entry: EntryData = env.storage()
        .persistent()
        .get(&Storage::Entry(entrant.clone()))
        .unwrap_or_else(|| panic_with_error!(env, Errors::NotWinner));
    return entry.is_winner
}

pub fn set_winner(env: &Env, winner: &Address, win_index: &u32) {
    env.storage()
        .persistent()
        .set(&Storage::Winner(win_index.clone()), winner);

    let mut entry_data = get_entry(&env, winner);
    entry_data.is_winner = true;
    entry_data.prize_won = Some(win_index.clone());
    env.storage()
        .persistent()
        .set(&Storage::Entry(winner.clone()), &entry_data);
}

pub fn set_winners_chosen(env: &Env) {
    env.storage()
        .instance()
        .set(&Storage::WinnersChosen, &env.ledger().timestamp());
}

pub fn has_winners_chosen(env: &Env) -> bool {
    env.storage().instance().has(&Storage::WinnersChosen)
}

pub fn winners_chosen_in_past(env: &Env) -> bool {
    let now_is_after = match env
        .storage()
        .instance()
        .get::<_, u64>(&Storage::WinnersChosen)
    {
        Some(t) => t < env.ledger().timestamp(),
        _ => false,
    };

    return now_is_after;
}

pub fn set_winners(env: &Env, winning_indexes: Vec<u32>) {
    env.storage().persistent().set(&Storage::Winners, &winning_indexes);
}

pub fn get_winners(env: &Env) -> Vec<u32> {
    env.storage().persistent().get(&Storage::Winners).unwrap()
}

pub fn set_total_winners(env: &Env, num_winners: &u32) {
    env.storage().instance().set(&Storage::TotalWinners, num_winners);
}

pub fn get_total_winners(env: &Env) -> u32 {
    env.storage().instance().get(&Storage::TotalWinners).unwrap()
}

pub fn set_claimed(env: &Env, winner: &Address) {
    env.storage()
        .persistent()
        .set(&Storage::Claimed(winner.clone()), &env.ledger().timestamp());
    increment_total_claimed(env);
}

pub fn has_claimed(env: &Env, winner: &Address) -> bool {
    env.storage()
        .persistent()
        .has(&Storage::Claimed(winner.clone()))
}

pub fn get_total_claimed(env: &Env) -> u32 {
    env.storage()
        .instance()
        .get(&Storage::TotalClaimed)
        .unwrap_or(0u32)
}

pub fn increment_total_claimed(env: &Env) {
    let current = get_total_claimed(env);
    env.storage()
        .instance()
        .set(&Storage::TotalClaimed, &(current + 1));
}

pub fn set_claim_times(env: &Env, claim_times: &ClaimTime) {
    env.storage().instance().set(&Storage::ClaimWindow, claim_times);
}

pub fn get_claim_times(env: &Env) -> ClaimTime {
    env.storage().instance().get(&Storage::ClaimWindow).unwrap()
}
