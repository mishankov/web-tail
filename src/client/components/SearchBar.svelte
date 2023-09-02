<script lang="ts">
    import { smoothScroll } from "../utils";
    import { selectedSearchResult } from "../stores/search";

    export let searchString: string;

    function goToSearchResult(direction: "next" | "previous") {
        while (true) {
            let newSelectedSearchResult = 0;
            if (direction === "next") newSelectedSearchResult = selectedSearchResult.next();
            if (direction === "previous") newSelectedSearchResult = selectedSearchResult.previous();
            const elements = document.querySelectorAll(`#search-result-${newSelectedSearchResult}`);
            if (elements.length === 0) continue;
            
            const allSearchResults = document.querySelectorAll(".selected-log-line");
            allSearchResults.forEach((element) => element.classList.remove("selected-search-result"));
            
            elements.forEach((element) => element.classList.add("selected-search-result"));
            
            smoothScroll(elements[0]);

            break;
        }
        
    }
</script>

<input type="text" placeholder="Search" class:has-value="{searchString.length > 0}" bind:value={searchString}/>
<button on:click={() => goToSearchResult("previous")} title="Previous search result">&lt;</button>
<button on:click={() => goToSearchResult("next")} title="Next search result">&gt;</button>

<style>
    input {
        width: 100%;
        color: var(--color-light-100);
        background-color: var(--color-dark-100);
        border: 0;
        border-radius: 100vh;
        font-size: 1.25rem;
        height: 2rem;
        padding: 0;
        padding-left: .5rem;
        padding-right: .5rem;
        transition: background-color .1s;
    }

    input:hover {
        background-color: var(--color-dark-80);
    }

    input:focus {
        background-color: var(--color-dark-60);
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
        background-color: var(--color-dark-100); 
        border: 0;
        border-radius: 100vh;
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
</style>