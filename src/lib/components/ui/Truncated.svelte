<script lang="ts">
    let {
        text,
        startChars = 4,
        endChars = 4,
    }: { text: string; startChars?: number; endChars?: number } = $props();

    let shortenedText = `${text.slice(0, startChars)}...${text.slice(endChars * -1)}`;
</script>

<p class="font-mono">{shortenedText}</p>
