<script lang="ts">
    import { escapeRegExp } from "../utils";
    import { regexFilter, caseSensitive } from "../stores/settings";

    export let line: string;
    export let selectLine: string;

    let selectRegex: RegExp;
    
    $: {
        let regexFlags = "gi";

        if ($caseSensitive) regexFlags = "g";

        if ($regexFilter) {
            try {
                selectRegex = new RegExp(selectLine, regexFlags);
            } catch {
                selectRegex = new RegExp(escapeRegExp(selectLine), regexFlags);
            }
        } else {
            selectRegex = new RegExp(escapeRegExp(selectLine), regexFlags);
        }
    }
    
    
</script>

<div class="line">
    {#if selectLine.length > 0}
        <span>{@html line.replaceAll(selectRegex, '<span class="selected-log-line">$&</span>')}</span>
    {:else}
        <span>{line}</span>
    {/if}
</div>


<style>
    .line {
        font-family: monospace;
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
