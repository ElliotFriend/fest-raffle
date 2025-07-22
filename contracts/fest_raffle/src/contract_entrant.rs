use soroban_sdk::{contractimpl, panic_with_error, Address, Env};

use crate::{
    errors::Errors,
    storage::{
        create_entry, extend_instance_ttl, get_admin, has_claimed, has_entry, has_winners_chosen,
        set_claimed, winners_chosen_in_past,
    },
    EntrantTrait, RaffleContract, RaffleContractArgs, RaffleContractClient,
};

#[contractimpl]
impl EntrantTrait for RaffleContract {
    fn enter_raffle(env: Env, entrant: Address) -> u32 {
        // make sure we're not late to the raffle
        if has_winners_chosen(&env) {
            panic_with_error!(&env, Errors::EntryTooLate);
        }

        // make sure the admin isn't doing something sneaky lol
        if get_admin(&env) == entrant {
            panic_with_error!(&env, Errors::AdminCannotEnter)
        }

        // make sure we haven't already entered
        if has_entry(&env, &entrant) {
            panic_with_error!(&env, Errors::AlreadyEntered);
        }

        // require authorization
        entrant.require_auth();

        // create the entry for the user
        let index = create_entry(&env, &entrant);

        // finally, extend the contract TTL
        extend_instance_ttl(&env);

        return index;
    }

    fn claim_prize(env: Env, entrant: Address) {
        // make sure we've already chosen the winners
        if !winners_chosen_in_past(&env) {
            panic_with_error!(&env, Errors::WinnersNotChosen);
        }

        // make sure the admin isn't doing something sneaky lol
        if get_admin(&env) == entrant {
            panic_with_error!(&env, Errors::AdminCannotClaim)
        }

        // make sure we've actually entered the raffle
        if !has_entry(&env, &entrant) {
            panic_with_error!(&env, Errors::NeverEntered);
        }

        // make sure we haven't already claimed
        if has_claimed(&env, &entrant) {
            panic_with_error!(&env, Errors::AlreadyClaimed);
        }

        // require authorization
        entrant.require_auth();

        // set the user as having claimed now
        set_claimed(&env, &entrant);

        // finally, extend the contract TTL
        extend_instance_ttl(&env);
    }
}
