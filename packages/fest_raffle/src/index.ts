import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
    Spec as ContractSpec,
} from '@stellar/stellar-sdk/minimal/contract';
import type { u32, u64, Option } from '@stellar/stellar-sdk/minimal/contract';

if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}

export const networks = {
    testnet: {
        networkPassphrase: 'Test SDF Network ; September 2015',
        contractId: 'CCLOAGK2RBSLRRL54DDK43CEORIN3PAMUEHOVBZV3IUF6BE4T27IGJD5',
    },
} as const;

export const Errors = {
    /**
     * Indicates the address is already entered (tested)
     */
    101: { message: 'AlreadyEntered' },
    /**
     * Indicates the address has never entered (tested)
     */
    102: { message: 'NeverEntered' },
    /**
     * Indicates the index number for the entry does not exist
     */
    103: { message: 'NoEntrantExists' },
    /**
     * Indicates the address has already claimed their prize (tested)
     */
    104: { message: 'AlreadyClaimed' },
    /**
     * Indicates the claim storage entry for provided address does not exist
     */
    105: { message: 'NoClaimExists' },
    /**
     * Indicates a claim cannot be made, because winners have not yet ben drawn (tested)
     */
    106: { message: 'WinnersNotChosen' },
    /**
     * Indicates winners have already been chosen, so entries are closed (tested)
     */
    107: { message: 'EntryTooLate' },
    /**
     * Indicates the admin is up to something and trying to win their own prize (tested)
     */
    108: { message: 'AdminCannotEnter' },
    /**
     * Indicates the admin is up to something and trying to claim a prize (tested)
     */
    109: { message: 'AdminCannotClaim' },
    /**
     * Indicates there are not enough entrants, and everybody wins (tested)
     */
    201: { message: 'NotEnoughEntrants' },
    /**
     * Indicates the winners have already been drawn, we cannot draw again (tested)
     */
    202: { message: 'WinnersAlreadyChosen' },
};

export interface EntryData {
    address: string;
    index: u32;
    is_winner: boolean;
    timestamp: u64;
}

export interface ClaimTime {
    end: u64;
    start: u64;
}

export type Storage =
    | { tag: 'Admin'; values: void }
    | { tag: 'TotalEntries'; values: void }
    | { tag: 'WinnersChosen'; values: void }
    | { tag: 'TotalClaimed'; values: void }
    | { tag: 'Entrant'; values: readonly [u32] }
    | { tag: 'Entry'; values: readonly [string] }
    | { tag: 'Winner'; values: readonly [u32] }
    | { tag: 'Claimed'; values: readonly [string] };

export interface Client {
    /**
     * Construct and simulate a draw_winners transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    draw_winners: (
        { number_of_winners }: { number_of_winners: Option<u32> },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;

    /**
     * Construct and simulate a enter_raffle transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    enter_raffle: (
        { entrant }: { entrant: string },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<u32>>;

    /**
     * Construct and simulate a claim_prize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    claim_prize: (
        { entrant }: { entrant: string },
        options?: {
            /**
             * The fee to pay for the transaction. Default: BASE_FEE
             */
            fee?: number;

            /**
             * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
             */
            timeoutInSeconds?: number;

            /**
             * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
             */
            simulate?: boolean;
        },
    ) => Promise<AssembledTransaction<null>>;
}
export class Client extends ContractClient {
    static async deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { admin }: { admin: string },
        /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
        options: MethodOptions &
            Omit<ContractClientOptions, 'contractId'> & {
                /** The hash of the Wasm blob, which must already be installed on-chain. */
                wasmHash: Buffer | string;
                /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
                salt?: Buffer | Uint8Array;
                /** The format used to decode `wasmHash`, if it's provided as a string. */
                format?: 'hex' | 'base64';
            },
    ): Promise<AssembledTransaction<T>> {
        return ContractClient.deploy({ admin }, options);
    }
    constructor(public readonly options: ContractClientOptions) {
        super(
            new ContractSpec([
                'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=',
                'AAAAAAAAAAAAAAAMZHJhd193aW5uZXJzAAAAAQAAAAAAAAARbnVtYmVyX29mX3dpbm5lcnMAAAAAAAPoAAAABAAAAAA=',
                'AAAAAAAAAAAAAAAMZW50ZXJfcmFmZmxlAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAQAAAAQ=',
                'AAAAAAAAAAAAAAALY2xhaW1fcHJpemUAAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAA==',
                'AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAACwAAADFJbmRpY2F0ZXMgdGhlIGFkZHJlc3MgaXMgYWxyZWFkeSBlbnRlcmVkICh0ZXN0ZWQpAAAAAAAADkFscmVhZHlFbnRlcmVkAAAAAABlAAAAMEluZGljYXRlcyB0aGUgYWRkcmVzcyBoYXMgbmV2ZXIgZW50ZXJlZCAodGVzdGVkKQAAAAxOZXZlckVudGVyZWQAAABmAAAAN0luZGljYXRlcyB0aGUgaW5kZXggbnVtYmVyIGZvciB0aGUgZW50cnkgZG9lcyBub3QgZXhpc3QAAAAAD05vRW50cmFudEV4aXN0cwAAAABnAAAAPkluZGljYXRlcyB0aGUgYWRkcmVzcyBoYXMgYWxyZWFkeSBjbGFpbWVkIHRoZWlyIHByaXplICh0ZXN0ZWQpAAAAAAAOQWxyZWFkeUNsYWltZWQAAAAAAGgAAABFSW5kaWNhdGVzIHRoZSBjbGFpbSBzdG9yYWdlIGVudHJ5IGZvciBwcm92aWRlZCBhZGRyZXNzIGRvZXMgbm90IGV4aXN0AAAAAAAADU5vQ2xhaW1FeGlzdHMAAAAAAABpAAAAUUluZGljYXRlcyBhIGNsYWltIGNhbm5vdCBiZSBtYWRlLCBiZWNhdXNlIHdpbm5lcnMgaGF2ZSBub3QgeWV0IGJlbiBkcmF3biAodGVzdGVkKQAAAAAAABBXaW5uZXJzTm90Q2hvc2VuAAAAagAAAEpJbmRpY2F0ZXMgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBjaG9zZW4sIHNvIGVudHJpZXMgYXJlIGNsb3NlZCAodGVzdGVkKQAAAAAADEVudHJ5VG9vTGF0ZQAAAGsAAABRSW5kaWNhdGVzIHRoZSBhZG1pbiBpcyB1cCB0byBzb21ldGhpbmcgYW5kIHRyeWluZyB0byB3aW4gdGhlaXIgb3duIHByaXplICh0ZXN0ZWQpAAAAAAAAEEFkbWluQ2Fubm90RW50ZXIAAABsAAAAS0luZGljYXRlcyB0aGUgYWRtaW4gaXMgdXAgdG8gc29tZXRoaW5nIGFuZCB0cnlpbmcgdG8gY2xhaW0gYSBwcml6ZSAodGVzdGVkKQAAAAAQQWRtaW5DYW5ub3RDbGFpbQAAAG0AAABESW5kaWNhdGVzIHRoZXJlIGFyZSBub3QgZW5vdWdoIGVudHJhbnRzLCBhbmQgZXZlcnlib2R5IHdpbnMgKHRlc3RlZCkAAAARTm90RW5vdWdoRW50cmFudHMAAAAAAADJAAAATEluZGljYXRlcyB0aGUgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBkcmF3biwgd2UgY2Fubm90IGRyYXcgYWdhaW4gKHRlc3RlZCkAAAAUV2lubmVyc0FscmVhZHlDaG9zZW4AAADK',
                'AAAAAQAAAAAAAAAAAAAACUVudHJ5RGF0YQAAAAAAAAQAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAAAAAAlpc193aW5uZXIAAAAAAAABAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG',
                'AAAAAQAAAAAAAAAAAAAACUNsYWltVGltZQAAAAAAAAIAAAAAAAAAA2VuZAAAAAAGAAAAAAAAAAVzdGFydAAAAAAAAAY=',
                'AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMVG90YWxFbnRyaWVzAAAAAAAAAAAAAAANV2lubmVyc0Nob3NlbgAAAAAAAAAAAAAAAAAADFRvdGFsQ2xhaW1lZAAAAAEAAAAAAAAAB0VudHJhbnQAAAAAAQAAAAQAAAABAAAAAAAAAAVFbnRyeQAAAAAAAAEAAAATAAAAAQAAAAAAAAAGV2lubmVyAAAAAAABAAAABAAAAAEAAAAAAAAAB0NsYWltZWQAAAAAAQAAABM=',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        draw_winners: this.txFromJSON<null>,
        enter_raffle: this.txFromJSON<u32>,
        claim_prize: this.txFromJSON<null>,
    };
}
