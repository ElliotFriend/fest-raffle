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
        contractId: 'CCLOAGK2RBSLRRL54DDK43CEORIN3PAMUEHOVBZV3IUF6BE4T27IGJD5',
    },
};
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
                'AAAAAAAAAAAAAAALY2xhaW1fcHJpemUAAAAAAQAAAAAAAAAHZW50cmFudAAAAAATAAAAAA==',
                'AAAABAAAAAAAAAAAAAAABkVycm9ycwAAAAAACwAAADFJbmRpY2F0ZXMgdGhlIGFkZHJlc3MgaXMgYWxyZWFkeSBlbnRlcmVkICh0ZXN0ZWQpAAAAAAAADkFscmVhZHlFbnRlcmVkAAAAAABlAAAAMEluZGljYXRlcyB0aGUgYWRkcmVzcyBoYXMgbmV2ZXIgZW50ZXJlZCAodGVzdGVkKQAAAAxOZXZlckVudGVyZWQAAABmAAAAN0luZGljYXRlcyB0aGUgaW5kZXggbnVtYmVyIGZvciB0aGUgZW50cnkgZG9lcyBub3QgZXhpc3QAAAAAD05vRW50cmFudEV4aXN0cwAAAABnAAAAPkluZGljYXRlcyB0aGUgYWRkcmVzcyBoYXMgYWxyZWFkeSBjbGFpbWVkIHRoZWlyIHByaXplICh0ZXN0ZWQpAAAAAAAOQWxyZWFkeUNsYWltZWQAAAAAAGgAAABFSW5kaWNhdGVzIHRoZSBjbGFpbSBzdG9yYWdlIGVudHJ5IGZvciBwcm92aWRlZCBhZGRyZXNzIGRvZXMgbm90IGV4aXN0AAAAAAAADU5vQ2xhaW1FeGlzdHMAAAAAAABpAAAAUUluZGljYXRlcyBhIGNsYWltIGNhbm5vdCBiZSBtYWRlLCBiZWNhdXNlIHdpbm5lcnMgaGF2ZSBub3QgeWV0IGJlbiBkcmF3biAodGVzdGVkKQAAAAAAABBXaW5uZXJzTm90Q2hvc2VuAAAAagAAAEpJbmRpY2F0ZXMgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBjaG9zZW4sIHNvIGVudHJpZXMgYXJlIGNsb3NlZCAodGVzdGVkKQAAAAAADEVudHJ5VG9vTGF0ZQAAAGsAAABRSW5kaWNhdGVzIHRoZSBhZG1pbiBpcyB1cCB0byBzb21ldGhpbmcgYW5kIHRyeWluZyB0byB3aW4gdGhlaXIgb3duIHByaXplICh0ZXN0ZWQpAAAAAAAAEEFkbWluQ2Fubm90RW50ZXIAAABsAAAAS0luZGljYXRlcyB0aGUgYWRtaW4gaXMgdXAgdG8gc29tZXRoaW5nIGFuZCB0cnlpbmcgdG8gY2xhaW0gYSBwcml6ZSAodGVzdGVkKQAAAAAQQWRtaW5DYW5ub3RDbGFpbQAAAG0AAABESW5kaWNhdGVzIHRoZXJlIGFyZSBub3QgZW5vdWdoIGVudHJhbnRzLCBhbmQgZXZlcnlib2R5IHdpbnMgKHRlc3RlZCkAAAARTm90RW5vdWdoRW50cmFudHMAAAAAAADJAAAATEluZGljYXRlcyB0aGUgd2lubmVycyBoYXZlIGFscmVhZHkgYmVlbiBkcmF3biwgd2UgY2Fubm90IGRyYXcgYWdhaW4gKHRlc3RlZCkAAAAUV2lubmVyc0FscmVhZHlDaG9zZW4AAADK',
                'AAAAAQAAAAAAAAAAAAAACUVudHJ5RGF0YQAAAAAAAAQAAAAAAAAAB2FkZHJlc3MAAAAAEwAAAAAAAAAFaW5kZXgAAAAAAAAEAAAAAAAAAAlpc193aW5uZXIAAAAAAAABAAAAAAAAAAl0aW1lc3RhbXAAAAAAAAAG',
                'AAAAAQAAAAAAAAAAAAAACUNsYWltVGltZQAAAAAAAAIAAAAAAAAAA2VuZAAAAAAGAAAAAAAAAAVzdGFydAAAAAAAAAY=',
                'AAAAAgAAAAAAAAAAAAAAB1N0b3JhZ2UAAAAACAAAAAAAAAAAAAAABUFkbWluAAAAAAAAAAAAAAAAAAAMVG90YWxFbnRyaWVzAAAAAAAAAAAAAAANV2lubmVyc0Nob3NlbgAAAAAAAAAAAAAAAAAADFRvdGFsQ2xhaW1lZAAAAAEAAAAAAAAAB0VudHJhbnQAAAAAAQAAAAQAAAABAAAAAAAAAAVFbnRyeQAAAAAAAAEAAAATAAAAAQAAAAAAAAAGV2lubmVyAAAAAAABAAAABAAAAAEAAAAAAAAAB0NsYWltZWQAAAAAAQAAABM=',
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
