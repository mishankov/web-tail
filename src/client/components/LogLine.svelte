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
        color: var(--color-light-100);
        border-bottom: 1px solid var(--color-dark-100);
    }

    .selected-log-line {
        background-color: var(--color-accent-100);
        color: var(--color-dark-100);
        padding: 2px;
        border: 1px solid var(--color-dark-100);
        border-radius: 10px;
    }
</style>
