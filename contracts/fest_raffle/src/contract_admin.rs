use soroban_sdk::{contractimpl, panic_with_error, vec, Address, Env, Vec};

use crate::{
    errors::Errors,
    storage::{
        extend_instance_ttl, get_admin, get_entrant_from_index, get_total_entries,
        has_winners_chosen, set_admin, set_winner, set_winners_chosen,
    },
    AdminTrait, RaffleContract, RaffleContractArgs, RaffleContractClient,
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

    fn draw_winners(env: Env, number_of_winners: Option<u32>) {
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
        if num_winners >= num_total_entries {
            panic_with_error!(&env, Errors::NotEnoughEntrants);
        }

        // require authorization from the admin address.
        let admin = get_admin(&env);
        admin.require_auth();

        // create a vector to keep track of winning indexes
        let mut winning_indexes: Vec<u32> = vec![&env];

        // choose random entrant indexes until we have enough winners
        while winning_indexes.len() < num_winners {
            // set the winner index
            let i = winning_indexes.len() + 1;
            // generate a random entrant index
            let rand_number: u64 = env.prng().gen_range(0..=(num_total_entries as u64));
            if !winning_indexes.contains(rand_number as u32) {
                // add the entrant index to the vector, so nobody can double win
                winning_indexes.push_back(rand_number as u32);

                // set the entrant as a winner
                let winning_address = get_entrant_from_index(&env, &(rand_number as u32));
                set_winner(&env, &winning_address, &i);
            }
        }

        // set the time we chose the winners
        set_winners_chosen(&env);

        // finally, extend the contract TTL
        extend_instance_ttl(&env);
    }
}
