import type { Pokemon } from '../../../../core/entities/pokemon';
import type { IPokemonDataSource } from '../interface/pokemon_data_source';

export class PokemonGraphQLDataSource implements IPokemonDataSource {
	get(): Promise<Pokemon[]> {
		throw new Error('Method not implemented.');
	}
	findById(id: string): Promise<Pokemon | null> {
		throw new Error('Method not implemented.');
	}
}
