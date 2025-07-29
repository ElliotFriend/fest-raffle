<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
    $inspect('data', data);
</script>

{#if data.isWinner}
    <h1 class="h1">YOU WON.<br />YOU DID IT.</h1>
    <p>To claim your labubu, meet at the library at 3:00pm.</p>
    <p>You will have to authorize your win on site.</p>
    <p>Do not click ahead until you are at the library!</p>
{:else}
    <h1 class="h1">IT WASN'T YOUR DAY 💔</h1>
    <p>It's back to waiting for those coveted PopMart drops. At least you did an onchain raffle!</p>
    <p>Thanks for playing.</p>
{/if}
