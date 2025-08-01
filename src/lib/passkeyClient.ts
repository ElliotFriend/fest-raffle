import { Server } from '@stellar/stellar-sdk/minimal/rpc';
import { PasskeyKit } from 'passkey-kit';

import {
    PUBLIC_STELLAR_RPC_URL,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_WALLET_WASM_HASH,
} from '$env/static/public';
import type { Tx } from '@stellar/stellar-sdk/minimal/contract';

/**
 * A configured Stellar RPC server instance used to interact with the network
 */
export const rpc = new Server(PUBLIC_STELLAR_RPC_URL);

/**
 * The account object is an instance of the PasskeyKit class. This is the
 * primary means of communicating with our user's smart wallet from the client.
 */
export const account = new PasskeyKit({
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    walletWasmHash: PUBLIC_WALLET_WASM_HASH,
});

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/send` endpoint we have created.
 *
 * @param xdr - The base64-encoded, signed transaction. This transaction
 * **must** contain a Soroban operation
 * @returns JSON object containing the RPC's response
 */
export async function send(tx: Tx) {
    return fetch('/api/send', {
        method: 'POST',
        body: JSON.stringify({
            xdr: tx.toXDR(),
        }),
    }).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/contract/[signer]` endpoint we have created.
 *
 * @param signer - The passkey ID we want to find an associated smart wallet for
 * @returns The contract address to which the specified signer has been added
 */
export async function getContractId(signer: string) {
    return fetch(`/api/contract/${signer}`).then(async (res) => {
        if (res.ok) return res.text();
        else throw await res.text();
    });
}

/**
 * A wrapper function so it's easier for our client-side code to access the
 * `/api/fund/[address]` endpoint we have created.
 *
 * @param address - The contract address to fund on the Testnet
 */
export async function fundContract(address: string) {
    return fetch(`/api/fund/${address}`).then(async (res) => {
        if (res.ok) return res.json();
        else throw await res.text();
    });
}
