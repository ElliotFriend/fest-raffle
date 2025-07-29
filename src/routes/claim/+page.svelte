<script lang="ts">
    import type { PageProps } from './$types';
    let { data }: PageProps = $props();

    import fest_raffle from '$lib/contracts/fest_raffle';
    import { user } from '$lib/state/UserState.svelte';
    import { toaster } from '$lib/toaster';
    import { account, send } from '$lib/passkeyClient';
    import { Api } from '@stellar/stellar-sdk/rpc';
    import { xdr } from '@stellar/stellar-sdk';
    import Award from '@lucide/svelte/icons/award';
    import LoaderPinwheel from '@lucide/svelte/icons/loader-pinwheel';
    import { invalidate } from '$app/navigation';
    import { checkSimulationError } from '$lib/utils';

    let isLoading = $state(false);
    let buttonDisabled = $derived(isLoading || !user.contractAddress || !data.entry?.is_winner);

    async function claimPrize() {
        if (user.contractAddress && user.keyId) {
            try {
                isLoading = true;
                // invoke claim function
                let at = await fest_raffle.claim_prize({
                    entrant: user.contractAddress,
                });
                checkSimulationError(at.simulation!);

                await account.sign(at, { keyId: user.keyId });
                let { returnValue } = await send(at.built!);
                const prizeLabubu = xdr.ScVal.fromXDR(returnValue, 'base64').u32();

                toaster.success({
                    title: 'Success',
                    description: `Congratulations! Enjoy your cute monster, Labubu #${prizeLabubu}!`,
                });

                invalidate('app:claim');
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
            } finally {
                isLoading = false;
            }
        } else {
            toaster.info({
                title: 'Wait a sec',
                description: 'You need to signup or sign in before you can claim.',
            });
        }
    }
</script>

{#if data.claimedAt}
    <h1 class="h1">YOU HAVE WON LABUBU #{data.entry.prize_won}</h1>
    <p>Tell everyone that you're a winner and having fun on chain!</p>
    <button class="btn btn-lg preset-filled">
        <span>Post on X</span>
    </button>
    <a
        href="https://twitter.com/share?ref_src=twsrc%5Etfw"
        class="btn btn-lg twitter-share-button"
        data-show-count="false">Tweet</a
    ><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
{:else}
    <h1 class="h1">AUTHORIZE YOUR WIN</h1>
    <p>It's time to find out which labubu is yours!</p>
    <p>(Tap the button below while Lindsay is watching)</p>
    <button class="btn btn-lg preset-filled w-full" onclick={claimPrize} disabled={buttonDisabled}>
        {#if isLoading}
            <LoaderPinwheel size={24} class="animate-spin" />
        {:else}
            <Award size={24} />
        {/if}
        <span>Claim</span>
    </button>
{/if}
