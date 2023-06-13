<script lang="ts">
	import { onMount } from 'svelte';
	import type { Pokemon } from '../../../core/entities/pokemon';
	import container from '../../../core/container/index';
	import TYPES from '../../../core/container/types';
	import type { IPokemonRepository } from '../data/interface/pokemon_repository';
	import type { EvolutionMap } from '../../../core/entities/evolution_map';
	import type { EvolutionChain } from '../../../core/entities/evolution_chain';
	import { PokeBallType } from '../../../core/enums/poke_ball_type';
	import type { IPokeService } from '../../../core/services/poke_service';
	import type { IUserRepository } from '../../../core/repositories/user_repository';
	import { auth } from '../../../firebase';
	import type { IPokemonCollectionRepository } from '../../../core/repositories/pokemon_collection_repository';
	import { NumberModifier } from '../../../core/data_source/number_modifier';
	import _ from 'lodash';

	export let data;

	const pokeService = container.get<IPokeService>(TYPES.PokeService);
	const repository = container.get<IPokemonRepository>(TYPES.PokemonRepository);

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
		const basicName = pokemon?.evolutionChain?.speciesName;

		if (pokemon == null) return;
		if (basicName == null || basicName == undefined) return;

		const authUser = auth.currentUser;
		if (authUser == null) return;

		const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
		const user = await userRepository.find(authUser.uid);
		if (user == undefined) return;

		const pokeballCount = user.pokeballs[ball];
		if (pokeballCount == undefined || pokeballCount < 1) return;

		const result = pokeService.catchPokemon(ball);
		// TODO: decrement pokeball count
		if (result) {
			const pokemonCollectionRepository = container.get<IPokemonCollectionRepository>(
				TYPES.PokemonCollectionRepository
			);
			const pokemonCollection = await pokemonCollectionRepository.find(authUser.uid, basicName);

			if (pokemonCollection == undefined) {
				await pokemonCollectionRepository.insert(authUser.uid, basicName, {
					obtainedAt: new Date(),
					name: basicName,
					level: pokeService.instantLevelUpBonus(1),
					evolutionStages: [{ name: basicName, levelThreshold: 0 }]
				});
			} else {
				const evolutionStages = pokemonCollection.evolutionStages;
				const lastStage = evolutionStages[evolutionStages.length - 1];
				const currentLevel = pokemonCollection.level;

				if (currentLevel + 1 > 100) return;

				if (currentLevel + 1 == lastStage.levelThreshold + 20) {
					const evolutionMaps: EvolutionMap[] = [];
					const evolutionChain = pokemon.evolutionChain;
					if (evolutionChain) {
						evolutionChainToEvolutionMaps(evolutionMaps, evolutionChain);
					}
					const evolutionBranch = evolutionMaps.filter(
						(evolutionMap) => evolutionMap.fromSpeciesName == lastStage.name
					);
					if (evolutionBranch.length > 0) {
						const randomEvolutionBranch = Math.round(Math.random() * 10) % evolutionBranch.length;
						const targetSpeciesName = evolutionBranch[randomEvolutionBranch].toSpeciesName;
						if (targetSpeciesName) {
							evolutionStages.push({
								levelThreshold: currentLevel + 1,
								name: targetSpeciesName
							});
						}
					}
				}

				await pokemonCollectionRepository.update(authUser.uid, basicName, {
					level: { value: 1, modifier: NumberModifier.increment },
					evolutionStages: evolutionStages
				});
			}
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
	<button on:click={() => catchPokemon(PokeBallType.PokeBall)}>Catch Pokemon</button>
	<button on:click={() => catchPokemon(PokeBallType.GreatBall)}>Catch Pokemon</button>
	<button on:click={() => catchPokemon(PokeBallType.UltraBall)}>Catch Pokemon</button>
	<button on:click={() => catchPokemon(PokeBallType.MasterBall)}>Catch Pokemon</button>
{/if}
