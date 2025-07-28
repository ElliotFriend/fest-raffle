<script lang="ts">
    import type { PageProps } from './$types';
    import { toaster } from '$lib/toaster';
    import LoaderPinwheel from '@lucide/svelte/icons/loader-pinwheel';
    import Trophy from '@lucide/svelte/icons/trophy';
    import { user } from '$lib/state/UserState.svelte';
    import fest_raffle from '$lib/contracts/fest_raffle';
    import { Api } from '@stellar/stellar-sdk/minimal/rpc';
    import { account, send } from '$lib/passkeyClient';
    import type { AssembledTransaction } from '@stellar/stellar-sdk/minimal/contract';
    import Truncated from '$lib/components/ui/Truncated.svelte';

    let { data }: PageProps = $props();
    $inspect(data);
    let isDrawingWinners = $state(false);
    let numberOfWinners = $state(3);
    let buttonText = $derived(data.instance.TotalWinners ? 'Map Winners' : 'Draw Winners');

    function checkSimulationError(sim: Api.SimulateTransactionResponse) {
        if (Api.isSimulationError(sim)) {
            console.error(sim.error);
            if (sim.error.includes('Error(Contract, #201')) {
                throw 'Error #201: Not enough entrants. Please draw a lower number of winners.';
            } else if (sim.error.includes('Error(Contract, #202')) {
                throw 'Winners have already been drawn. Cannot draw again.';
            } else if (sim.error.includes('Error(Contract, #203')) {
                throw 'Winners have not been drawn. Winner mapping failed.';
            }
            throw 'Something went wrong drawing winners. Please try again later.';
        }
    }

    async function drawAndMapWinners() {
        if (user.contractAddress && user.keyId) {
            try {
                isDrawingWinners = true;

                let at: AssembledTransaction<null>;

                if (!data.instance.TotalWinners) {
                    console.log('drawing winners');

                    at = await fest_raffle.draw_winners({
                        number_of_winners: numberOfWinners,
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
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
            } finally {
                isDrawingWinners = false;
            }
        }
    }
</script>

<h1 class="h1">Admin Area</h1>
<p>For Lindsay's Eys Only!</p>

{#if !data.instance.TotalWinners || !Object.keys(data.winners).length}
    <label class="label">
        <span class="label-text">Number of Winners</span>
        <input
            type="number"
            class="input"
            placeholder="Number of Winners"
            bind:value={numberOfWinners}
        />
    </label>
    <button class="btn preset-filled" onclick={drawAndMapWinners} disabled={isDrawingWinners}>
        {#if isDrawingWinners}
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
{/if}
