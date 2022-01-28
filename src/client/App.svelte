<script lang="ts">
    import LogLine from "./components/LogLine.svelte";
    import { logs } from "./stores/logs";
    import { logWindow } from "./stores/settings";

    let searchString = "";
    let source = "myfile";
    let socket: WebSocket;
    let filterLogs = false;
    let reverseLogs = false;
    let filteredLogs: Array<string>;

    $: {
        if (socket !== undefined) {
            socket.close();
        }

        if (source !== "") {
            socket = new WebSocket(`ws://localhost:8081/${source}`);

            socket.addEventListener("open", function (event) {
                console.log('Socket opened', source);
            });

            socket.addEventListener("message", function (event) {
                if (event.data.length > 0) {
                    logs.update(buff =>  {
                        buff.push(event.data);
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

<main>

    <nav class="top-panel">
        <select class="top-panel-input source-select" bind:value={source}>
            <option value="">Select source</option>
            <option value="myfile" selected>myfile</option>
            <option value="af6">af6</option>
            <option value="af6st">af6st</option>
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
        --bg-color: rgb(45,42,46);
        --bg-selected-color: rgb(64,62,65);
        --text-color: rgb(250, 250, 248);
        --accent-color: yellow;
    }

    label {
        display: flex;
        align-items: center;
    }

    .top-panel {
        position: fixed;
        top: 0;
        left: 0;
        min-width: 100vw;
        height: 2rem;
        display: flex;
        align-items: center;
        padding-right: 1em;
        gap: 0.5em;
        border: 0.3em solid var(--bg-color);
        background-color: var(--bg-color);
    }

    .top-panel-input {
        font-size: 1.25rem;
        height: 2rem;
        border: 0;
        background-color: var(--bg-color);
        color: var(--text-color);
        box-sizing: content-box;
    }

    .top-panel-input:hover {
        background-color: var(--bg-selected-color);
    }

    .top-panel-input:focus {
        background-color: var(--bg-selected-color);
        outline: none;
    }

    .top-panel-checkbox {
        font-size: 1.25rem;
        height: 2rem;
        color: var(--text-color);
        padding-right: .5em;
        box-sizing: content-box;
    }

    .top-panel-checkbox > input {
        margin-right: .5em;
        box-sizing: content-box;
    }

    .top-panel-checkbox:hover {
        background-color: var(--bg-selected-color);
    }

    .search-input {
        width: 100%;
    }

    .max-lines-input {
        width: 7ch;
    }

    .logs {
        min-height: 100vh;
        padding-top: 2.6rem;
        background-color: var(--bg-selected-color);
    }
	
</style>