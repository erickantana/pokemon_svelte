<script lang="ts">
	import { onMount } from 'svelte';
	import { PokemonRepository } from '../data/impl/pokemon_repository.js';
	import type { Pokemon } from '../../../core/entities/pokemon.js';

    export let data;

    let pokemon: Pokemon | null;

    onMount(async () => {
        const repository = new PokemonRepository();
        pokemon = await repository.findById(data.name);
    })
</script>

{#if pokemon}
    <div>{pokemon.name}</div>
    <img src={pokemon.image} alt={pokemon.name} />
{/if}