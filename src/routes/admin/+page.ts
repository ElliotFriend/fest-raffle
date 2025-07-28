import { Address, xdr, Contract, nativeToScVal, scValToNative } from '@stellar/stellar-sdk/minimal';
import type { PageLoad } from './$types';
import { PUBLIC_RAFFLE_CONTRACT } from '$env/static/public';
import { rpc } from '$lib/passkeyClient';

function getLabubuByAddress(obj: Record<number, Record<string, string | Date>>, address: string) {
    return Number(Object.keys(obj).find((key) => obj[Number(key)].address === address));
}

export const load: PageLoad = async () => {
    let returnObj: {
        instance: Record<string, any>;
        winners: Record<number, Record<string, string | Date>>;
    } = {
        instance: {},
        winners: {},
    };

    const raffleContract = new Contract(PUBLIC_RAFFLE_CONTRACT);
    let { entries } = await rpc.getLedgerEntries(raffleContract.getFootprint());

    entries[0].val
        .contractData()
        .val()
        .instance()
        .storage()!
        .forEach((iEntry) => {
            const key = scValToNative(iEntry.key())[0].toString();
            const val = scValToNative(iEntry.val());
            returnObj.instance[key] = val;
        });

    // console.log(returnObj)

    if (returnObj.instance.TotalWinners) {
        let winnerKeys: xdr.LedgerKey[] = [];
        for (let i = 1; i <= returnObj.instance.TotalWinners; i++) {
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
            // console.log('key', key)
            const val = scValToNative(e.val.contractData().val());
            // console.log(`${key}: ${val}`)
            returnObj.winners[key] = { address: val };
        });
    }

    if (Object.keys(returnObj.winners).length) {
        let entryKeys: xdr.LedgerKey[] = [];
        Object.entries(returnObj.winners).forEach(([labubu, { address }]) => {
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
        console.log('entries', entries);
        entries.forEach((e) => {
            const address = scValToNative(e.val.contractData().key())[1];
            let labubu = getLabubuByAddress(returnObj.winners, address);
            const val = Number(scValToNative(e.val.contractData().val())) * 1000;
            returnObj.winners[labubu] = {
                ...returnObj.winners[labubu],
                claimed: new Date(val).toLocaleTimeString(),
            };
        });
    }

    return returnObj;
};
