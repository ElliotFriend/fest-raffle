import type { PageLoad } from './$types';
import { xdr, Address } from '@stellar/stellar-sdk/minimal';
import { nativeToScVal } from '@stellar/stellar-sdk';
import { user } from '$lib/state/UserState.svelte';
import { rpc } from '$lib/passkeyClient';
import { PUBLIC_RAFFLE_CONTRACT } from '$env/static/public';

export const load: PageLoad = async ({ depends }) => {
    console.log('/enter/+page.ts running');

    // create the ledger key
    const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(PUBLIC_RAFFLE_CONTRACT).toScAddress(),
            key: nativeToScVal([
                nativeToScVal('Entry', { type: 'symbol' }),
                nativeToScVal(user.contractAddress, { type: 'address' }),
            ]),
            durability: xdr.ContractDataDurability.persistent(),
        }),
    );

    // request the ledger entry
    const { entries } = await rpc.getLedgerEntries(ledgerKey);

    // return whether or not the ledger entry exists
    depends('app:enter')

    return {
        hasEntered: !!entries.length,
    };
};
