<script lang="ts">
    import Header from "./components/Header.svelte";
    import LogLines from "./components/LogLines.svelte";
    import { logs } from "./stores/logs";
    import { logWindow } from "./stores/settings";
    import fetchSources from "./stores/sources";
    import { CircularBuffer } from "./types/CircularBuffer";

    const { sources, loadingSources } = fetchSources();

    let searchString = "";
    let source = "";
    let socket: WebSocket;

    $: {
        if (socket !== undefined) {
            socket.close();
        }

        if (source !== "") {
            logs.update(buff => {return new CircularBuffer<string>(parseInt($logWindow))});
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

<Header bind:source={source} bind:searchString={searchString}/>

<main>
    <LogLines searchString={searchString}/>    
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
	
</style>
