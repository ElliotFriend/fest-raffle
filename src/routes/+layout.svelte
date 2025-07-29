<script lang="ts">
    import '../app.css';
    import { Toaster } from '@skeletonlabs/skeleton-svelte';
    import { toaster } from '$lib/toaster';

    import Header from '$lib/components/ui/Header.svelte';
    import PageContent from '$lib/components/ui/PageContent.svelte';
    import Footer from '$lib/components/ui/Footer.svelte';

    let { children } = $props();
</script>

<Toaster {toaster}></Toaster>

<div class="p-safe flex flex-col items-center justify-center h-dvh">
    <div
        class="relative w-full flex flex-col overflow-hidden bg-[url('/assets/bg1.png')] bg-center bg-cover bg-no-repeat h-dvh max-h-[1334px] max-w-[750px]"
    >
        <Header />
        <PageContent>
            {@render children()}
        </PageContent>
        <Footer />
    </div>
</div>
