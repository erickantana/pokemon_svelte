import { inject, injectable } from 'inversify';
import type {
	IPokemonCollectionDataSource,
	UpdatePokemonCollection
} from '../data_source/pokemon_collection_data_source';
import type { PokemonCollection } from '../entities/pokemon_collection';
import type { IPokemonCollectionRepository } from './pokemon_collection_repository';
import TYPES from '../container/types';

@injectable()
export class PokemonCollectionRepositoryImpl implements IPokemonCollectionRepository {
	dataSource: IPokemonCollectionDataSource;

	constructor(@inject(TYPES.PokemonCollectionDataSource) dataSource: IPokemonCollectionDataSource) {
		this.dataSource = dataSource;
	}

	async find(uid: string, basicName: string): Promise<PokemonCollection | undefined> {
		return this.dataSource.find(uid, basicName);
	}

	async insert(
		uid: string,
		basicName: string,
		pokemonCollection: PokemonCollection,
		transaction?: unknown
	): Promise<void> {
		this.dataSource.insert(uid, basicName, pokemonCollection, transaction);
	}

	async update(
		uid: string,
		basicName: string,
		param: UpdatePokemonCollection,
		transaction?: unknown
	): Promise<void> {
		this.dataSource.update(uid, basicName, param, transaction);
	}
}
