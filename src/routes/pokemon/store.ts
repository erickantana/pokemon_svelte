import { writable } from 'svelte/store';
import type { Pokemon } from '../../core/entities/pokemon';
import container from '../../core/container';
import type { IPokemonRepository } from './data/interface/pokemon_repository';
import TYPES from '../../core/container/types';

const repository = container.get<IPokemonRepository>(TYPES.PokemonRepository);

function createPokemons() {
	const { subscribe, set } = writable<Pokemon[]>([]);

	return {
		subscribe,
		load: async () => {
			set(await repository.get({ limit: 20, offset: 0 }));
		}
	};
}

export const pokemons = createPokemons();
