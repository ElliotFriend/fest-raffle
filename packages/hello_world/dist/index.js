import { Buffer } from 'buffer';
import {
    Client as ContractClient,
    Spec as ContractSpec,
} from '@stellar/stellar-sdk/minimal/contract';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CDKANNTLXEOXD5FYPTSZCLM5S3VZYSIRAQJKXYBTYBE6PUJVHTI7I3JW',
    },
};
export class Client extends ContractClient {
    options;
    static async deploy(
        /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
        options,
    ) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(
            new ContractSpec([
                'AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPqAAAAEA==',
            ]),
            options,
        );
        this.options = options;
    }
    fromJSON = {
        hello: this.txFromJSON,
    };
}
