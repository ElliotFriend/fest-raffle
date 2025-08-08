<script lang="ts">
    let { children } = $props();
</script>

<div class="flex-auto w-full h-full flex overflow-hidden p-4 text-center">
    <div
        id="page"
        class="scroll-smooth flex-1 overflow-x-hidden flex flex-col justify-center-safe items-center"
        style="scrollbar-gutter: auto;"
    >
        <main id="page-content" class="flex">
            <div class="mx-auto w-full max-w-4xl space-y-4">
                {@render children()}
            </div>
        </main>
    </div>
</div>
