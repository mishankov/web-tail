<script lang="ts">
    import { smoothScroll } from "../utils";
    import { filteredLogs } from "../stores/logs";
    import { currentSearchLineId } from "../stores/search";

    export let searchString: string;

    $: if (searchString) currentSearchLineId.set("");
    
    function goToSearchResult(direction: "next" | "previous") {
        if (searchString === "") {
            return
        }

        if (direction === "next") {
            if ($currentSearchLineId === ""){ 
                currentSearchLineId.set($filteredLogs[0].id)
            } else {
                $filteredLogs.find((value, index, array) => {
                    if (value.id === $currentSearchLineId) {
                        currentSearchLineId.set(array[(index + 1) % array.length].id)
                        return true
                    }
                    return false
                });
            }
        }

        if (direction === "previous") {
            if ($currentSearchLineId === ""){ 
                currentSearchLineId.set($filteredLogs[$filteredLogs.length - 1].id)
            } else {
                $filteredLogs.find((value, index, array) => {
                    if (value.id === $currentSearchLineId) {
                        let previousId = index - 1;
                        if (previousId < 0) previousId = array.length - 1
                        currentSearchLineId.set(array[previousId].id)
                        return true
                    }
                    return false
                });
            }
        }
        
        const elements = document.querySelectorAll(`line-id-${$currentSearchLineId}`);
        if (elements.length === 0) return;
        smoothScroll(elements[0]);
    }
</script>
<div class:has-value="{searchString.length > 0}">
    <input type="text" placeholder="Search" bind:value={searchString}/>
    <button class="button-left" disabled={searchString.length === 0} on:click={() => goToSearchResult("previous")} title="Previous line with search result">&lt;</button>
    <button class="button-right" disabled={searchString.length === 0} on:click={() => goToSearchResult("next")} title="Next line with search result">&gt;</button>
</div>

<style>
    div {
        width: 100%;
        display: flex;
        align-items: center;
        border-radius: 100vh;
    }

    div:hover {
        background-color: var(--color-dark-80);
    }

    div:focus {
        background-color: var(--color-dark-60);
        outline: none;
    }

    div.has-value {
        background-color: var(--color-dark-80);
    }

    input {
        width: 100%;
        color: var(--color-light-100);
        background-color: transparent;
        border: 0;
        border-top-left-radius: 100vh;
        border-bottom-left-radius: 100vh;
        font-size: 1.25rem;
        height: 2rem;
        padding: 0;
        padding-left: .5rem;
        padding-right: .5rem;
        transition: background-color .1s;
    }

    input:focus {
        outline: none;
    }

    input:focus::placeholder {
        color: transparent;
    }

    button {
        color: var(--color-light-100);
        background-color: transparent; 
        border: 0;
        font-size: 1.25rem;
        height: 2rem;
        padding: 0;
        padding-left: .5rem;
        padding-right: .5rem;
        transition: background-color .1s;
    }

    button:enabled:active {
        background-color: var(--color-dark-60);
        outline: none;
    }

    button:disabled {
        color: var(--color-dark-60);
    }

    .button-left {
        border-top-left-radius: 100vh;
        border-bottom-left-radius: 100vh;
    }

    .button-right {
        border-top-right-radius: 100vh;
        border-bottom-right-radius: 100vh;
    }
</style>