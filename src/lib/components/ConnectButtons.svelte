<script lang="ts">
    import { toaster } from '$lib/toaster';
    import { account } from '$lib/passkeyClient';

    /**
     * Sign up as a new user, creating a smart wallet along the way.
     */
    async function signup() {
        console.log('signing up');
        try {
            const { keyIdBase64, publicKey } = await account.createKey(
                'Fest Raffle',
                'Fest Raffle',
            );

            // const { contractId } = await deploy(keyIdBase64, base64url(publicKey));

            // account.wallet = new PasskeyClient({
            //     contractId,
            //     rpcUrl: PUBLIC_STELLAR_RPC_URL,
            //     networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            // });

            // keyId.set(keyIdBase64);
            // console.log('keyId', $keyId);
            // wallet.address = contractId;
            // console.log('wallet.address', wallet.address);
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong signing up. Please try again later.',
            });
        }
    }

    /**
     * Log in as an existing user, connecting to a pre-existing smart wallet.
     */
    async function login() {
        console.log('logging in');
        try {
            // Implement the login logic here
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging in. Please try again later.',
            });
        }
    }

    /**
     * Log out from the current user session.
     */
    async function logout() {
        console.log('logging out');
        try {
            // Implement the logout logic here
        } catch (err) {
            console.error(err);
            toaster.error({
                title: 'Error',
                description: 'Something went wrong logging out. Please try again later.',
            });
        }
    }
</script>

<div class="flex space-x-1 md:space-x-2">
    <button class="btn preset-filled-primary-500" onclick={signup}>Signup</button>
    <button class="btn preset-tonal-primary" onclick={login}>Login</button>
    <button class="btn preset-tonal-error" onclick={logout}>Logout</button>
</div>
