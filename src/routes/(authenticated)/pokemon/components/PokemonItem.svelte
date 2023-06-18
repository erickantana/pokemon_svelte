<script lang="ts">
	import type { Pokemon } from '../../../../core/entities/pokemon';
	import type { IPokemonRepository } from '../data/interface/pokemon_repository';
	import type { Type } from '../../../../core/entities/type';
	import { onMount } from 'svelte';
	import container from '../../../../core/container';
	import TYPES from '../../../../core/container/types';

	export let pokemon: Pokemon | undefined;

	let types: (Type | null)[] | null | undefined;

	onMount(async () => {
		if (!pokemon?.name) return;

		const repository: IPokemonRepository = container.get<IPokemonRepository>(
			TYPES.PokemonRepository
		);
		types = (await repository.findById(pokemon.name))?.types;
	});
</script>

<div on:click class="pokemon-item" on:keypress>
	{#if pokemon}
		<div>{pokemon.name} {pokemon.id}</div>
		<img src={pokemon.image} alt={pokemon.name} />
		<div>
			{#each types ?? [] as type}
				{#if type}
					{type.type?.name}
				{/if}
			{/each}
		</div>
	{:else}
		<div>Unknown Pokemon</div>
	{/if}
</div>

<style>
	.pokemon-item {
		background-color: theme('colors.primary.800');
		border: none;
		color: white;
		padding: 8px;
		border-radius: 4px;
		margin: 2px;
	}
</style>
