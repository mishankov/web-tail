<script lang="ts">
    import Header from "../components/Header.svelte";
    import LogLines from "../components/LogLines.svelte";
    import { logs } from "../stores/logs";
    import { logWindow } from "../stores/settings";
    import { CircularBuffer } from "../types/CircularBuffer";

    let searchString = $state("");
    let source = $state("");

    function getWebSocketProtocol(): string {
        return location.protocol === "https:" ? "wss:" : "ws:";
    }

    $effect(() => {
        const currentSource = source;
        const windowSize = $logWindow;

        logs.set(new CircularBuffer<string>(windowSize));

        if (currentSource === "") {
            return;
        }

        const wsProtocol = getWebSocketProtocol();
        const socket = new WebSocket(
            `${wsProtocol}//${location.host}/logstream/${currentSource}/${windowSize}`,
        );

        socket.addEventListener("open", () => {
            console.log("Socket opened", currentSource);
        });

        socket.addEventListener("message", (event) => {
            if (typeof event.data === "string" && event.data.length > 0) {
                logs.update((buffer) => {
                    for (const line of event.data.split("\n")) {
                        if (line.length > 0) {
                            buffer.push(line);
                        }
                    }
                    return buffer;
                });
            }
        });

        return () => {
            socket.close();
        };
    });

    $effect(() => {
        const windowSize = $logWindow;
        logs.update((buffer) => {
            buffer.setLength(windowSize);
            return buffer;
        });
    });
</script>

<svelte:head>
    <title>Web tail | {source}</title>
</svelte:head>

<Header bind:source bind:searchString />

<main>
    <LogLines {searchString} {source} />
</main>
