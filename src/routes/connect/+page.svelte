<script lang="ts">
    import { account, send } from "$lib/passkeyClient";
    // import { keyId } from "$lib/state/keyId";
    // import { contractAddress } from "$lib/state/contractAddress";
    import { error } from "@sveltejs/kit";
    import { toaster } from "$lib/toaster";
    import { user } from "$lib/state/UserState.svelte";

    /**
     * Sign up as a new user, creating a smart wallet along the way.
     */
    async function signup() {
        console.log('signing up');
        try {
            const {
                keyIdBase64,
                contractId,
                signedTx,
            } = await account.createWallet(
                'Fest Raffle',
                'Fest Raffle',
            );

            if (!signedTx) {
                error(500, {
                    message: 'built transaction missing'
                })
            }

            user.set({
                keyId: keyIdBase64,
                contractAddress: contractId,
            });
            console.log('keyId', user.keyId)
            console.log('contractAddress', user.contractAddress)
            // keyId.set(keyIdBase64);
            // console.log('keyId', $keyId);

            // contractAddress.set(contractId);
            // console.log('contractAddress', $contractAddress)

            await send(signedTx);
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing up. Please try again later.',
            });
        }
    }

    /**
     * Sign in as a returning user, creating a smart wallet along the way.
     */
    async function login() {
        console.log('logging in');
        try {
            const { keyIdBase64, contractId } = await account.connectWallet();

            user.set({
                keyId: keyIdBase64,
                contractAddress: contractId,
            });
            console.log('keyId', user.keyId)
            console.log('contractAddress', user.contractAddress)

            // keyId.set(keyIdBase64);
            // console.log($keyId);

            // contractAddress.set(contractId);
            // console.log($contractAddress);
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing in. Please try again later.',
            });
        }
    }
</script>

<h1 class="h1">You're just a couple taps away from being a winner.</h1>
<p>Press the button to create your very own smart wallet.</p>
<div>
    <button class="btn preset-filled" onclick={signup}>Create Wallet</button>
</div>
<div>
    <button onclick={login}>Sign In</button>
</div>
