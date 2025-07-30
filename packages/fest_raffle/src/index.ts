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

export const Errors = {
    /**
     * Indicates the address is already entered (tested)
     */
    101: { message: 'AlreadyEntered' },
    /**
     * Indicates the address is not a winner (tested)
     */
    102: { message: 'NotWinner' },
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
     * Indicates the the prize does not exist for this winner
     */
    111: { message: 'NoPrizeExists' },
    /**
     * Indicates a prize index was not found for the entrant
     */
    112: { message: 'PrizeNotFount' },
    /**
     * Indicates the prize cannot be claimed, since we are outside the claim window
     */
    113: { message: 'OutsideClaimWindow' },
    /**
     * Indicates there are not enough entrants, and everybody wins (tested)
     */
    201: { message: 'NotEnoughEntrants' },
    /**
     * Indicates the winners have already been drawn, we cannot draw again (tested)
     */
    202: { message: 'WinnersAlreadyChosen' },
    /**
     * Indicates the winners haven't been drawn, so we can't map the addresses
     */
    203: { message: 'WinnersNotDrawnYet' },
    /**
     * Indicates that either claim before or until values are invalid
     */
    204: { message: 'InvalidClaimTimes' },
};

export interface EntryData {
    address: string;
    index: u32;
    is_winner: boolean;
    prize_won: Option<u32>;
    timestamp: u64;
}

export interface ClaimTime {
    after: u64;
    until: u64;
}

export type Storage =
    | { tag: 'Admin'; values: void }
    | { tag: 'TotalEntries'; values: void }
    | { tag: 'TotalWinners'; values: void }
    | { tag: 'WinnersChosen'; values: void }
    | { tag: 'TotalClaimed'; values: void }
    | { tag: 'Entrant'; values: readonly [u32] }
    | { tag: 'Entry'; values: readonly [string] }
    | { tag: 'Winner'; values: readonly [u32] }
    | { tag: 'Claimed'; values: readonly [string] }
    | { tag: 'Winners'; values: void }
    | { tag: 'ClaimWindow'; values: void };

export interface Client {
    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    upgrade: (
        { wasm_hash }: { wasm_hash: Buffer },
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
     * Construct and simulate a set_admin transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    set_admin: (
        { new_admin }: { new_admin: string },
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
     * Construct and simulate a set_claim_time transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    set_claim_time: (
        { claim_after, claim_until }: { claim_after: u64; claim_until: u64 },
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
     * Construct and simulate a draw_winners transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    draw_winners: (
        {
            number_of_winners,
            claim_after,
            claim_until,
        }: { number_of_winners: Option<u32>; claim_after: Option<u64>; claim_until: Option<u64> },
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
     * Construct and simulate a map_winners transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    map_winners: (options?: {
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
    }) => Promise<AssembledTransaction<null>>;

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
    ) => Promise<AssembledTransaction<u32>>;
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
                'AAAAAAAAAAAAAAAHdXBncmFkZQAAAAABAAAAAAAAAAl3YXNtX2hhc2gAAAAAAAPuAAAAIAAAAAA=',
                'AAAAAAAAAAAAAAAJc2V0X2FkbWluAAAAAAAAAQAAAAAAAAAJbmV3X2FkbWluAAAAAAAAEwAAAAA=',
                'AAAAAAAAAAAAAAAOc2V0X2NsYWltX3RpbWUAAAAAAAIAAAAAAAAAC2NsYWltX2FmdGVyAAAAAAYAAAAAAAAAC2NsYWltX3VudGlsAAAAAAYAAAAA',
                'AAAAAAAAAAAAAAAMZHJhd193aW5uZXJzAAAAAwAAAAAAAAARbnVtYmVyX29mX3dpbm5lcnMAAAAAAAPoAAAABAAAAAAAAAALY2xhaW1fYWZ0ZXIAAAAD6AAAAAYAAAAAAAAAC2NsYWltX3VudGlsAAAAA+gAAAAGAAAAAA==',
                'AAAAAAAAAAAAAAALbWFwX3dpbm5lcnMAAAAAAAAAAAA=',
                'AAAAAAAAAAAAAAAMZW50ZXJfcmFmZmxlAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAQAAAAQ=',
                'AAAAAAAAAAAAAAALY2xhaW1fcHJpemUAAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAQAAAAQ=',
                'AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAAEAAAADFJbmRpY2F0ZXMgdGhlIGFkZHJlc3MgaXMgYWxyZWFkeSBlbnRlcmVkICh0ZXN0ZWQpAAAAAAAADkFscmVhZHlFbnRlcmVkAAAAAABlAAAALkluZGljYXRlcyB0aGUgYWRkcmVzcyBpcyBub3QgYSB3aW5uZXIgKHRlc3RlZCkAAAAAAAlOb3RXaW5uZXIAAAAAAABmAAAAN0luZGljYXRlcyB0aGUgaW5kZXggbnVtYmVyIGZvciB0aGUgZW50cnkgZG9lcyBub3QgZXhpc3QAAAAAD05vRW50cmFudEV4aXN0cwAAAABnAAAAPkluZGljYXRlcyB0aGUgYWRkcmVzcyBoYXMgYWxyZWFkeSBjbGFpbWVkIHRoZWlyIHByaXplICh0ZXN0ZWQpAAAAAAAOQWxyZWFkeUNsYWltZWQAAAAAAGgAAABFSW5kaWNhdGVzIHRoZSBjbGFpbSBzdG9yYWdlIGVudHJ5IGZvciBwcm92aWRlZCBhZGRyZXNzIGRvZXMgbm90IGV4aXN0AAAAAAAADU5vQ2xhaW1FeGlzdHMAAAAAAABpAAAAUUluZGljYXRlcyBhIGNsYWltIGNhbm5vdCBiZSBtYWRlLCBiZWNhdXNlIHdpbm5lcnMgaGF2ZSBub3QgeWV0IGJlbiBkcmF3biAodGVzdGVkKQAAAAAAABBXaW5uZXJzTm90Q2hvc2VuAAAAagAAAEpJbmRpY2F0ZXMgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBjaG9zZW4sIHNvIGVudHJpZXMgYXJlIGNsb3NlZCAodGVzdGVkKQAAAAAADEVudHJ5VG9vTGF0ZQAAAGsAAABRSW5kaWNhdGVzIHRoZSBhZG1pbiBpcyB1cCB0byBzb21ldGhpbmcgYW5kIHRyeWluZyB0byB3aW4gdGhlaXIgb3duIHByaXplICh0ZXN0ZWQpAAAAAAAAEEFkbWluQ2Fubm90RW50ZXIAAABsAAAAS0luZGljYXRlcyB0aGUgYWRtaW4gaXMgdXAgdG8gc29tZXRoaW5nIGFuZCB0cnlpbmcgdG8gY2xhaW0gYSBwcml6ZSAodGVzdGVkKQAAAAAQQWRtaW5DYW5ub3RDbGFpbQAAAG0AAAA2SW5kaWNhdGVzIHRoZSB0aGUgcHJpemUgZG9lcyBub3QgZXhpc3QgZm9yIHRoaXMgd2lubmVyAAAAAAANTm9Qcml6ZUV4aXN0cwAAAAAAAG8AAAA1SW5kaWNhdGVzIGEgcHJpemUgaW5kZXggd2FzIG5vdCBmb3VuZCBmb3IgdGhlIGVudHJhbnQAAAAAAAANUHJpemVOb3RGb3VudAAAAAAAAHAAAABMSW5kaWNhdGVzIHRoZSBwcml6ZSBjYW5ub3QgYmUgY2xhaW1lZCwgc2luY2Ugd2UgYXJlIG91dHNpZGUgdGhlIGNsYWltIHdpbmRvdwAAABJPdXRzaWRlQ2xhaW1XaW5kb3cAAAAAAHEAAABESW5kaWNhdGVzIHRoZXJlIGFyZSBub3QgZW5vdWdoIGVudHJhbnRzLCBhbmQgZXZlcnlib2R5IHdpbnMgKHRlc3RlZCkAAAARTm90RW5vdWdoRW50cmFudHMAAAAAAADJAAAATEluZGljYXRlcyB0aGUgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBkcmF3biwgd2UgY2Fubm90IGRyYXcgYWdhaW4gKHRlc3RlZCkAAAAUV2lubmVyc0FscmVhZHlDaG9zZW4AAADKAAAAR0luZGljYXRlcyB0aGUgd2lubmVycyBoYXZlbid0IGJlZW4gZHJhd24sIHNvIHdlIGNhbid0IG1hcCB0aGUgYWRkcmVzc2VzAAAAABJXaW5uZXJzTm90RHJhd25ZZXQAAAAAAMsAAAA+SW5kaWNhdGVzIHRoYXQgZWl0aGVyIGNsYWltIGJlZm9yZSBvciB1bnRpbCB2YWx1ZXMgYXJlIGludmFsaWQAAAAAABFJbnZhbGlkQ2xhaW1UaW1lcwAAAAAAAMw=',
                'AAAAAQAAAAAAAAAAAAAACUVudHJ5RGF0YQAAAAAAAAUAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAAAAAAlpc193aW5uZXIAAAAAAAABAAAAAAAAAAlwcml6ZV93b24AAAAAAAPoAAAABAAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==',
                'AAAAAQAAAAAAAAAAAAAACUNsYWltVGltZQAAAAAAAAIAAAAAAAAABWFmdGVyAAAAAAAABgAAAAAAAAAFdW50aWwAAAAAAAAG',
                'AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAACwAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMVG90YWxFbnRyaWVzAAAAAAAAAAAAAAAMVG90YWxXaW5uZXJzAAAAAAAAAAAAAAANV2lubmVyc0Nob3NlbgAAAAAAAAAAAAAAAAAADFRvdGFsQ2xhaW1lZAAAAAEAAAAAAAAAB0VudHJhbnQAAAAAAQAAAAQAAAABAAAAAAAAAAVFbnRyeQAAAAAAAAEAAAATAAAAAQAAAAAAAAAGV2lubmVyAAAAAAABAAAABAAAAAEAAAAAAAAAB0NsYWltZWQAAAAAAQAAABMAAAAAAAAAAAAAAAdXaW5uZXJzAAAAAAAAAAAAAAAAC0NsYWltV2luZG93AA==',
            ]),
            options,
        );
    }
    public readonly fromJSON = {
        upgrade: this.txFromJSON<null>,
        set_admin: this.txFromJSON<null>,
        set_claim_time: this.txFromJSON<null>,
        draw_winners: this.txFromJSON<null>,
        map_winners: this.txFromJSON<null>,
        enter_raffle: this.txFromJSON<u32>,
        claim_prize: this.txFromJSON<u32>,
    };
}
