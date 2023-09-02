import { writable, get } from "svelte/store";

function createLastSearchResultStore() {
    const store = writable(-1);
    const { subscribe, set, update } = store;

    return {
        subscribe,
        reset: () => set(-1),
        next: () => {
            let newValue = 0
            update((n) => {
                newValue = n + 1
                return newValue
            })
            return newValue
        }
    }
}

export const lastSearchResult = createLastSearchResultStore();

function createSelectedSearchResultStore() {
    const store = writable(-1);
    const { subscribe, set, update } = store;

    return {
        subscribe,
        reset: () => set(-1),
        next: () => {
            let newValue = 0
            update((n) => {
                newValue = n + 1
                if (newValue > get(lastSearchResult)) newValue = 0
                return newValue
            })
            return newValue
        },
        previous: () => {
            let newValue = 0
            update((n) => {
                newValue = n - 1
                if (newValue < 0) newValue = get(lastSearchResult)
                return newValue
            })
            return newValue
        }
        
    }
}

export const selectedSearchResult = createSelectedSearchResultStore()
