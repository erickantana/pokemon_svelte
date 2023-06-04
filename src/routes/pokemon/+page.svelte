<script lang="ts">
	import { goto } from "$app/navigation";
    import PokemonItem from "./components/PokemonItem.svelte";
    import { pokemons } from "./store";

    async function loadPokemon(): Promise<void> {
        await pokemons.load();
    }
</script>

{#await loadPokemon()}
<div>Loading ...</div>
{:then}
{#each $pokemons as pokemon}
    <PokemonItem pokemon={pokemon} on:click={() => goto(`/pokemon/${pokemon.name}`)}></PokemonItem>
{/each}
{/await}