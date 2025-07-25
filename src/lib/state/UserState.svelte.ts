import { goto } from '$app/navigation';

class User {
    keyId: string | null = $state('');
    contractAddress: string | null = $state('');

    constructor() {
        if (window.localStorage.hasOwnProperty('fest:keyId')) {
            this.keyId = localStorage.getItem('fest:keyId');
        }
        if (window.localStorage.hasOwnProperty('fest:contractAddress')) {
            this.contractAddress = localStorage.getItem('fest:contractAddress');
        }
    }

    set = ({ keyId, contractAddress }: { keyId: string; contractAddress: string }) => {
        this.keyId = keyId;
        window.localStorage.setItem('fest:keyId', keyId);
        this.contractAddress = contractAddress;
        window.localStorage.setItem('fest:contractAddress', contractAddress);
    };

    reset = () => {
        this.keyId = null;
        this.contractAddress = null;
        window.localStorage.clear();
        goto('/');
        // window.location.reload()
    };
}

export const user = new User();
