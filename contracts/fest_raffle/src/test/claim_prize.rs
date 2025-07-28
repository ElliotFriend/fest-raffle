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

    client.draw_winners(&None);
    client.map_winners();

    for i in 1..=25 {
        // figure out the address we're claiming for
        let winner: Address = env.as_contract(&contract_id, || {
            env.storage().persistent().get(&Storage::Winner(i)).unwrap()
        });
        // make the claim invocation
        let temp_timestamp = env.ledger().timestamp();
        let new_timestamp = temp_timestamp + 1000;
        env.ledger().set_timestamp(new_timestamp);
        client.claim_prize(&winner);
        // test the storage entries
        env.as_contract(&contract_id, || {
            assert!(env
                .storage()
                .persistent()
                .has(&Storage::Claimed(winner.clone())));
            assert!(env
                .storage()
                .persistent()
                .get::<_, u64>(&Storage::Claimed(winner.clone()))
                .is_some());
            assert_eq!(
                env.storage()
                    .persistent()
                    .get::<_, u64>(&Storage::Claimed(winner.clone()))
                    .unwrap(),
                env.ledger().timestamp()
            );
            assert_eq!(
                env.storage()
                    .instance()
                    .get::<_, u32>(&Storage::TotalClaimed)
                    .unwrap(),
                i
            );
        })
    }
}

#[test]
fn test_happy_path_with_one_winner() {
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

    client.draw_winners(&Some(1));
    client.map_winners();

    // give some distance in time from when the winners were chosen
    let temp_timestamp = env.ledger().timestamp();
    let new_timestamp = temp_timestamp + 1000;
    env.ledger().set_timestamp(new_timestamp);

    // claim the prize
    let winner: Address = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&Storage::Winner(1)).unwrap()
    });
    client.claim_prize(&winner);

    env.as_contract(&contract_id, || {
        assert_eq!(
            env.storage()
                .instance()
                .get::<_, u64>(&Storage::WinnersChosen)
                .unwrap(),
            new_timestamp - 1000
        );
        assert_eq!(
            env.storage()
                .instance()
                .get::<_, u32>(&Storage::TotalClaimed)
                .unwrap(),
            1
        );
        assert_eq!(
            env.storage()
                .instance()
                .get::<_, u32>(&Storage::TotalEntries)
                .unwrap(),
            10
        );
    })
}

#[test]
#[should_panic(expected = "Error(Contract, #102)")]
fn test_cannot_claim_if_never_entered() {
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

    client.draw_winners(&None);
    client.map_winners();

    let temp_timestamp = env.ledger().timestamp();
    let new_timestamp = temp_timestamp + 1000;
    env.ledger().set_timestamp(new_timestamp);

    // try to claim as a new address. this is where we panic
    let unentered_entrant = Address::generate(&env);
    client.claim_prize(&unentered_entrant);
}

#[test]
#[should_panic(expected = "Error(Contract, #104)")]
fn test_cannot_claim_again() {
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

    client.draw_winners(&Some(1));
    client.map_winners();

    // give some distance in time from when the winners were chosen
    let temp_timestamp = env.ledger().timestamp();
    let new_timestamp = temp_timestamp + 1000;
    env.ledger().set_timestamp(new_timestamp);

    // claim the first prize
    let winner: Address = env.as_contract(&contract_id, || {
        env.storage().persistent().get(&Storage::Winner(1)).unwrap()
    });
    client.claim_prize(&winner);
    // try to claim a a second time. this is where we panic
    client.claim_prize(&winner);
}

#[test]
#[should_panic(expected = "Error(Contract, #106)")]
fn test_cannot_claim_if_winners_not_chosen() {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));
    let client = RaffleContractClient::new(&env, &contract_id);

    // enter the raffle
    let entrant = Address::generate(&env);
    client.enter_raffle(&entrant);

    // try to claim early. this is where we panic
    client.claim_prize(&entrant);
}

#[test]
#[should_panic(expected = "Error(Contract, #109)")]
fn test_admin_cannot_claim() {
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

    client.draw_winners(&None);
    client.map_winners();

    let temp_timestamp = env.ledger().timestamp();
    let new_timestamp = temp_timestamp + 1000;
    env.ledger().set_timestamp(new_timestamp);

    // try to claim as admin. this is where we panic
    client.claim_prize(&admin);
}
