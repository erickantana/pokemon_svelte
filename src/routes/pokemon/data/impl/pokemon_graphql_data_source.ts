import { Asyncpokemon, Asyncpokemons } from '../../../../graphql/generated';
import type { Pokemon } from '../../../../core/entities/pokemon';
import type { IPokemonDataSource } from '../interface/pokemon_data_source';

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
				name: pokemonItem.name ?? undefined,
				image: pokemonItem.image ?? undefined,
				url: pokemonItem.url ?? undefined
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

		return {
			name: pokemon.name,
			image: pokemon.sprites?.front_default,
			types: pokemon.types
		};
	}
}
