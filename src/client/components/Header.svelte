<script lang="ts">
    import fetchSources from "../stores/sources";
    import { filterLogs, reverseLogs, regexFilter, logWindow } from "../stores/settings";
import Toggle from "./Toggle.svelte";

    const { sources, loadingSources } = fetchSources();

    export let source: string;
    export let searchString: string;
</script>

<header>
    <nav class="top-panel">
        <select class="source-select" bind:value={source}>
            <option value="" selected>Select source</option>
            {#each $sources as source(source)}
                <option value="{source}">{source}</option>
            {/each}
        </select>
        <input type="text" placeholder="Search" class="top-panel-input search-input" bind:value={searchString}/>
        <Toggle label="Filter" bind:value={$filterLogs}/>
        <Toggle label="Regex" bind:value={$regexFilter}/>
        <Toggle label="Reverse" bind:value={$reverseLogs}/>
        <input type="number" placeholder="Max lines" class="top-panel-input max-lines-input" bind:value={$logWindow}/>
    </nav>
</header>

<style>

    .top-panel {
        position: fixed;
        top: 0;
        left: 0;
        min-width: calc(100vw - .8rem);
        height: 2rem;
        display: flex;
        align-items: center;
        gap: 0.5em;
        border: 0.4rem solid var(--color-dark-100);
        background-color: var(--color-dark-100);
    }

    .top-panel > * {
        color: var(--color-light-100);
        background-color: var(--color-dark-100);
        border: 0;
        border-radius: 100vh;
        font-size: 1.25rem;
        height: 2rem;
        padding-left: .5rem;
        padding-right: .5rem;
        transition: background-color .1s;
        /* box-sizing: content-box; */
    }

    .top-panel > *:hover {
        background-color: var(--color-dark-80);
    }

    .top-panel-input:focus {
        background-color: var(--color-dark-80);
        outline: none;
    }

    .top-panel-input:focus::placeholder {
        color: transparent;
    }
    
    .source-select {
        outline: none;
    }

    .search-input {
        width: 100%;
    }

    .max-lines-input {
        width: 7ch;
    }
</style>
