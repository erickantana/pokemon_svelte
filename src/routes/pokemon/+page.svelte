<script lang="ts">
    import { pokemons } from "./store";

    async function loadPokemon(): Promise<void> {
        await pokemons.load();
    }
</script>

{#await loadPokemon}
<div>Loading ...</div>
{:then} 
{$pokemons}
{/await}