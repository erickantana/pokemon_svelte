<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pokemon } from '../../../../core/entities/pokemon';
	import container from '../../../../core/container/index';
	import TYPES from '../../../../core/container/types';
	import type { IPokemonRepository } from '../data/interface/pokemon_repository';
	import type { EvolutionMap } from '../../../../core/entities/evolution_map';
	import type { EvolutionChain } from '../../../../core/entities/evolution_chain';
	import { PokeBallType } from '../../../../core/enums/poke_ball_type';
	import { auth } from '../../../../firebase';
	import type { UseCase } from '../../../../core/domain/use_case';
	import type { CatchPokemonParam } from '../../../../core/domain/catch_pokemon_use_case';
	import PokeballButton from '../components/PokeballButton.svelte';

	export let data;

	const repository = container.get<IPokemonRepository>(TYPES.PokemonRepository);

	const useCase = container.get<UseCase<CatchPokemonParam, void>>(TYPES.CatchPokemonUseCase);

	let pokemon: Pokemon | null;

	$: types = pokemon?.types;

	let evolutionMaps: EvolutionMap[] = [];

	function evolutionChainToEvolutionMaps(
		evolutionMaps: EvolutionMap[],
		evolutionChain: EvolutionChain
	): void {
		evolutionChain.evolveTo?.forEach((evolveTo) => {
			evolutionMaps.push({
				fromSpeciesName: evolutionChain.speciesName,
				fromSpeciesUrl: evolutionChain.speciesUrl,
				toSpeciesName: evolveTo.speciesName,
				toSpeciesUrl: evolveTo.speciesUrl
			});
			evolutionChainToEvolutionMaps(evolutionMaps, evolveTo);
		});
	}

	async function catchPokemon(ball: PokeBallType) {
		try {
			const uid = auth.currentUser?.uid;

			if (uid == undefined || pokemon == null) {
				throw new Error(
					'Invalid State. Either user does not have valid uid or pokemon that is not valid'
				);
			}

			await useCase.call({ pokemon, ball, uid });
		} catch (err) {
			console.log(err);
		}
	}

	onMount(async () => {
		pokemon = await repository.findById(data.name);
		const evolutionChain = pokemon?.evolutionChain;
		if (evolutionChain) {
			const evolutions: EvolutionMap[] = [];
			evolutionChainToEvolutionMaps(evolutions, evolutionChain);
			evolutionMaps = evolutions;
		}
	});
</script>

{#if pokemon}
	<div>{pokemon.name} {pokemon.id}</div>
	<img src={pokemon.sprites?.front_default} alt={pokemon.name} />
	{#each evolutionMaps as evolutionMap}
		<div>{evolutionMap.fromSpeciesUrl} -&gt; {evolutionMap.toSpeciesUrl}</div>
	{/each}
	{#if types}
		{#each types as type}
			<div>{type?.type?.name}</div>
		{/each}
	{/if}
	<div>{pokemon.height}</div>
	<div>{pokemon.weight}</div>
	<PokeballButton on:click={() => catchPokemon(PokeBallType.PokeBall)} label="Use PokeBall" />
	<PokeballButton on:click={() => catchPokemon(PokeBallType.GreatBall)} label="Use GreatBall" />
	<PokeballButton on:click={() => catchPokemon(PokeBallType.UltraBall)} label="Use UltraBall" />
	<PokeballButton on:click={() => catchPokemon(PokeBallType.MasterBall)} label="Use MasterBall" />
{/if}
