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
        <!-- <div class="relative w-full flex flex-col items-center justify-center h-dvh px-2 select-none overflow-hidden bg-violet-800 max-h-[800px] max-w-[500px] py-2 null"> -->
        <!-- <div class="relative w-full flex flex-col items-center justify-center h-dvh min-h-[663px] max-h-[800px] px-2 overflow-hidden bg-[url('/bgs/bg1.png')] bg-[length:1000px] bg-[center_-29rem] bg-no-repeat max-w-[500px]"> -->
        <Header />
        <PageContent>
            {@render children()}
        </PageContent>
        <Footer />
    </div>
</div>
