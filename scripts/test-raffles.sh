#!/usr/bin/env sh

stellar network use testnet
stellar contract build

# stellar keys generate fwbautoadmin --fund | true

CONTRACT=$(stellar contract deploy --quiet --source fwbautoadmin --wasm ./target/wasm32v1-none/release/fest_raffle.wasm -- --admin fwbautoadmin | tail -n 1)
echo "raffle $CONTRACT"

for i in $(seq 5); do
    ENTRANT="fwbautoentrant$i"
    # stellar keys generate $ENTRANT --fund | true
    stellar contract invoke --source $ENTRANT --id $CONTRACT -- enter_raffle --entrant $ENTRANT
done

stellar contract invoke --source fwbautoadmin --id $CONTRACT -- draw_winners --number_of_winners 3
stellar contract invoke --source fwbautoadmin --id $CONTRACT -- map_winners
