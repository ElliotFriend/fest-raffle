<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

{#if !data.entry}
    {#if data.instance.WinnersChosen}
        <h1 class="h1">SORRY. YOU MISSED THE RAFFLE 💔</h1>
        <p>This one's already run its course. Apologies if you got your hopes up.</p>
    {:else}
        <h1 class="h1">YOU AREN'T ENTERED YET!</h1>
        <p>Don't miss out. Head back one page to enter the raffle.</p>
    {/if}
{:else if !data.instance.WinnersChosen}
    <h1 class="h1">PATIENCE, MY FRIEND!</h1>
    <p>The drawing will take place at 1:00PM. Come back and refresh this page after that time.</p>
{:else if data.entry?.is_winner}
    <h1 class="h1">YOU WON.<br />YOU DID IT.</h1>
    <p>To claim your labubu, meet at the library at 3:00pm.</p>
    <p>You will have to authorize your win on site.</p>
    <p>Do not click ahead until you are at the library!</p>
{:else}
    <h1 class="h1">IT WASN'T YOUR DAY 💔</h1>
    <p>It's back to waiting for those coveted PopMart drops. At least you did an onchain raffle!</p>
    <p>Thanks for playing.</p>
{/if}
