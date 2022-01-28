<script lang="ts">
    // import { fade, fly } from "svelte/transition";
    export let line: string;
    export let selectLine: string;

    let splittedLine: Array<string>;
    $: {
        if (selectLine.length > 0) {
            splittedLine = line.split(new RegExp(selectLine, 'gi'));
        } else {
            splittedLine = [line];
        }
    }
    
</script>

<!-- {#if selectLine.length > 0}
    <p>{@html line.replace(new RegExp(selectLine, 'gi'), `<span style="color: red;">${selectLine}</span>`)}</p>
{:else}
    <p>{line}</p>
{/if} -->

<div class="line">
    {#if selectLine !== undefined && selectLine.length > 0}
        {#each splittedLine as linePart, i(i)}
            <span>{linePart}</span>{#if i !== splittedLine.length - 1 }<span class="selected-log-line">{selectLine}</span>{/if}
        {/each}
    {:else}
        <span>{line}</span>
    {/if}
</div>


<style>
    .line {
        font-size: 1rem;
        padding: .3em;
        color: var(--text-color);
        border-bottom: 1px solid var(--bg-color);
    }

    .selected-log-line {
        background-color: var(--accent-color);
        color: var(--bg-color);
        padding: 2px;
        border: 1px solid black;
        border-radius: 10px;
    }
</style>