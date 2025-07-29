<script lang="ts">
    import type { PageProps } from './$types';
    import { toaster } from '$lib/toaster';
    import LoaderPinwheel from '@lucide/svelte/icons/loader-pinwheel';
    import ClockFading from '@lucide/svelte/icons/clock-fading';
    import Trophy from '@lucide/svelte/icons/trophy';
    import ShieldPlus from '@lucide/svelte/icons/shield-plus';
    import { user } from '$lib/state/UserState.svelte';
    import fest_raffle from '$lib/contracts/fest_raffle';
    import { account, send } from '$lib/passkeyClient';
    import type { AssembledTransaction } from '@stellar/stellar-sdk/minimal/contract';
    import Truncated from '$lib/components/ui/Truncated.svelte';
    import { invalidate } from '$app/navigation';
    import { onDestroy, onMount } from 'svelte';
    import { checkSimulationError } from '$lib/utils';

    let { data }: PageProps = $props();
    let isTransacting = $state(false);
    let numberOfWinners = $state(3);
    let buttonText = $derived(data.instance.TotalWinners ? 'Map Winners' : 'Draw Winners');
    let claimableAfter: string = $state('2025-07-28T13:00');
    let claimableUntil: string = $state('2025-08-01T22:00');
    let upgradeWasmHash: string = $state('');
    let interval: NodeJS.Timeout;

    // onMount(() => {
    //     if (data.instance.TotalWinners) {
    //         interval = setInterval(() => {
    //             invalidate('app:admin');
    //         }, 5000);
    //     }
    // });

    // onDestroy(() => {
    //     if (interval) clearInterval(interval);
    // });

    async function drawAndMapWinners() {
        if (user.contractAddress && user.keyId) {
            try {
                isTransacting = true;

                let at: AssembledTransaction<null>;

                if (!data.instance.TotalWinners) {
                    console.log('drawing winners');

                    at = await fest_raffle.draw_winners({
                        number_of_winners: numberOfWinners,
                        claim_after: BigInt(Math.floor(new Date(claimableAfter).getTime() / 1000)),
                        claim_until: BigInt(Math.floor(new Date(claimableUntil).getTime() / 1000)),
                    });
                    checkSimulationError(at.simulation!);

                    await account.sign(at, { keyId: user.keyId });
                    await send(at.built!);
                }

                if (!Object.keys(data.winners).length) {
                    console.log('mapping winners');
                    at = await fest_raffle.map_winners();
                    checkSimulationError(at.simulation!);
                    await send(at.built!);
                }

                toaster.success({
                    title: 'Success!',
                    description: 'You have successfully drawn the winners. Great job!',
                });

                invalidate('app:admin');
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
            } finally {
                isTransacting = false;
            }
        }
    }

    async function setClaimWindow() {
        if (user.contractAddress && user.keyId) {
            try {
                isTransacting = true;
                console.log('setting claim window');

                let at = await fest_raffle.set_claim_time({
                    claim_after: BigInt(Math.floor(new Date(claimableAfter).getTime() / 1000)),
                    claim_until: BigInt(Math.floor(new Date(claimableUntil).getTime() / 1000)),
                });
                checkSimulationError(at.simulation!);

                await account.sign(at, { keyId: user.keyId });
                await send(at.built!);

                toaster.success({
                    title: 'Success!',
                    description: 'You have successfully set the claim window. Great job!',
                });
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
            } finally {
                isTransacting = false;
            }
        }
    }

    async function upgradeContract() {
        if (user.contractAddress && user.keyId) {
            try {
                isTransacting = true;
                console.log('upgrading contract');

                let at = await fest_raffle.set_claim_time({
                    claim_after: BigInt(Math.floor(new Date(claimableAfter).getTime() / 1000)),
                    claim_until: BigInt(Math.floor(new Date(claimableUntil).getTime() / 1000)),
                });
                checkSimulationError(at.simulation!);

                await account.sign(at, { keyId: user.keyId });
                await send(at.built!);

                toaster.success({
                    title: 'Success!',
                    description: 'You have successfully upgraded the smart contract. Great job!',
                });
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
            } finally {
                isTransacting = false;
            }
        }
    }
</script>

<h1 class="h1">ADMIN ARENA</h1>
<p>For Lindsay's Eys Only!</p>

{#if !data.instance.WinnersChosen}
    <label class="label">
        <span class="label-text">Number of Winners</span>
        <input
            type="number"
            class="input"
            placeholder="Number of Winners"
            bind:value={numberOfWinners}
        />
    </label>
    {@render claimTimeInputs()}
    <button class="btn preset-filled" onclick={drawAndMapWinners} disabled={isTransacting}>
        {#if isTransacting}
            <LoaderPinwheel size={18} class="animate-spin" />
        {:else}
            <Trophy size={18} />
        {/if}
        <span>{buttonText}</span>
    </button>
{:else}
    <div class="table-wrap">
        <table class="table caption-bottom">
            <caption class="pt-4"
                >A list of labubu winners, and which prize they've claimed (and when)</caption
            >
            <thead>
                <tr>
                    <th>Labubu no.</th>
                    <th>Address</th>
                    <th>Claimed at</th>
                </tr>
            </thead>
            <tbody class="[&>tr]:hover:preset-tonal-primary">
                {#each Object.entries(data.winners) as [labubu, winnerRow]}
                    <tr>
                        <td>{labubu}</td>
                        <td
                            ><Truncated
                                text={String(winnerRow.address)}
                                startChars={6}
                                endChars={6}
                            /></td
                        >
                        <td>{winnerRow.claimed || 'n/a'}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

    <h2 class="h2">Set Claim Window</h2>
    {@render claimTimeInputs()}
    <button class="btn preset-filled" disabled={isTransacting} onclick={setClaimWindow}>
        {#if isTransacting}
            <LoaderPinwheel size={18} class="animate-spin" />
        {:else}
            <ClockFading size={18} />
        {/if}
        <span>Set Claim Window</span>
    </button>
{/if}

<label class="label">
    <span class="label-text">Upgrade Raffle Contract</span>
    <input class="input" type="text" bind:value={upgradeWasmHash} />
</label>
<button class="btn preset-filled" disabled={isTransacting} onclick={upgradeContract}>
    {#if isTransacting}
        <LoaderPinwheel size={18} class="animate-spin" />
    {:else}
        <ShieldPlus size={18} />
    {/if}
    <span>Upgrade Contract</span>
</button>

{#snippet claimTimeInputs()}
    <label class="label">
        <span class="label-text">Claimable After</span>
        <input class="input" type="datetime-local" bind:value={claimableAfter} />
    </label>
    <label class="label">
        <span class="label-text">Claimable Until</span>
        <input class="input" type="datetime-local" bind:value={claimableUntil} />
    </label>
{/snippet}
