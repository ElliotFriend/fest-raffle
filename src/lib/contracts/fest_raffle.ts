import { Client } from 'fest_raffle';
import {
    PUBLIC_RAFFLE_CONTRACT,
    PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    PUBLIC_STELLAR_RPC_URL,
} from '$env/static/public';

export default new Client({
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
    contractId: PUBLIC_RAFFLE_CONTRACT,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});
