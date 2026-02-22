<script lang="ts">
    import Header from "../components/Header.svelte";
    import LogLines from "../components/LogLines.svelte";
    import { appendLogChunk, resetLogs, resizeLogWindow } from "../state/logs.svelte";
    import { settingsState } from "../state/settings.svelte";

    let searchString = $state("");
    let source = $state("");

    function getWebSocketProtocol(): string {
        return location.protocol === "https:" ? "wss:" : "ws:";
    }

    $effect(() => {
        const currentSource = source;
        const windowSize = settingsState.logWindow;

        resetLogs(windowSize);

        if (currentSource === "") {
            return;
        }

        const wsProtocol = getWebSocketProtocol();
        const encodedSource = encodeURIComponent(currentSource);
        const socket = new WebSocket(
            `${wsProtocol}//${location.host}/logstream/${encodedSource}/${windowSize}`,
        );

        socket.addEventListener("open", () => {
            console.log("Socket opened", currentSource);
        });

        socket.addEventListener("message", (event) => {
            if (typeof event.data === "string" && event.data.length > 0) {
                appendLogChunk(event.data);
            }
        });

        return () => {
            socket.close();
        };
    });

    $effect(() => {
        resizeLogWindow(settingsState.logWindow);
    });
</script>

<svelte:head>
    <title>Web tail | {source}</title>
</svelte:head>

<Header bind:source bind:searchString />

<main>
    <LogLines {searchString} {source} />
</main>
