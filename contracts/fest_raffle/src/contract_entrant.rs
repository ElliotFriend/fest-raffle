use soroban_sdk::{contractimpl, panic_with_error, Address, Env};

use crate::{
    errors::Errors,
    storage::{
        create_entry, extend_instance_ttl, get_admin, get_claim_times, get_entry, has_claimed, has_entry, has_winners_chosen, is_winner, set_claimed, winners_chosen_in_past
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

    fn claim_prize(env: Env, entrant: Address) -> u32 {
        // require authorization
        entrant.require_auth();

        // make sure we've already chosen the winners
        if !winners_chosen_in_past(&env) {
            panic_with_error!(&env, Errors::WinnersNotChosen);
        }

        // check that we're inside the claim window
        let claim_times = get_claim_times(&env);
        if claim_times.after > env.ledger().timestamp() || claim_times.until < env.ledger().timestamp() {
            panic_with_error!(&env, Errors::OutsideClaimWindow);
        }

        // make sure the admin isn't doing something sneaky lol
        if get_admin(&env) == entrant {
            panic_with_error!(&env, Errors::AdminCannotClaim)
        }

        // make sure they've actually won!
        if !is_winner(&env, &entrant) {
            panic_with_error!(&env, Errors::NotWinner);
        }

        // make sure we haven't already claimed
        if has_claimed(&env, &entrant) {
            panic_with_error!(&env, Errors::AlreadyClaimed);
        }

        let entry_data = get_entry(&env, &entrant);

        // set the user as having claimed now
        set_claimed(&env, &entrant);

        // finally, extend the contract TTL
        extend_instance_ttl(&env);

        // return prize_won;
        return entry_data.prize_won.unwrap();
        // return 100u32;
    }
}
