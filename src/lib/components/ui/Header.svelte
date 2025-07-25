<script lang="ts">
    // import { contractAddress } from '$lib/state/contractAddress';
    // import { keyId } from '$lib/state/keyId';
    import { toaster } from '$lib/toaster';
    import Truncated from './Truncated.svelte';
    import { goto } from '$app/navigation';
    import { user } from '$lib/state/UserState.svelte';

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

<header class="bg-surface-200-800">
    <div class="flex flex-row justify-between p-3">
        {#if user.contractAddress}
            <div>
                <Truncated text={user.contractAddress} startChars={5} endChars={5} />
            </div>
            <div>
                <button type="button" class="btn btn-sm preset-filled" onclick={startOver}
                    >Start Over</button
                >
            </div>
        {:else}
            <div></div>
        {/if}
    </div>
</header>
