import { inject, injectable } from 'inversify';
import type { UseCase } from './use_case';
import type { PokeBallType } from '../enums/poke_ball_type';
import type { IUserRepository } from '../repositories/user_repository';
import type { IPokemonCollectionRepository } from '../repositories/pokemon_collection_repository';
import TYPES from '../container/types';
import type { Pokemon } from '../entities/pokemon';
import type { IPokeService } from '../services/poke_service';
import { NumberModifier } from '../data_source/number_modifier';
import type { EvolutionMap } from '../entities/evolution_map';
import type { EvolutionChain } from '../entities/evolution_chain';

export type CatchPokemonParam = {
	ball: PokeBallType;
	uid: string;
	pokemon: Pokemon;
};

@injectable()
export class CatchPokemonUseCase implements UseCase<CatchPokemonParam, void> {
	userRepository: IUserRepository;
	pokemonCollectionRepository: IPokemonCollectionRepository;
	pokeService: IPokeService;

	constructor(
		@inject(TYPES.UserRepository) userRepository: IUserRepository,
		@inject(TYPES.PokemonCollectionRepository)
		pokemonCollectionRepository: IPokemonCollectionRepository,
		@inject(TYPES.PokeService) pokeService: IPokeService
	) {
		this.userRepository = userRepository;
		this.pokemonCollectionRepository = pokemonCollectionRepository;
		this.pokeService = pokeService;
	}

	#evolutionChainToEvolutionMaps(
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
			this.#evolutionChainToEvolutionMaps(evolutionMaps, evolveTo);
		});
	}

	async call(param: CatchPokemonParam): Promise<void> {
		const { pokemon, ball, uid } = param;

		const basicName = pokemon?.evolutionChain?.speciesName;
		if (basicName == null || basicName == undefined) throw new Error('Invalid Pokemon Basic Name');

		const user = await this.userRepository.find(uid);
		if (user == undefined) throw new Error('User cannot be found');

		const pokeballCount = user.pokeballs[ball];
		if (pokeballCount == undefined || pokeballCount < 1) throw new Error('Invalid PokeBall count');

		const result = this.pokeService.catchPokemon(ball);

		// Decrement User PokeBall
		this.userRepository.update(uid, {
			pokeballs: {
				[ball]: { value: 1, modifier: NumberModifier.decrement }
			}
		});

		if (result) {
			// Pokemon catched successfully

			const pokemonCollection = await this.pokemonCollectionRepository.find(uid, basicName);

			if (pokemonCollection == undefined) {
				// User doesn't have this pokemon yet, store it as a new pokemon collection.

				await this.pokemonCollectionRepository.insert(uid, basicName, {
					obtainedAt: new Date(),
					name: basicName,
					level: this.pokeService.instantLevelUpBonus(1), // Run a fixed chance to level up pokemon up to 10.
					evolutionStages: [{ name: basicName, levelThreshold: 0 }]
				});
			} else {
				// User already have this basic pokemon, increment it's level by 1.

				const evolutionStages = pokemonCollection.evolutionStages;
				const lastStage = evolutionStages[evolutionStages.length - 1];
				const currentLevel = pokemonCollection.level;

				// If pokemon reached max levels already, do nothing.
				if (currentLevel + 1 > 100) return;

				// Check if pokemon next level will trigger evolution threshold
				if (currentLevel + 1 == lastStage.levelThreshold + 20) {
					// Pokemon's next level reached the evolution level threshold
					const evolutionMaps: EvolutionMap[] = [];
					const evolutionChain = pokemon.evolutionChain;

					// Pokemon should have at least one evolution stage which is it's basic state
					if (evolutionChain == null || evolutionChain == undefined)
						throw new Error('Invalid pokemon data. No evolution chain available.');

					this.#evolutionChainToEvolutionMaps(evolutionMaps, evolutionChain);
					// Filter all possible evolution branch from it's current state
					const evolutionBranch = evolutionMaps.filter(
						(evolutionMap) => evolutionMap.fromSpeciesName == lastStage.name
					);

					if (evolutionBranch.length > 0) {
						// Pokemon still has one or more evolution branch stage ahead

						// Randomize a target evolution from all possible evolution branch
						const randomEvolutionBranch = Math.round(Math.random() * 10) % evolutionBranch.length;
						const targetSpeciesName = evolutionBranch[randomEvolutionBranch].toSpeciesName;

						if (targetSpeciesName) {
							// Target evolution has a valid species name, which is neither null nor undefined
							// Push the target evolution to last element of pokemon evolutionStages
							evolutionStages.push({
								levelThreshold: currentLevel + 1,
								name: targetSpeciesName
							});
						}
					}
				}

				// Update pokemon level by 1 and its evolution stages if there is any changes
				await this.pokemonCollectionRepository.update(uid, basicName, {
					level: { value: 1, modifier: NumberModifier.increment },
					evolutionStages: evolutionStages
				});
			}
		}
	}
}
