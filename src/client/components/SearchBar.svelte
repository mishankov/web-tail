<script lang="ts">
    import { smoothScroll } from "../utils";
    import { selectedSearchResult } from "../stores/search";
    import { reverseLogs } from "../stores/settings";

    export let searchString: string;
    
    function goToSearchResult(direction: "next" | "previous") {
        if (searchString === "") {
            return
        }

        while (true) {
            let newSelectedSearchResult = 0;
            if (direction === "next" && $reverseLogs || direction === "previous" && !$reverseLogs) newSelectedSearchResult = selectedSearchResult.previous();
            if (direction === "previous" && $reverseLogs || direction === "next" && !$reverseLogs) newSelectedSearchResult = selectedSearchResult.next();
            
            const elements = document.querySelectorAll(`#search-result-${newSelectedSearchResult}`);
            if (elements.length === 0) continue;
            smoothScroll(elements[0]);

            break;
        }
    }
</script>
<div>
    <input type="text" placeholder="Search" class:has-value="{searchString.length > 0}" bind:value={searchString}/>
    <button class="button-left" on:click={() => goToSearchResult("previous")} title="Previous line with search result">&lt;</button>
    <button class="button-right" on:click={() => goToSearchResult("next")} title="Next line with search result">&gt;</button>
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

    input {
        width: 100%;
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

    input:focus {
        outline: none;
    }

    input:focus::placeholder {
        color: transparent;
    }

    .has-value {
        background-color: var(--color-dark-80);
    }

    button {
        color: var(--color-light-100);
        background-color: transparent; 
        border: 0;
        /* border-radius: 100vh; */
        font-size: 1.25rem;
        height: 2rem;
        padding: 0;
        padding-left: .5rem;
        padding-right: .5rem;
        transition: background-color .1s;
    }

    button:hover {
        background-color: var(--color-dark-80);
    }

    button:active {
        background-color: var(--color-dark-60);
        outline: none;
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