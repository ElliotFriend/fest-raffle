use soroban_sdk::{contractimpl, panic_with_error, vec, Address, BytesN, Env, Vec};

use crate::{
    errors::Errors, storage::{
        extend_instance_ttl, get_entrant_from_index, get_total_entries, get_total_winners, get_winners, has_winners_chosen, require_admin_auth, set_admin, set_claim_times, set_total_winners, set_winner, set_winners, set_winners_chosen
    }, types::ClaimTime, AdminTrait, RaffleContract, RaffleContractArgs, RaffleContractClient
};

/// An administrative interface for the raffle contract
#[contractimpl]
impl AdminTrait for RaffleContract {
    fn __constructor(env: Env, admin: Address) {
        // set the admin address
        set_admin(&env, &admin);

        // extend the contract TTL
        extend_instance_ttl(&env);
    }

    fn upgrade(env: Env, wasm_hash: BytesN<32>) {
        // require authorization from the existing admin address.
        require_admin_auth(&env);

        env.deployer().update_current_contract_wasm(wasm_hash);
    }

    fn set_admin(env: Env, new_admin: Address) {
        // require authorization from the existing admin address.
        require_admin_auth(&env);

        // set the new admin address.
        set_admin(&env, &new_admin);
    }

    fn set_claim_time(env: Env, claim_after: u64, claim_until: u64) {
        // require authorization from the existing admin address.
        require_admin_auth(&env);

        // set the new admin address.
        set_claim_times(&env, &ClaimTime { after: claim_after, until: claim_until });
    }

    fn draw_winners(env: Env, number_of_winners: Option<u32>, claim_after: Option<u64>, claim_until: Option<u64>) {
        // require authorization from the admin address.
        require_admin_auth(&env);

        // make sure we haven't already chosen winners
        if has_winners_chosen(&env) {
            panic_with_error!(&env, Errors::WinnersAlreadyChosen);
        }

        // get the total entries available
        let num_total_entries = get_total_entries(&env);

        // get the number of winners we want
        let num_winners = match number_of_winners {
            Some(num) => num,
            _ => 25u32,
        };

        // make sure there are enough entries for the amount of winners
        if num_total_entries < num_winners {
            panic_with_error!(&env, Errors::NotEnoughEntrants);
        }

        let claim_times = ClaimTime {
            after: claim_after.unwrap_or(1754172000),
            until: claim_until.unwrap_or(1754175600),
        };

        // make sure claim times make sense:
        // 1) after is before until, and
        // 2) until is in the future
        if claim_times.after >= claim_times.until || claim_times.until <= env.ledger().timestamp() {
            panic_with_error!(&env, Errors::InvalidClaimTimes)
        }

        set_claim_times(&env, &claim_times);
        set_total_winners(&env, &num_winners);

        // create a vector to keep track of winning indexes
        let mut winning_indexes: Vec<u32> = vec![&env];

        // choose random entrant indexes until we have enough winners
        while winning_indexes.len() < num_winners {
            // set the winner index
            // let i = winning_indexes.len() + 1;
            // generate a random entrant index
            let rand_number: u64 = env.prng().gen_range(0..(num_total_entries as u64));
            if !winning_indexes.contains(rand_number as u32) {
                // add the entrant index to the vector, so nobody can double win
                winning_indexes.push_back(rand_number as u32);
            }
        }

        // shuffle and store the list of winning indexes
        env.prng().shuffle(&mut winning_indexes);
        set_winners(&env, winning_indexes);

        // set the time we chose the winners
        set_winners_chosen(&env);

        // finally, extend the contract TTL
        extend_instance_ttl(&env);
    }

    fn map_winners(env: Env) {
        // make sure we've already chosen winners
        if !has_winners_chosen(&env) {
            panic_with_error!(&env, Errors::WinnersNotDrawnYet);
        }

        let total_winners = get_total_winners(&env);
        let winning_indexes = get_winners(&env);

        for win_index in 0..total_winners {
            // set the entrant as a winner
            let winning_address = get_entrant_from_index(&env, &winning_indexes.get(win_index).unwrap());
            set_winner(&env, &winning_address, &(win_index + 1));
        };

        // finally, extend the contract TTL
        extend_instance_ttl(&env);
    }
}
