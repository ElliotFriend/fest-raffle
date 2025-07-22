import { Buffer } from 'buffer';
import {
    AssembledTransaction,
    Client as ContractClient,
    ClientOptions as ContractClientOptions,
    MethodOptions,
} from '@stellar/stellar-sdk/minimal/contract';
import type { u32, u64, Option } from '@stellar/stellar-sdk/minimal/contract';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: 'Test SDF Network ; September 2015';
        readonly contractId: 'CCLOAGK2RBSLRRL54DDK43CEORIN3PAMUEHOVBZV3IUF6BE4T27IGJD5';
    };
};
export declare const Errors: {
    /**
     * Indicates the address is already entered (tested)
     */
    101: {
        message: string;
    };
    /**
     * Indicates the address has never entered (tested)
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
    | {
          tag: 'Admin';
          values: void;
      }
    | {
          tag: 'TotalEntries';
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
      };
export interface Client {
    /**
     * Construct and simulate a draw_winners transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    draw_winners: (
        {
            number_of_winners,
        }: {
            number_of_winners: Option<u32>;
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
    ) => Promise<AssembledTransaction<null>>;
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
        draw_winners: (json: string) => AssembledTransaction<null>;
        enter_raffle: (json: string) => AssembledTransaction<number>;
        claim_prize: (json: string) => AssembledTransaction<null>;
    };
}
