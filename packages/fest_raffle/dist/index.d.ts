import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
} from '@stellar/stellar-sdk/minimal/contract';
import type { u32, u64, Option } from '@stellar/stellar-sdk/minimal/contract';
export declare const Errors: {
    /**
     * Indicates the address is already entered (tested)
     */
    101: {
        message: string;
    };
    /**
     * Indicates the address is not a winner (tested)
     */
    102: {
        message: string;
    };
    /**
     * Indicates the index number for the entry does not exist
     */
    103: {
        message: string;
    };
    /**
     * Indicates the address has already claimed their prize (tested)
     */
    104: {
        message: string;
    };
    /**
     * Indicates the claim storage entry for provided address does not exist
     */
    105: {
        message: string;
    };
    /**
     * Indicates a claim cannot be made, because winners have not yet ben drawn (tested)
     */
    106: {
        message: string;
    };
    /**
     * Indicates winners have already been chosen, so entries are closed (tested)
     */
    107: {
        message: string;
    };
    /**
     * Indicates the admin is up to something and trying to win their own prize (tested)
     */
    108: {
        message: string;
    };
    /**
     * Indicates the admin is up to something and trying to claim a prize (tested)
     */
    109: {
        message: string;
    };
    /**
     * Indicates the the prize does not exist for this winner
     */
    111: {
        message: string;
    };
    /**
     * Indicates a prize index was not found for the entrant
     */
    112: {
        message: string;
    };
    /**
     * Indicates the prize cannot be claimed, since we are outside the claim window
     */
    113: {
        message: string;
    };
    /**
     * Indicates there are not enough entrants, and everybody wins (tested)
     */
    201: {
        message: string;
    };
    /**
     * Indicates the winners have already been drawn, we cannot draw again (tested)
     */
    202: {
        message: string;
    };
    /**
     * Indicates the winners haven't been drawn, so we can't map the addresses
     */
    203: {
        message: string;
    };
    /**
     * Indicates that either claim before or until values are invalid
     */
    204: {
        message: string;
    };
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
    | {
          tag: 'Admin';
          values: void;
      }
    | {
          tag: 'TotalEntries';
          values: void;
      }
    | {
          tag: 'TotalWinners';
          values: void;
      }
    | {
          tag: 'WinnersChosen';
          values: void;
      }
    | {
          tag: 'TotalClaimed';
          values: void;
      }
    | {
          tag: 'Entrant';
          values: readonly [u32];
      }
    | {
          tag: 'Entry';
          values: readonly [string];
      }
    | {
          tag: 'Winner';
          values: readonly [u32];
      }
    | {
          tag: 'Claimed';
          values: readonly [string];
      }
    | {
          tag: 'Winners';
          values: void;
      }
    | {
          tag: 'ClaimWindow';
          values: void;
      };
export interface Client {
    /**
     * Construct and simulate a upgrade transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    upgrade: (
        {
            wasm_hash,
        }: {
            wasm_hash: Buffer;
        },
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
        {
            new_admin,
        }: {
            new_admin: string;
        },
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
        {
            claim_after,
            claim_until,
        }: {
            claim_after: u64;
            claim_until: u64;
        },
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
        }: {
            number_of_winners: Option<u32>;
            claim_after: Option<u64>;
            claim_until: Option<u64>;
        },
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
        {
            entrant,
        }: {
            entrant: string;
        },
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
        {
            entrant,
        }: {
            entrant: string;
        },
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
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        {
            admin,
        }: {
            admin: string;
        },
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
    ): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        upgrade: (json: string) => AssembledTransaction<null>;
        set_admin: (json: string) => AssembledTransaction<null>;
        set_claim_time: (json: string) => AssembledTransaction<null>;
        draw_winners: (json: string) => AssembledTransaction<null>;
        map_winners: (json: string) => AssembledTransaction<null>;
        enter_raffle: (json: string) => AssembledTransaction<number>;
        claim_prize: (json: string) => AssembledTransaction<number>;
    };
}
