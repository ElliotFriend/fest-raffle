<script lang="ts">
    // import { contractAddress } from "$lib/state/contractAddress";
    // import { keyId } from "$lib/state/keyId";
    import { account, send } from '$lib/passkeyClient';
    import { toaster } from '$lib/toaster';
    import raffleClient from '$lib/contracts/fest_raffle';
    import { xdr } from '@stellar/stellar-sdk/minimal';
    import type { PageProps } from './$types';
    import { goto } from '$app/navigation';
    let { data }: PageProps = $props();
    import { user } from '$lib/state/UserState.svelte';
    import { Api } from '@stellar/stellar-sdk/minimal/rpc';

    // $derived.by(() => {
    // if (!user.contractAddress) {
    //     goto('/connect')
    // }
    // })

    async function enterRaffle() {
        if (user.contractAddress && user.keyId) {
            try {
                console.log('entering raffle');

                let at = await raffleClient.enter_raffle({
                    entrant: user.contractAddress,
                });

                if (Api.isSimulationError(at.simulation!)) {
                    console.error(at.simulation.error);
                    if (at.simulation.error.includes('Error(Contract, #101')) {
                        throw 'You have already entered the raffle. No double-dips.';
                    } else if (at.simulation.error.includes('Error(Contract, #107')) {
                        throw 'Winners have already been drawn. Entries are closed.';
                    } else if (at.simulation.error.includes('Error(Contract, #108')) {
                        throw 'Admin cannot enter the raffle. Very sneaky, Lindsay!';
                    }
                    throw 'Something went wrong entering the raffle. Please try again later.';
                }

                await account.sign(at, { keyId: user.keyId });
                let { returnValue } = await send(at.built!);
                const entrantIndex = xdr.ScVal.fromXDR(returnValue, 'base64').u32();
                toaster.success({
                    title: 'Success!',
                    description: `You successfully entered the raffle. You're number ${entrantIndex} to do so! Great work!`,
                });
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err,
                });
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
    <h1 class="h1">You're just a tap away from being a winner.</h1>
    <p>Press the button to enter the raffle.</p>
    <div>
        <button class="btn preset-filled" onclick={enterRaffle} disabled={!user.contractAddress}
            >Enter</button
        >
    </div>
{:else}
    <h1 class="h1">Thanks for entering!</h1>
    <p>Now, we wait. Keep this tab open.</p>
    <p>Drawing at 1:00pm</p>
{/if}
