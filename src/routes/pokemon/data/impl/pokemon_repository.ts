import type { Pokemon } from '../../../../core/entities/pokemon';
import type { IPokemonDataSource } from '../interface/pokemon_data_source';
import type { IPokemonRepository } from '../interface/pokemon_repository';
import { PokemonGraphQLDataSource } from './pokemon_graphql_data_source';

export class PokemonRepository implements IPokemonRepository {
	dataSource: IPokemonDataSource = new PokemonGraphQLDataSource();

	async get({
		limit,
		offset
	}: {
		limit?: number | undefined;
		offset?: number | undefined;
	}): Promise<Pokemon[]> {
		return await this.dataSource.get({ limit, offset });
	}

	async findById(id: string): Promise<Pokemon | null> {
		return await this.dataSource.findById(id);
	}
}
