use super::*;

#[test]
fn test_happy_path() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    for i in 0..50u32 {
        let temp_timestamp = env.ledger().timestamp();
        let new_timestamp = temp_timestamp + 1000;
        env.ledger().set_timestamp(new_timestamp);
        // create a new address
        let entrant = Address::generate(&env);
        // enter the raffle
        let entry_index = client.enter_raffle(&entrant);

        // make sure we returned the correct entry index
        assert_eq!(entry_index, i);

        // make sure the contract's storage entries are correct
        env.as_contract(&contract_id, || {
            // total number of entries should be one more than the index
            assert_eq!(
                env.storage()
                    .instance()
                    .get::<_, u32>(&Storage::TotalEntries)
                    .unwrap(),
                i + 1
            );

            // the entrant storage entry for index should be the address
            assert_eq!(
                env.storage()
                    .persistent()
                    .get::<_, Address>(&Storage::Entrant(i)),
                Some(entrant.clone())
            );

            // the entry data object should make sense
            let entry_data: EntryData = env
                .storage()
                .persistent()
                .get(&Storage::Entry(entrant.clone()))
                .unwrap();
            // entry index matches
            assert_eq!(entry_data.index, i);
            // entry is not a winner by default
            assert!(!entry_data.is_winner);
            // entry address is the entrant
            assert_eq!(entry_data.address, entrant);
            // entry timestamp is the ledger timestamp
            assert_eq!(entry_data.timestamp, new_timestamp);
        })
    }

    env.as_contract(&contract_id, || {
        // make sure the admin address is right
        assert_eq!(
            env.storage()
                .instance()
                .get::<_, Address>(&Storage::Admin)
                .unwrap(),
            admin
        );
        // make sure the winners aren't chosen yet
        assert!(env
            .storage()
            .instance()
            .get::<_, u64>(&Storage::WinnersChosen)
            .is_none());
        // make sure there are the right amount of entries (should be 50)
        assert_eq!(
            env.storage()
                .instance()
                .get::<_, u32>(&Storage::TotalEntries)
                .unwrap(),
            50
        );
    });

    // just for fun, make sure the timestamp makes sense
    assert_eq!(env.ledger().timestamp(), 50_000);
}

#[test]
#[should_panic(expected = "Error(Contract, #101)")]
fn test_cannot_enter_again() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    // enter once
    let entrant = Address::generate(&env);
    client.enter_raffle(&entrant);
    // enter again. this is where we panic
    client.enter_raffle(&entrant);
}

#[test]
#[should_panic(expected = "Error(Contract, #107)")]
fn test_cannot_enter_late() {
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

    // draw winners
    client.draw_winners(&None);
    // enter raffle. this is where we panic
    let new_entrant = Address::generate(&env);
    client.enter_raffle(&new_entrant);
}

#[test]
#[should_panic(expected = "Error(Contract, #108)")]
fn test_admin_cannot_enter() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    // enter as admin. this is where we panic
    client.enter_raffle(&admin);
}
