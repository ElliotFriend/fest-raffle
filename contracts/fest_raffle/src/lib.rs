#![no_std]
use soroban_sdk::{contract, contractmeta, Address, BytesN, Env};

contractmeta!(key = "title", val = "FWB Fest Raffle");
contractmeta!(
    key = "desc",
    val = "A raffle contract to give away some labubus."q
);
contractmeta!(key = "binver", val = "0.0.1");

const WEEK_OF_LEDGERS: u32 = 60 * 60 * 24 / 5 * 7; // assumes 5 second ledger close times

mod contract_admin;
mod contract_entrant;
mod errors;
mod storage;
mod test;
mod types;

#[contract]
pub struct RaffleContract;

pub trait AdminTrait {
    fn __constructor(env: Env, admin: Address);

    fn upgrade(env: Env, new_wasm_hash: BytesN<32>);

    fn set_admin(env: Env, new_admin: Address);

    fn draw_winners(env: Env, number_of_winners: Option<u32>, claim_after: Option<u64>, claim_until: Option<u64>);

    fn map_winners(env: Env);

    fn set_claim_time(env: Env, claim_after: u64, claim_until: u64);
}

pub trait EntrantTrait {
    fn enter_raffle(env: Env, entrant: Address) -> u32;

    fn claim_prize(env: Env, entrant: Address) -> u32;
}
