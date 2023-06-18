import { inject, injectable } from 'inversify';
import type { Pokemon } from '../../../../../core/entities/pokemon';
import type { IPokemonDataSource } from '../interface/pokemon_data_source';
import type { IPokemonRepository } from '../interface/pokemon_repository';
import TYPES from '../../../../../core/container/types';

@injectable()
export class PokemonRepository implements IPokemonRepository {
	private _dataSource: IPokemonDataSource;

	constructor(@inject(TYPES.PokemonDataSource) dataSource: IPokemonDataSource) {
		this._dataSource = dataSource;
	}

	async get({
		limit,
		offset
	}: {
		limit?: number | undefined;
		offset?: number | undefined;
	}): Promise<Pokemon[]> {
		return await this._dataSource.get({ limit, offset });
	}

	async findById(id: string): Promise<Pokemon | null> {
		return await this._dataSource.findById(id);
	}
}
