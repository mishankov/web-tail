<script lang="ts">
    export let label: string;
    export let value: boolean;


    function toggle() {
        value = !value
    }
</script>

<div class:selected="{value}" on:click={toggle}>{label}</div>

<style>
    div {
        color: var(--color-light-100);
        background-color: var(--color-dark-100);
        border: 0;
        border-radius: 100vh;
        font-size: 1.25rem;
        height: 2rem;
        padding-left: .6rem;
        padding-right: .5rem;
        display: flex;
        align-items: center;
        user-select: none;

        transition: background-color .1s;
    }

    div:hover {
        background-color: var(--color-dark-80);
    }

    div:active {
        background-color: var(--color-dark-60);
    }

    .selected {
        background-color: var(--color-dark-80);
    }
</style>
