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
    <div class="grid md:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-12">
        {#each $pokemons as pokemon}
            <div>
                <PokemonItem pokemon={pokemon} on:click={() => goto(`/pokemon/${pokemon.name}`)}></PokemonItem>
            </div>
        {/each}
    </div>
{/await}