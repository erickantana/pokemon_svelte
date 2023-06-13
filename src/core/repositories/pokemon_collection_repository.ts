import type { UpdatePokemonCollection } from '../data_source/pokemon_collection_data_source';
import type { PokemonCollection } from '../entities/pokemon_collection';

export interface IPokemonCollectionRepository {
	find(uid: string, basicName: string): Promise<PokemonCollection | undefined>;
	insert(
		uid: string,
		basicName: string,
		pokemonCollection: PokemonCollection,
		transaction?: unknown
	): Promise<void>;
	update(
		uid: string,
		basicName: string,
		param: UpdatePokemonCollection,
		transaction?: unknown
	): Promise<void>;
}
