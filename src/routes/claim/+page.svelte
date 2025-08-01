<script lang="ts">
    import type { PageProps } from './$types';
    let { data }: PageProps = $props();
    $inspect(data);

    import fest_raffle from '$lib/contracts/fest_raffle';
    import { user } from '$lib/state/UserState.svelte';
    import { toaster } from '$lib/toaster';
    import { account, send } from '$lib/passkeyClient';
    import { xdr } from '@stellar/stellar-sdk/minimal';
    import Award from '@lucide/svelte/icons/award';
    import LoaderPinwheel from '@lucide/svelte/icons/loader-pinwheel';
    import { invalidate } from '$app/navigation';
    import { checkSimulationError } from '$lib/utils';

    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Just won a custom labubu at FEST ✨\nOnchain lottery → Physical collectible → Digital twin → Pure joy\n\nThe future is a little delulu and absolutely adorable with @BuildonStellar')}`;

    let isLoading = $state(false);
    let claimAfter: string | undefined = $derived.by(() => {
        if (data.instance.ClaimWindow) {
            const date = new Date(Number(data.instance.ClaimWindow.after * BigInt(1000)));
            const now = new Date();
            if (now >= date) {
                return 'now';
            } else if (date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString();
            }
            return date.toLocaleString();
        }
    });
    let claimUntil: string | undefined = $derived.by(() => {
        if (data.instance.ClaimWindow) {
            const date = new Date(Number(data.instance.ClaimWindow.until * BigInt(1000)));
            const now = new Date();
            if (now >= date) {
                return 'past';
            } else if (date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString();
            }
            return date.toLocaleString();
        }
    });
    let isClaimableTime = $derived(claimUntil !== 'past' && claimAfter === 'now');
    let buttonDisabled = $derived(
        isLoading || !user.contractAddress || !data.entry?.is_winner || !isClaimableTime,
    );

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
    <a href={tweetUrl} class="btn btn-lg preset-filled" target="_blank" rel="noopener noreferrer">
        <span>Post on X</span>
    </a>
{:else}
    <h1 class="h1">AUTHORIZE YOUR WIN</h1>
    <p>It's time to find out which labubu is yours!</p>
    {#if claimAfter && claimUntil}
        <p class="text-sm!">
            {#if claimUntil === 'past'}
                Claiming window has expired.
            {:else}
                Claiming is available between {claimAfter} and {claimUntil}
            {/if}
        </p>
    {:else}
        <p class="text-sm!">Claiming is currently unavailable. Please check again later.</p>
    {/if}
    <button class="btn btn-lg preset-filled w-full" onclick={claimPrize} disabled={buttonDisabled}>
        {#if isLoading}
            <LoaderPinwheel size={24} class="animate-spin" />
        {:else}
            <Award size={24} />
        {/if}
        <span>Claim</span>
    </button>
{/if}
