export const prerender = true;
export const ssr = false;

import type { LayoutLoad } from './$types';
import type { EntryData } from 'fest_raffle';
import { Contract, scValToNative, xdr, nativeToScVal, Address } from '@stellar/stellar-sdk/minimal';
import { PUBLIC_RAFFLE_CONTRACT } from '$env/static/public';
import { rpc } from '$lib/passkeyClient';
import { user } from '$lib/state/UserState.svelte';

export const load: LayoutLoad = async ({ depends }) => {
    let returnObj: Record<string, any> = {
        instance: {},
    };

    // start with the contract instance
    let ledgerKeys: xdr.LedgerKey[] = [new Contract(PUBLIC_RAFFLE_CONTRACT).getFootprint()];

    // add the user's Entry(Address) ledger key, if they're logged in
    if (user.contractAddress) {
        ledgerKeys.push(
            xdr.LedgerKey.contractData(
                new xdr.LedgerKeyContractData({
                    contract: new Address(PUBLIC_RAFFLE_CONTRACT).toScAddress(),
                    key: nativeToScVal([
                        nativeToScVal('Entry', { type: 'symbol' }),
                        nativeToScVal(user.contractAddress, { type: 'address' }),
                    ]),
                    durability: xdr.ContractDataDurability.persistent(),
                }),
            ),
        );
    }

    // request the ledger entries
    const { entries } = await rpc.getLedgerEntries(...ledgerKeys);
    entries.forEach((entry) => {
        switch (entry.val.contractData().key().switch().value) {
            case xdr.ScValType.scvLedgerKeyContractInstance().value:
                // raffle contract instance
                entry.val
                    .contractData()
                    .val()
                    .instance()
                    .storage()!
                    .forEach((e) => {
                        const key = scValToNative(e.key());
                        const val = scValToNative(e.val());
                        returnObj.instance[key] = val;
                    });
                break;
            default:
                // the user's entry instance
                const entryObj: EntryData = scValToNative(entry.val.contractData().val());
                returnObj.entry = entryObj;
        }
    });

    depends('app:layout');

    return {
        ...returnObj,
    };
};
