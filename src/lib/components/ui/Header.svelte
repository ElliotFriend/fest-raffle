<script lang="ts">
    import { toaster } from '$lib/toaster';
    import Truncated from './Truncated.svelte';
    import { goto } from '$app/navigation';
    import { user } from '$lib/state/UserState.svelte';
    import { onMount } from 'svelte';
    import { account } from '$lib/passkeyClient';
    import RefreshCw from '@lucide/svelte/icons/refresh-cw';
    import { PUBLIC_STELLAR_NETWORK } from '$env/static/public';
    import Copy from '@lucide/svelte/icons/copy';

    onMount(async () => {
        if (user.keyId) {
            console.log('keyId', user.keyId);

            const { contractId } = await account.connectWallet({
                keyId: user.keyId,
            });
            user.set({
                keyId: user.keyId,
                contractAddress: contractId,
            });

            console.log('contractAddress', user.contractAddress);

            const elemButton = document.querySelector<HTMLButtonElement>('[data-copy-address]');
            elemButton?.addEventListener('click', () => {
                navigator.clipboard
                    .writeText(user.contractAddress!)
                    .then(() => console.log('copied!'));
            });
        }
    });

    function startOver() {
        try {
            user.reset();
            goto('/');
        } catch (err) {
            console.log(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging out. Please try again later.',
            });
        }
    }
</script>

<header>
    <div class="flex flex-row justify-between p-3">
        {#if user.contractAddress}
            <div class="flex content-center">
                <a
                    class="underline mr-1"
                    href={`https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${user.contractAddress}`}
                    target="_blank"
                >
                    <Truncated text={user.contractAddress} />
                </a>
                <button data-copy-address><Copy size={18} /></button>
            </div>
            <div>
                <button type="button" class="btn btn-sm preset-filled" onclick={startOver}>
                    <RefreshCw size={12} />
                    <span>Start Over</span>
                </button>
            </div>
        {:else}
            <div></div>
        {/if}
    </div>
</header>
