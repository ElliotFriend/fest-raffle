import type { PageLoad } from './$types';
import { user } from '$lib/state/UserState.svelte';
import { xdr, Address, nativeToScVal, scValToNative } from '@stellar/stellar-sdk/minimal';
import { PUBLIC_RAFFLE_CONTRACT } from '$env/static/public';
import { rpc } from '$lib/passkeyClient';

export const load: PageLoad = async ({ depends }) => {
    const contractScAddress = new Address(PUBLIC_RAFFLE_CONTRACT).toScAddress();

    let returnObj: Record<string, any> = {};

    const ledgerKeys: xdr.LedgerKey[] = [
        xdr.LedgerKey.contractData(
            new xdr.LedgerKeyContractData({
                contract: contractScAddress,
                key: nativeToScVal([
                    nativeToScVal('Entry', { type: 'symbol' }),
                    nativeToScVal(user.contractAddress, { type: 'address' }),
                ]),
                durability: xdr.ContractDataDurability.persistent(),
            }),
        ),
        xdr.LedgerKey.contractData(
            new xdr.LedgerKeyContractData({
                contract: contractScAddress,
                key: nativeToScVal([
                    nativeToScVal('Claimed', { type: 'symbol' }),
                    nativeToScVal(user.contractAddress, { type: 'address' }),
                ]),
                durability: xdr.ContractDataDurability.persistent(),
            }),
        ),
    ];

    const { entries } = await rpc.getLedgerEntries(...ledgerKeys);
    entries.forEach((e) => {
        const key = scValToNative(e.val.contractData().key())[0];
        const val = scValToNative(e.val.contractData().val());
        returnObj[key === 'Entry' ? 'entry' : 'claimedAt'] = val;
    });

    depends('app:claim')

    return returnObj;
};
