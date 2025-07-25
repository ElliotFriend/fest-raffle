<script lang="ts">
    import { account, send } from '$lib/passkeyClient';

    // import { Pagination } from "@skeletonlabs/skeleton-svelte";
    import { keyId } from '$lib/state/keyId';
    import { contractAddress } from '$lib/state/contractAddress';
    import { toaster } from '$lib/toaster';
    import { error } from '@sveltejs/kit';

    // import WelcomePage from "$lib/components/WelcomePage.svelte";
    // import ConnectPage from "$lib/components/ConnectPage.svelte";
    // import PageContent from "$lib/components/ui/PageContent.svelte";
    // import Footer from "$lib/components/ui/Footer.svelte";
    // import Header from "$lib/components/ui/Header.svelte";
    // import EnterRaffle from "$lib/components/EnterRaffle.svelte";

    // let sourceData: number[] = $state([ 1, 2, 3, 4, 5, 6 ]);
    let page = $state(1);

    // const currentPage = $derived((s) => s[page - 1])
    let winner = $state(true);
    let labubuWon = $state(13);
</script>

{#if page === 4}
    <h1>page 4</h1>
{:else if page === 5}{:else if page === 6}
    <h1 class="h1">You have won labubu #{labubuWon}</h1>
    <p>Tell everyone that you're a winner and having fun onchain:</p>
    <div>
        <button type="button" class="btn preset-filled">Share on X</button>
    </div>
{:else}
    <h1 class="h1">It's time to get Delulu for Labubu</h1>
    <p>An onchain lottery for the cutest monsters</p>
{/if}
