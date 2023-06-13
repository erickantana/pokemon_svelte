import type { EvolutionStage, PokemonCollection } from '../entities/pokemon_collection';
import type { NumberModify } from './number_modify';

export type UpdatePokemonCollection = {
	name?: string;
	evolutionStages?: EvolutionStage[];
	obtainedAt?: Date;
	level?: number | NumberModify;
};

export interface IPokemonCollectionDataSource {
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
