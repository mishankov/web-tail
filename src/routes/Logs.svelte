<script lang="ts">
  import Header from "../components/Header.svelte";
  import LogLines from "../components/LogLines.svelte";
  import { logs } from "../stores/logs";
  import { logWindow } from "../stores/settings";
  import { CircularBuffer } from "../types/CircularBuffer";

  let searchString = "";
  let source = "";
  let socket: WebSocket;

  $: {
    if (socket !== undefined) {
      socket.close();
    }

    if (source !== "") {
      logs.update((buff) => {
        return new CircularBuffer<string>($logWindow);
      });
      socket = new WebSocket(`ws://${location.host}/${source}/${$logWindow}`);

      socket.addEventListener("open", function (event) {
        console.log("Socket opened", source);
      });

      socket.addEventListener("message", function (event) {
        if (event.data.length > 0) {
          logs.update((buff) => {
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
    logs.update((buff) => {
      buff.setLength($logWindow);
      return buff;
    });
  }
</script>

<svelte:head>
  <title>Web tail | {source}</title>
</svelte:head>

<Header bind:source bind:searchString />

<main>
  <LogLines {searchString} />
</main>
