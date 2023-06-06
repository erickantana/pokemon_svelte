import { Asyncpokemon, Asyncpokemons } from '../../../../graphql/generated';
import type { Pokemon } from '../../../../core/entities/pokemon';
import type { IPokemonDataSource } from '../interface/pokemon_data_source';
import { injectable } from 'inversify';
import type { EvolutionChain } from '../../../../core/entities/evolution_chain';

@injectable()
export class PokemonGraphQLDataSource implements IPokemonDataSource {
	async get({
		limit,
		offset
	}: {
		limit?: number | undefined;
		offset?: number | undefined;
	}): Promise<Pokemon[]> {
		const result = await Asyncpokemons({
			variables: {
				limit: limit,
				offset: offset
			}
		});

		const pokemons = result.data.pokemons?.results?.map<Pokemon>((pokemonItem) => {
			if (!pokemonItem) throw new Error('Invalid Pokemon Result');

			return {
				id: pokemonItem.id,
				name: pokemonItem.name,
				image: pokemonItem.image,
				url: pokemonItem.url
			};
		});

		return pokemons ?? [];
	}

	async findById(id: string): Promise<Pokemon | null> {
		const result = await Asyncpokemon({
			variables: {
				name: id
			}
		});

		const pokemon = result.data.pokemon;
		if (!pokemon) throw new Error('Pokemon Not Found');

		const speciesUrl = pokemon.species?.url;
		let evolutionChain: EvolutionChain | null = null;
		if (speciesUrl) {
			const speciesResponse = await fetch(speciesUrl);
			const jsonSpeciesResponse = await speciesResponse.json();
			const evolutionChainUrl = jsonSpeciesResponse?.evolution_chain?.url;

			const evolutionResponse = await fetch(evolutionChainUrl);
			const jsonEvolutionResponse = await evolutionResponse.json();
			evolutionChain = this.parseEvolutionChain(jsonEvolutionResponse.chain);
		}

		return {
			id: pokemon.id,
			name: pokemon.name,
			types: pokemon.types,
			sprites: pokemon.sprites,
			height: pokemon.height,
			weight: pokemon.weight,
			evolutionChain: evolutionChain
		};
	}

	parseEvolutionChain(json: any): EvolutionChain {
		return {
			id: json.id,
			speciesName: json.species.name,
			speciesUrl: json.species.url,
			evolveTo: json.evolves_to.map((evolveToJson: any) => {
				return this.parseEvolutionChain(evolveToJson);
			})
		};
	}
}
