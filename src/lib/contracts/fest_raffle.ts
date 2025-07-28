import { Client, networks } from 'fest_raffle';
import { PUBLIC_RAFFLE_CONTRACT, PUBLIC_STELLAR_RPC_URL } from '$env/static/public';

export default new Client({
    ...networks.testnet,
    contractId: PUBLIC_RAFFLE_CONTRACT,
    rpcUrl: PUBLIC_STELLAR_RPC_URL,
});
