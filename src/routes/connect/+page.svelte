<script lang="ts">
    import { account, send } from '$lib/passkeyClient';
    import { error } from '@sveltejs/kit';
    import { toaster } from '$lib/toaster';
    import { user } from '$lib/state/UserState.svelte';
    import Wallet from '@lucide/svelte/icons/wallet';
    import Fingerprint from '@lucide/svelte/icons/fingerprint';
    import LoaderPinwheel from '@lucide/svelte/icons/loader-pinwheel';
    import { goto } from '$app/navigation';

    let isSigningUp = $state(false);
    let isSigningIn = $state(false);
    let isLoading = $derived(isSigningUp || isSigningIn || !!user.contractAddress);

    // if (user.contractAddress && user.keyId) {
    //     goto('/enter')
    // }

    /**
     * Sign up as a new user, creating a smart wallet along the way.
     */
    async function signup() {
        console.log('signing up');
        try {
            isSigningUp = true;
            const { keyIdBase64, contractId, signedTx } = await account.createWallet(
                'Fest Raffle',
                'Fest Raffle',
            );

            if (!signedTx) {
                error(500, {
                    message: 'built transaction missing',
                });
            }

            user.set({
                keyId: keyIdBase64,
                contractAddress: contractId,
            });

            console.log('keyId', user.keyId);
            console.log('contractAddress', user.contractAddress);

            await send(signedTx);
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing up. Please try again later.',
            });
        } finally {
            isSigningUp = false;
        }
    }

    /**
     * Sign in as a returning user, creating a smart wallet along the way.
     */
    async function login() {
        console.log('logging in');
        try {
            isSigningIn = true;
            const { keyIdBase64, contractId } = await account.connectWallet();

            user.set({
                keyId: keyIdBase64,
                contractAddress: contractId,
            });

            console.log('keyId', user.keyId);
            console.log('contractAddress', user.contractAddress);
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing in. Please try again later.',
            });
        } finally {
            isSigningIn = false;
        }
    }
</script>

<h1 class="h1">YOU'RE JUST A TAP AWAY</h1>
<p>You could be a winner!</p>
{#if user.contractAddress}
    <p>You've got your smart wallet signed in. Head to the next page.</p>
{:else}
    <p>Tap the button to create your very own smart wallet.</p>
{/if}

<div>
    <button class="btn preset-filled btn-lg" onclick={signup} disabled={isLoading}>
        {#if isSigningUp}
            <LoaderPinwheel size={24} class="animate-spin" />
        {:else}
            <Fingerprint size={24} />
        {/if}
        <span>Create Wallet</span>
    </button>
</div>
<div>
    <button class="btn preset-outlined" onclick={login} disabled={isLoading}>
        {#if isSigningIn}
            <LoaderPinwheel size={18} class="animate-spin" />
        {:else}
            <Wallet size={18} />
        {/if}
        <span>Sign In</span>
    </button>
</div>
