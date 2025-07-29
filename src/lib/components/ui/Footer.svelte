<script lang="ts">
    import ArrowRight from '@lucide/svelte/icons/arrow-right';
    import ArrowLeft from '@lucide/svelte/icons/arrow-left';
    import ExternalLink from '@lucide/svelte/icons/external-link';
    import House from '@lucide/svelte/icons/house';
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
            if (currentPage.includes('/check') && !page.data.entry?.is_winner) {
                return null;
            }
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
        <ArrowRight size={24} />
    {:else}
        <ArrowLeft size={24} />
    {/if}
{/snippet}

{#snippet navButton(url: string | null, label: string)}
    {#if url !== null}
        <a href={url} type="button" class="btn-icon btn-icon-lg rounded-full preset-filled">
            {@render iconLabel(label)}
        </a>
    {:else}
        <button
            type="button"
            class="btn-icon btn-icon-lg rounded-full preset-filled scale"
            disabled
        >
            {@render iconLabel(label)}
        </button>
    {/if}
{/snippet}

<footer class="p-2">
    <div class="flex items-center justify-center space-x-4">
        {#if currentPage === '/admin'}
            <a class="btn preset-filled" href="/">
                <House size={18} />
                <span>Home</span>
            </a>
            <a
                class="btn preset-outlined"
                href={`https://stellar.expert/explorer/${PUBLIC_STELLAR_NETWORK}/contract/${PUBLIC_RAFFLE_CONTRACT}`}
                target="_blank"
            >
                <ExternalLink size={18} />
                <span>View Contract</span>
            </a>
        {:else}
            {@render navButton(prevPage, 'previous')}
            {@render navButton(nextPage, 'next')}
        {/if}
    </div>
</footer>
