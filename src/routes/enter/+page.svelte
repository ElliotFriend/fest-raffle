<script lang="ts">
    import { account, send } from '$lib/passkeyClient';
    import { toaster } from '$lib/toaster';
    import raffleClient from '$lib/contracts/fest_raffle';
    import { xdr } from '@stellar/stellar-sdk/minimal';
    import { user } from '$lib/state/UserState.svelte';
    import Ticket from '@lucide/svelte/icons/ticket';
    import LoaderPinwheel from '@lucide/svelte/icons/loader-pinwheel';
    import { invalidate } from '$app/navigation';
    import { checkSimulationError } from '$lib/utils';

    import type { PageProps } from './$types';
    let { data }: PageProps = $props();

    let isEntering = $state(false);
    let isButtonDisabled = $derived(
        isEntering || !user.contractAddress || data.instance.WinnersChosen,
    );

    async function enterRaffle() {
        if (user.contractAddress && user.keyId) {
            try {
                console.log('entering raffle');
                isEntering = true;

                let at = await raffleClient.enter_raffle({
                    entrant: user.contractAddress,
                });
                checkSimulationError(at.simulation!);

                await account.sign(at, { keyId: user.keyId });
                let { returnValue } = await send(at.built!);
                const entrantIndex = xdr.ScVal.fromXDR(returnValue, 'base64').u32();
                toaster.success({
                    title: 'Success!',
                    description: `You successfully entered the raffle. You're number ${entrantIndex + 1} to do so! Great work!`,
                });

                invalidate('app:layout')
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
            } finally {
                isEntering = false;
            }
        } else {
            toaster.info({
                title: 'Wait a sec',
                description: 'You need to signup or sign in before you can enter.',
            });
        }
    }
</script>

{#if !data.hasEntered}
    <h1 class="h1">JUST ONE MORE TAP AND YOU'RE GOLDEN</h1>
    <p>Press the button to enter the raffle.</p>
    <div>
        <button
            class="btn btn-lg preset-filled w-full"
            onclick={enterRaffle}
            disabled={isButtonDisabled}
        >
            {#if isEntering}
                <LoaderPinwheel size={24} class="animate-spin" />
            {:else}
                <Ticket size={24} />
            {/if}
            <span>Enter</span>
        </button>
    </div>
{:else}
    <h1 class="h1">THANKS FOR ENTERING</h1>
    <p>Now, we wait. Keep this tab open.</p>
    <p>Drawing at 1:00PM</p>
{/if}
