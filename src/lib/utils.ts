import { Api } from '@stellar/stellar-sdk/minimal/rpc';
import { onMount } from 'svelte';

export function checkSimulationError(sim: Api.SimulateTransactionResponse) {
    if (Api.isSimulationError(sim)) {
        console.error(sim.error);
        if (sim.error.includes('Error(Contract, #101')) {
            throw 'You have already entered the raffle. No double-dips.';
        } else if (sim.error.includes('Error(Contract, #102)')) {
            throw 'No entry found. Looks like you never entered the raffle.';
        } else if (sim.error.includes('Error(Contract, #104)')) {
            throw 'You have already claimed your prize. No double-dips.';
        } else if (sim.error.includes('Error(Contract, #106)')) {
            throw 'Winners have not yet been drawn. No claiming yet.';
        } else if (sim.error.includes('Error(Contract, #107')) {
            throw 'Winners have already been drawn. Entries are closed.';
        } else if (sim.error.includes('Error(Contract, #108')) {
            throw 'Admin cannot enter the raffle. Very sneaky, Lindsay!';
        } else if (sim.error.includes('Error(Contract, #109)')) {
            throw 'Admin cannot claim a prize. Very sneaky, Lindsay!';
        } else if (sim.error.includes('Error(Contract, #110)')) {
            throw 'You are not a winner, and cannot claim. Sorry about that.';
        } else if (sim.error.includes('Error(Contract, #113)')) {
            throw 'You are outside the claim window. Please try again later.';
        } else if (sim.error.includes('Error(Contract, #201')) {
            throw 'Error #201: Not enough entrants. Please draw a lower number of winners.';
        } else if (sim.error.includes('Error(Contract, #202')) {
            throw 'Error #202: Winners have already been drawn. Cannot draw again.';
        } else if (sim.error.includes('Error(Contract, #203')) {
            throw 'Error #203: Winners have not been drawn. Winner mapping failed.';
        } else if (sim.error.includes('Error(Contract, #204')) {
            throw 'Error #204: Invalid claim window. Please select inputs and try again.';
        }
        throw 'Something went wrong. Please try again later.';
    }
}
