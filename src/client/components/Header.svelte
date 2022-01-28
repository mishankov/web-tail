<script lang="ts">
    import fetchSources from "../stores/sources";
    import { filterLogs, reverseLogs, logWindow } from "../stores/settings";

    const { sources, loadingSources } = fetchSources();

    export let source: string;
    export let searchString: string;
</script>

<header>
    <nav class="top-panel">
        <select class="top-panel-input source-select" bind:value={source}>
            <option value="" selected>Select source</option>
            {#each $sources as source(source)}
                <option value="{source}">{source}</option>
            {/each}
        </select>
        <input type="text" placeholder="Search" class="top-panel-input search-input" bind:value={searchString}/>
        <label class="top-panel-checkbox"> <input type="checkbox" bind:checked={$filterLogs}/> Filter </label> 
        <label class="top-panel-checkbox"> <input type="checkbox" bind:checked={$reverseLogs}/> Reverse </label> 
        <input type="number" placeholder="Max lines" class="top-panel-input max-lines-input" bind:value={$logWindow}/>
    </nav>
</header>

<style>
    label {
        display: flex;
        align-items: center;
    }

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

    .top-panel-input {
        font-size: 1.25rem;
        height: 2rem;
        border: 0;
        background-color: var(--color-dark-100);
        color: var(--color-light-100);
        box-sizing: content-box;
    }

    .top-panel-input:hover {
        background-color: var(--color-dark-80);
    }

    .top-panel-input:focus {
        background-color: var(--color-dark-80);
        outline: none;
    }

    .top-panel-checkbox {
        font-size: 1.25rem;
        height: 2rem;
        color: var(--color-light-100);
        padding-right: .5em;
        box-sizing: content-box;
    }

    .top-panel-checkbox > input {
        margin-right: .5em;
        box-sizing: content-box;
    }

    .top-panel-checkbox:hover {
        background-color: var(--color-dark-80);
    }

    .search-input {
        width: 100%;
    }

    .max-lines-input {
        width: 7ch;
    }
</style>
