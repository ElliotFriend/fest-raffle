import type { PageLoad } from './$types';
import { xdr, nativeToScVal, scValToNative, Address } from '@stellar/stellar-sdk/minimal';
import { user } from '$lib/state/UserState.svelte'
import { networks } from 'fest_raffle';
import { rpc } from '$lib/passkeyClient';
import type { EntryData } from 'fest_raffle'

export const load: PageLoad = async () => {
    console.log('/check/+page.ts running')

    // create the ledger key
    const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(networks.testnet.contractId).toScAddress(),
            key: nativeToScVal([
                nativeToScVal('Entry', { type: 'symbol' }),
                nativeToScVal(user.contractAddress, { type: 'address' }),
            ]),
            durability: xdr.ContractDataDurability.persistent(),
        })
    )

    // request the ledger entry
    const { entries } = await rpc.getLedgerEntries(ledgerKey)
    if (entries.length) {
        const entry: EntryData = scValToNative(entries[0].val.contractData().val())
        return {
            isWinner: entry.is_winner
        }
    }

    return {
        isWinner: false,
    };
}
