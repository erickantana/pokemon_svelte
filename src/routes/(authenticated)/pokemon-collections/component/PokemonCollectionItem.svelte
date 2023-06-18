<script lang="ts">
	import { onMount } from 'svelte';
	import container from '../../../../core/container';
	import TYPES from '../../../../core/container/types';
	import type { IPokemonRepository } from '../../pokemon/data/interface/pokemon_repository';
	import type { Pokemon } from '../../../../core/entities/pokemon';
	import type { PokemonCollection } from '../../../../core/entities/pokemon_collection';

	export let pokemonCollection: PokemonCollection;

	const pokemonRepository = container.get<IPokemonRepository>(TYPES.PokemonRepository);

	export let pokemon: Pokemon | null = null;

	export let sprites: string[] = [];

	$: {
		if (pokemon != null && pokemon.sprites != null) {
			if (typeof pokemon.sprites.front_default == 'string')
				sprites.push(pokemon.sprites.front_default);
			if (typeof pokemon.sprites.back_default == 'string')
				sprites.push(pokemon.sprites.back_default);
			if (typeof pokemon.sprites.front_female == 'string')
				sprites.push(pokemon.sprites.front_female);
			if (typeof pokemon.sprites.back_female == 'string') sprites.push(pokemon.sprites.back_female);
			if (typeof pokemon.sprites.front_shiny == 'string') sprites.push(pokemon.sprites.front_shiny);
			if (typeof pokemon.sprites.back_shiny == 'string') sprites.push(pokemon.sprites.back_shiny);
			if (typeof pokemon.sprites.front_shiny_female == 'string')
				sprites.push(pokemon.sprites.front_shiny_female);
			if (typeof pokemon.sprites.back_shiny_female == 'string')
				sprites.push(pokemon.sprites.back_shiny_female);
		}
	}

	$: pokemonName = `${pokemon?.name?.charAt(0)?.toUpperCase()}${pokemon?.name?.substring(1)}`;

	onMount(async () => {
		const stages = pokemonCollection.evolutionStages;
		if (stages.length > 0) {
			const currentStage = stages[stages.length - 1];
			pokemon = await pokemonRepository.findById(currentStage.name);
		}
	});
</script>

<div class="bg-gray-800 p-4 inline-block rounded-md text-white">
	{#if pokemon != null}
		<div class="text-lg font-bold">{pokemonName}</div>
		<div class="flex justify-center">
			<img src={sprites[0]} alt={sprites[0]} />
		</div>
		<div class="text-lg font-bold text-right">Lv. {pokemonCollection.level}</div>
		<!-- {#each sprites as sprite}
			<img src={sprite} alt="Pokemon Sprite" />
		{/each} -->
	{/if}
</div>
