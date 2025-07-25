<script lang="ts">
    import type { PageProps } from './$types';
    let data: PageProps = $props()

    import fest_raffle from '$lib/contracts/fest_raffle';
    import { user } from '$lib/state/UserState.svelte';
    import { toaster } from '$lib/toaster';
    import { account, send } from '$lib/passkeyClient';
    import { Api } from '@stellar/stellar-sdk/rpc';
    import { xdr } from '@stellar/stellar-sdk';

    async function claimPrize() {
        if (user.contractAddress && user.keyId) {
            try {
                // invoke claim function
                let at = await fest_raffle.claim_prize({
                    entrant: user.contractAddress,
                })

                if (Api.isSimulationError(at.simulation!)) {
                    console.error(at.simulation.error)
                    if (at.simulation.error.includes('Error(Contract, #106)')) {
                        throw 'Winners have not yet been drawn. No claiming yet.'
                    } else if (at.simulation.error.includes('Error(Contract, #109)')) {
                        throw 'Admin cannot claim a prize. Very sneaky, Lindsay!'
                    } else if (at.simulation.error.includes('Error(Contract, #102)')) {
                        throw 'No entry found. Looks like you never entered the raffle.'
                    } else if (at.simulation.error.includes('Error(Contract, #104)')) {
                        throw 'You have already claimed your prize. No double-dips.'
                    } else if (at.simulation.error.includes('Error(Contract, #110)')) {
                        throw 'You are not a winner, and cannot claim. Sorry about that.'
                    }
                    throw 'Something went wrong claiming your prize. Please try again later.'
                }

                await account.sign(at, { keyId: user.keyId })
                let { returnValue } = await send(at.built!)
                const prizeLabubu = xdr.ScVal.fromXDR(returnValue, 'base64').u32();

                toaster.success({
                    title: 'Success',
                    description: `Congratulations! Enjoy your cute monster, Labubu #${prizeLabubu}!`
                });
            } catch (err) {
                toaster.error({
                    title: 'Error',
                    description: err
                });
            }
        } else {
            toaster.info({
                title: 'Wait a sec',
                description: 'You need to signup or sign in before you can claim.'
            })
        }
    }
</script>

<h1 class="h1">Authorize your win.</h1>
<p>It's time to find out which labubu is yours!</p>
<p>(Tap the button below while Lindsay is watching)</p>
<button class="btn preset-filled" onclick={claimPrize}  disabled={!user.contractAddress}>Claim!</button>
