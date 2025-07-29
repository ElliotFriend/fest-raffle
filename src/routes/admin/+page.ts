import { Address, xdr, Contract, nativeToScVal, scValToNative } from '@stellar/stellar-sdk/minimal';
import type { PageLoad } from './$types';
import { PUBLIC_RAFFLE_CONTRACT } from '$env/static/public';
import { rpc } from '$lib/passkeyClient';

function getLabubuByAddress(obj: Record<number, Record<string, string | Date>>, address: string) {
    return Number(Object.keys(obj).find((key) => obj[Number(key)].address === address));
}

export const load: PageLoad = async ({ parent, depends }) => {
    let winners: Record<number, Record<string, string | Date>> = {};

    const { instance } = await parent();
    if (instance.TotalWinners) {
        let winnerKeys: xdr.LedgerKey[] = [];
        for (let i = 1; i <= instance.TotalWinners; i++) {
            const key = xdr.LedgerKey.contractData(
                new xdr.LedgerKeyContractData({
                    contract: new Address(PUBLIC_RAFFLE_CONTRACT).toScAddress(),
                    key: nativeToScVal([
                        nativeToScVal('Winner', { type: 'symbol' }),
                        nativeToScVal(i, { type: 'u32' }),
                    ]),
                    durability: xdr.ContractDataDurability.persistent(),
                }),
            );
            winnerKeys.push(key);
        }

        let { entries } = await rpc.getLedgerEntries(...winnerKeys);
        entries.forEach((e) => {
            const key = scValToNative(e.val.contractData().key())[1];
            const val = scValToNative(e.val.contractData().val());
            winners[key] = { address: val };
        });
    }

    if (Object.keys(winners).length) {
        let entryKeys: xdr.LedgerKey[] = [];
        Object.entries(winners).forEach(([labubu, { address }]) => {
            const claimKey = xdr.LedgerKey.contractData(
                new xdr.LedgerKeyContractData({
                    contract: new Address(PUBLIC_RAFFLE_CONTRACT).toScAddress(),
                    key: nativeToScVal([
                        nativeToScVal('Claimed', { type: 'symbol' }),
                        nativeToScVal(address, { type: 'address' }),
                    ]),
                    durability: xdr.ContractDataDurability.persistent(),
                }),
            );
            entryKeys.push(claimKey);
        });

        let { entries } = await rpc.getLedgerEntries(...entryKeys);
        entries.forEach((e) => {
            const address = scValToNative(e.val.contractData().key())[1];
            let labubu = getLabubuByAddress(winners, address);
            const val = Number(scValToNative(e.val.contractData().val())) * 1000;
            winners[labubu] = {
                ...winners[labubu],
                claimed: new Date(val).toLocaleTimeString(),
            };
        });
    }

    depends('app:admin');

    return {
        winners,
    };
};
