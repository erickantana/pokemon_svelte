import { writable } from 'svelte/store';
import type { Pokemon } from '../../core/entities/pokemon';
import { PokemonRepository } from './data/impl/pokemon_repository';

const repository = new PokemonRepository();

function createPokemons() {
	const { subscribe, set } = writable<Pokemon[]>([]);

	return {
		subscribe,
		load: async () => {
			set(await repository.get());
		}
	};
}

export const pokemons = createPokemons();
