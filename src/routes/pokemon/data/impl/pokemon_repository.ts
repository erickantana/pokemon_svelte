import type { Pokemon } from '../../../../core/entities/pokemon';
import type { IPokemonRepository } from '../interface/pokemon_repository';

export class PokemoRepository implements IPokemonRepository {
	get(): Promise<Pokemon[]> {
		throw new Error('Method not implemented.');
	}
	findById(id: string): Promise<Pokemon | null> {
		throw new Error('Method not implemented.');
	}
}
