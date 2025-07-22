use super::*;

#[test]
fn test_happy_path() {
    let env = Env::default();
    let admin = Address::generate(&env);
    let contract_id = env.register(RaffleContract, (&admin,));

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
    });
}
