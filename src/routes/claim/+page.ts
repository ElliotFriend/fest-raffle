import type { PageLoad } from './$types';
import { user } from '$lib/state/UserState.svelte';
import { xdr, Address, nativeToScVal, scValToNative } from '@stellar/stellar-sdk/minimal';
import { PUBLIC_RAFFLE_CONTRACT } from '$env/static/public';
import { rpc } from '$lib/passkeyClient';

export const load: PageLoad = async ({ depends }) => {
    const ledgerKey = xdr.LedgerKey.contractData(
        new xdr.LedgerKeyContractData({
            contract: new Address(PUBLIC_RAFFLE_CONTRACT).toScAddress(),
            key: nativeToScVal([
                nativeToScVal('Claimed', { type: 'symbol' }),
                nativeToScVal(user.contractAddress, { type: 'address' }),
            ]),
            durability: xdr.ContractDataDurability.persistent(),
        }),
    );

    const { entries } = await rpc.getLedgerEntries(ledgerKey);

    depends('app:claim');

    if (entries.length) {
        return {
            claimedAt: scValToNative(entries[0].val.contractData().val()),
        };
    }
};
