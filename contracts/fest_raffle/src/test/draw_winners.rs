use soroban_sdk::Vec;

use super::*;

#[test]
fn test_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    for _i in 0..50u32 {
        let temp_timestamp = env.ledger().timestamp();
        let new_timestamp = temp_timestamp + 1000;
        env.ledger().set_timestamp(new_timestamp);
        let entrant = Address::generate(&env);
        client.enter_raffle(&entrant);
    }

    // use the default, 25 winners
    client.draw_winners(&Some(25), &Some(env.ledger().timestamp()), &Some(env.ledger().timestamp() + 10000));
    client.map_winners();

    env.as_contract(&contract_id, || {
        // make sure the winners have been chosen at the right timestamp
        assert!(env
            .storage()
            .instance()
            .get::<_, u64>(&Storage::WinnersChosen)
            .is_some_and(|t| t == env.ledger().timestamp()));
        assert!(env
            .storage()
            .instance()
            .get::<_, u32>(&Storage::TotalWinners)
            .is_some_and(|w| w == 25));
        for i in 0..25 {
            assert!(env.storage().persistent().has(&Storage::Winner(i + 1)));
            assert!(env
                .storage()
                .persistent()
                .get::<_, Address>(&Storage::Winner(i + 1))
                .is_some());

            let winner_index: u32 =
                env.storage().persistent().get::<_, Vec<u32>>(&Storage::Winners).unwrap().get(i).unwrap();
            let winner_address: Address = env.storage().persistent().get(&Storage::Entrant(winner_index)).unwrap();
            let entry_data: EntryData = env
                .storage()
                .persistent()
                .get(&Storage::Entry(winner_address.clone()))
                .unwrap();
            assert!(entry_data.is_winner);
            assert_eq!(entry_data.address, winner_address);
            assert!(entry_data.timestamp > 0);
            assert!(entry_data.index < 50);
            assert_eq!(entry_data.prize_won, Some(i + 1));

            // make sure they haven't yet claimed
            assert!(env
                .storage()
                .persistent()
                .get::<_, u64>(&Storage::Claimed(winner_address))
                .is_none());
        }

        // make sure no claims have been counted yet
        assert!(env
            .storage()
            .instance()
            .get::<_, u32>(&Storage::TotalClaimed)
            .is_none());
        // make sure the right number of winners has been chosen
        assert!(env
            .storage()
            .instance()
            .get::<_, Address>(&Storage::Winner(0))
            .is_none());
        assert!(env
            .storage()
            .instance()
            .get::<_, Address>(&Storage::Winner(26))
            .is_none());
    });
}

#[test]
#[should_panic(expected = "Error(Contract, #201)")]
fn test_cannot_draw_with_insufficient_entrants() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    for _i in 0..10u32 {
        let temp_timestamp = env.ledger().timestamp();
        let new_timestamp = temp_timestamp + 1000;
        env.ledger().set_timestamp(new_timestamp);
        let entrant = Address::generate(&env);
        client.enter_raffle(&entrant);
    }

    // use the default, 25 winners
    client.draw_winners(&None, &Some(env.ledger().timestamp()), &Some(env.ledger().timestamp() + 1000));
}

#[test]
#[should_panic(expected = "Error(Contract, #202)")]
fn test_cannot_draw_again() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    for _i in 0..50u32 {
        let temp_timestamp = env.ledger().timestamp();
        let new_timestamp = temp_timestamp + 1000;
        env.ledger().set_timestamp(new_timestamp);
        let entrant = Address::generate(&env);
        client.enter_raffle(&entrant);
    }

    // draw winners once
    client.draw_winners(&None, &Some(env.ledger().timestamp()), &Some(env.ledger().timestamp() + 10000));
    // draw winners again. this is where we should panic
    client.draw_winners(&None, &Some(env.ledger().timestamp()), &Some(env.ledger().timestamp() + 10000));
}
