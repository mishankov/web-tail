<script lang="ts">
    import Logs from "./pages/Logs.svelte";
    import Settings from "./pages/Settings.svelte";
    import SimpleRouter from "./components/SimpleRouter.svelte";

    const routes = [
        {
            location: "/",
            component: Logs
        },
        {
            location: "/settings",
            component: Settings
        }
    ]
</script>

<SimpleRouter routes={routes}/>

<style>
    :global(:root) {
        --color-dark-100: hsl(196, 13%, 17%);
        --color-dark-80: hsl(193, 13%, 22%);

        --color-light-100: hsl(195, 10%, 84%);
        --color-light-80: hsl(195, 10%, 74%);
        
        --color-accent-100: hsl(55, 100%, 68%);
    }

    :global(body) {
        background-color: var(--color-dark-80);
        color: var(--color-light-100);
    }
</style>
