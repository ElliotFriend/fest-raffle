<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import { page } from '$app/state';
    import { PUBLIC_RAFFLE_CONTRACT, PUBLIC_STELLAR_NETWORK } from '$env/static/public';

    const slides: Record<string, { prev: string | null; next: string | null }> = {
        '/': { prev: null, next: '/connect' },
        '/connect': { prev: '/', next: '/enter' },
        '/enter': { prev: '/connect', next: '/check' },
        '/check': { prev: '/enter', next: '/claim' },
        '/claim': { prev: '/check', next: null },
    };

    const currentPage = $derived(page.route.id);
    let nextPage: string | null = $derived.by(() => {
        if (currentPage) {
            return slides[currentPage].next;
        } else {
            return null;
        }
    });
    let prevPage: string | null = $derived.by(() => {
        if (currentPage) {
            return slides[currentPage].prev;
        } else {
            return null;
        }
    });
</script>

{#snippet iconLabel(label: string)}
    {#if label === 'next'}
        <span>{label}</span>
        <ArrowRight size={18} />
    {:else}
        <ArrowLeft size={18} />
        <span>{label}</span>
    {/if}
{/snippet}

{#snippet navButton(url: string | null, label: string)}
    {#if url !== null}
        <a href={url} type="button" class="btn preset-filled">
            {@render iconLabel(label)}
        </a>
    {:else}
        <button type="button" class="btn preset-filled" disabled>
            {@render iconLabel(label)}
        </button>
    {/if}
{/snippet}

{#if currentPage === '/admin'}
    <footer class="p-2 bg-surface-200-800">
        <div class="flex items-center justify-center space-x-4">
            <a
                class="anchor"
                href={`https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${PUBLIC_RAFFLE_CONTRACT}`}
                target="_blank">View Contract</a
            >
        </div>
    </footer>
{:else}
    <footer class="p-2 bg-surface-200-800">
        <div class="flex items-center justify-center space-x-4">
            {@render navButton(prevPage, 'previous')}
            {@render navButton(nextPage, 'next')}
        </div>
    </footer>
{/if}
