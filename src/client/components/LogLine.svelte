<script lang="ts">
    export let line: string;
    export let selectLine: string;

    let splittedLine: Array<string>;
    $: {
        if (selectLine.length > 0) {
            try {
                splittedLine = line.split(new RegExp(selectLine, 'g'));
            } catch {
                splittedLine = [line];
            }
        } else {
            splittedLine = [line];
        }
    }
    
</script>

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
