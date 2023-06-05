<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pokemon } from '../../../core/entities/pokemon';
	import container from '../../../core/container/index';
	import TYPES from '../../../core/container/types';
	import type { IPokemonRepository } from '../data/interface/pokemon_repository';

    export let data;

    let pokemon: Pokemon | null;

    onMount(async () => {
        const repository = container.get<IPokemonRepository>(TYPES.PokemonRepository);
        pokemon = await repository.findById(data.name);
    })
</script>

{#if pokemon}
    <div>{pokemon.name}</div>
    <img src={pokemon.image} alt={pokemon.name} />
{/if}