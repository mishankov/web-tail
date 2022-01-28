<script lang="ts">
    import LogLine from "./components/LogLine.svelte";
    import { logs } from "./stores/logs";
    import { logWindow } from "./stores/settings";
    import fetchSources from "./stores/sources";

    const { sources, loadingSources } = fetchSources();

    let searchString = "";
    let source = "";
    let socket: WebSocket;
    let filterLogs = false;
    let reverseLogs = false;
    let filteredLogs: Array<string>;

    $: {
        if (socket !== undefined) {
            socket.close();
        }

        if (source !== "") {
            socket = new WebSocket(`ws://${location.host}/${source}/${$logWindow}`);

            socket.addEventListener("open", function (event) {
                console.log('Socket opened', source);
            });

            socket.addEventListener("message", function (event) {
                if (event.data.length > 0) {
                    logs.update(buff =>  {
                        for (let line of event.data.split("\n")) {
                            if (line.length > 0) buff.push(line);   
                        }
                        return buff;                   
                    });
                }
            });
        }
    // }

    // $: {
        logs.update(buff => {
            buff.setLength(parseInt($logWindow));
            return buff;
        })
    }
</script>

<svelte:head>
    <title>Web tail | {source}</title>
</svelte:head>

<main>

    <nav class="top-panel">
        <select class="top-panel-input source-select" bind:value={source}>
            <option value="" selected>Select source</option>
            {#each $sources as source(source)}
                <option value="{source}">{source}</option>
            {/each}
        </select>

        <input type="text" placeholder="Search" class="top-panel-input search-input" bind:value={searchString}/>
        <label class="top-panel-checkbox"> <input type="checkbox" bind:value={filterLogs}/> Filter </label> 
        <label class="top-panel-checkbox"> <input type="checkbox" bind:value={reverseLogs}/> Reverse </label> 
        <input type="number" placeholder="Max lines" class="top-panel-input max-lines-input" bind:value={$logWindow}/>
        
        
    </nav>
    
    <div class="logs">
        {#each [...$logs.toArray()].reverse() as logLine(logLine)}
            <LogLine line={logLine} selectLine={searchString}/>
        {/each}
    </div>
    
        
</main>

<style>

    :global(:root) {
        --color-dark-100: rgb(45,42,46);
        --color-dark-80: rgb(64,62,65);

        --color-light-100: rgb(250, 250, 248);
        
        --color-accent-100: yellow;
    }

    :global(body) {
        background-color: var(--color-dark-80);
    }

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

    .logs {
        position: fixed;
        left: 0;
        top: 2.8rem;
        min-height: calc(100vh - 2.8rem);
        width: 100%;
        max-height: calc(100vh - 2.8rem);
        background-color: var(--color-dark-80);
        overflow: auto;
    }
	
</style>
