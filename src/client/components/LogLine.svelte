<script lang="ts">
    import { regexFilter } from "../stores/settings";

    export let line: string;
    export let selectLine: string;

    let selectRegex: RegExp;

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    
    $: {
        if ($regexFilter) {
            try {
                selectRegex = new RegExp(selectLine, "g");
            } catch {
                selectRegex = new RegExp(escapeRegExp(selectLine), "g");
            }
        }
    }
    
    
</script>

<div class="line">
    {#if selectLine.length > 0}
        {#if $regexFilter}
            <span>{@html line.replaceAll(selectRegex, '<span class="selected-log-line">$&</span>')}</span>
        {:else}
            <span>{@html line.replaceAll(selectLine, '<span class="selected-log-line">$&</span>')}</span>
        {/if}
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

    :global(.selected-log-line) {
        background-color: var(--color-accent-100);
        color: var(--color-dark-100);
        padding: 2px;
        border: 1px solid var(--color-dark-100);
        border-radius: 10px;
    }
</style>
