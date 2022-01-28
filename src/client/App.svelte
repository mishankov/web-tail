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
            location: "/settings/",
            component: Settings
        }
    ]
</script>

<SimpleRouter routes={routes}/>
