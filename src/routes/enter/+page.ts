import type { PageLoad } from './$types';
// import { contractAddress } from '$lib/state/contractAddress';
import { xdr, Address } from '@stellar/stellar-sdk/minimal';
import { networks } from 'fest_raffle';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { user } from '$lib/state/UserState.svelte';
import { rpc } from '$lib/passkeyClient';

export const load: PageLoad = async () => {
    console.log('/enter/+page.ts running')

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

    // return whether or not the ledger entry exists
    return {
        hasEntered: !!entries.length,
    };
}
