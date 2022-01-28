<script lang="ts">
    import type { SvelteComponentDev } from "svelte/internal";

    interface Router {
        location: string
        component: typeof SvelteComponentDev
    }

    export let routes: Router[];
</script>

<svelte:component this={routes.find(route => route.location === location.pathname).component}/>
