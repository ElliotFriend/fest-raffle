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
        contractId: 'CCZY2TSHKIIYC4UYHZ5DNKHL7BTD5TS7L7TSGPNNAF7VPRAPQ7YZTIWQ',
    },
};
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
     * Indicates there are not enough entrants, and everybody wins (tested)
     */
    201: { message: 'NotEnoughEntrants' },
    /**
     * Indicates the winners have already been drawn, we cannot draw again (tested)
     */
    202: { message: 'WinnersAlreadyChosen' },
};
export class Client extends ContractClient {
    options;
    static async deploy(
        /** Constructor/Initialization Args for the contract's `__constructor` method */
        { admin },
        /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
        options,
    ) {
        return ContractClient.deploy({ admin }, options);
    }
    constructor(options) {
        super(
            new ContractSpec([
                'AAAAAAAAAAAAAAANX19jb25zdHJ1Y3RvcgAAAAAAAAEAAAAAAAAABWFkbWluAAAAAAAAEwAAAAA=',
                'AAAAAAAAAAAAAAAMZHJhd193aW5uZXJzAAAAAQAAAAAAAAARbnVtYmVyX29mX3dpbm5lcnMAAAAAAAPoAAAABAAAAAA=',
                'AAAAAAAAAAAAAAAMZW50ZXJfcmFmZmxlAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAQAAAAQ=',
                'AAAAAAAAAAAAAAALY2xhaW1fcHJpemUAAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAQAAAAQ=',
                'AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAADQAAADFJbmRpY2F0ZXMgdGhlIGFkZHJlc3MgaXMgYWxyZWFkeSBlbnRlcmVkICh0ZXN0ZWQpAAAAAAAADkFscmVhZHlFbnRlcmVkAAAAAABlAAAALkluZGljYXRlcyB0aGUgYWRkcmVzcyBpcyBub3QgYSB3aW5uZXIgKHRlc3RlZCkAAAAAAAlOb3RXaW5uZXIAAAAAAABmAAAAN0luZGljYXRlcyB0aGUgaW5kZXggbnVtYmVyIGZvciB0aGUgZW50cnkgZG9lcyBub3QgZXhpc3QAAAAAD05vRW50cmFudEV4aXN0cwAAAABnAAAAPkluZGljYXRlcyB0aGUgYWRkcmVzcyBoYXMgYWxyZWFkeSBjbGFpbWVkIHRoZWlyIHByaXplICh0ZXN0ZWQpAAAAAAAOQWxyZWFkeUNsYWltZWQAAAAAAGgAAABFSW5kaWNhdGVzIHRoZSBjbGFpbSBzdG9yYWdlIGVudHJ5IGZvciBwcm92aWRlZCBhZGRyZXNzIGRvZXMgbm90IGV4aXN0AAAAAAAADU5vQ2xhaW1FeGlzdHMAAAAAAABpAAAAUUluZGljYXRlcyBhIGNsYWltIGNhbm5vdCBiZSBtYWRlLCBiZWNhdXNlIHdpbm5lcnMgaGF2ZSBub3QgeWV0IGJlbiBkcmF3biAodGVzdGVkKQAAAAAAABBXaW5uZXJzTm90Q2hvc2VuAAAAagAAAEpJbmRpY2F0ZXMgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBjaG9zZW4sIHNvIGVudHJpZXMgYXJlIGNsb3NlZCAodGVzdGVkKQAAAAAADEVudHJ5VG9vTGF0ZQAAAGsAAABRSW5kaWNhdGVzIHRoZSBhZG1pbiBpcyB1cCB0byBzb21ldGhpbmcgYW5kIHRyeWluZyB0byB3aW4gdGhlaXIgb3duIHByaXplICh0ZXN0ZWQpAAAAAAAAEEFkbWluQ2Fubm90RW50ZXIAAABsAAAAS0luZGljYXRlcyB0aGUgYWRtaW4gaXMgdXAgdG8gc29tZXRoaW5nIGFuZCB0cnlpbmcgdG8gY2xhaW0gYSBwcml6ZSAodGVzdGVkKQAAAAAQQWRtaW5DYW5ub3RDbGFpbQAAAG0AAAA2SW5kaWNhdGVzIHRoZSB0aGUgcHJpemUgZG9lcyBub3QgZXhpc3QgZm9yIHRoaXMgd2lubmVyAAAAAAANTm9Qcml6ZUV4aXN0cwAAAAAAAG8AAAA1SW5kaWNhdGVzIGEgcHJpemUgaW5kZXggd2FzIG5vdCBmb3VuZCBmb3IgdGhlIGVudHJhbnQAAAAAAAANUHJpemVOb3RGb3VudAAAAAAAAHAAAABESW5kaWNhdGVzIHRoZXJlIGFyZSBub3QgZW5vdWdoIGVudHJhbnRzLCBhbmQgZXZlcnlib2R5IHdpbnMgKHRlc3RlZCkAAAARTm90RW5vdWdoRW50cmFudHMAAAAAAADJAAAATEluZGljYXRlcyB0aGUgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBkcmF3biwgd2UgY2Fubm90IGRyYXcgYWdhaW4gKHRlc3RlZCkAAAAUV2lubmVyc0FscmVhZHlDaG9zZW4AAADK',
                'AAAAAQAAAAAAAAAAAAAACUVudHJ5RGF0YQAAAAAAAAUAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAAAAAAlpc193aW5uZXIAAAAAAAABAAAAAAAAAAlwcml6ZV93b24AAAAAAAPoAAAABAAAAAAAAAAJdGltZXN0YW1wAAAAAAAABg==',
                'AAAAAQAAAAAAAAAAAAAACUNsYWltVGltZQAAAAAAAAIAAAAAAAAAA2VuZAAAAAAGAAAAAAAAAAVzdGFydAAAAAAAAAY=',
                'AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAACQAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMVG90YWxFbnRyaWVzAAAAAAAAAAAAAAAMVG90YWxXaW5uZXJzAAAAAAAAAAAAAAANV2lubmVyc0Nob3NlbgAAAAAAAAAAAAAAAAAADFRvdGFsQ2xhaW1lZAAAAAEAAAAAAAAAB0VudHJhbnQAAAAAAQAAAAQAAAABAAAAAAAAAAVFbnRyeQAAAAAAAAEAAAATAAAAAQAAAAAAAAAGV2lubmVyAAAAAAABAAAABAAAAAEAAAAAAAAAB0NsYWltZWQAAAAAAQAAABM=',
            ]),
            options,
        );
        this.options = options;
    }
    fromJSON = {
        draw_winners: this.txFromJSON,
        enter_raffle: this.txFromJSON,
        claim_prize: this.txFromJSON,
    };
}
