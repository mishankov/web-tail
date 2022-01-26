<script lang="ts">
    import LogLine from "./components/LogLine.svelte";
    import { logs } from "./stores/logs";
    import { logWindow } from "./stores/settings";

    let searchString = "";
    let source = "";
    let socket: WebSocket;

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
    <input type="text" bind:value={searchString}/>
    <input type="number" bind:value={$logWindow}/>

    <select bind:value={source}>
        <option value="" selected>Select source</option>
        <option value="myfile">myfile</option>
        <option value="af6">af6</option>
      </select>

    {#each $logs.toArray() as logLine(logLine)}
        <LogLine line={logLine} selectLine={searchString}/>
    {/each}
        
</main>

<style>
	
</style>