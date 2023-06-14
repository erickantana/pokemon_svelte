<script lang="ts">
	import { goto } from '$app/navigation';
	import PokemonItem from './components/PokemonItem.svelte';
	import type { Pokemon } from '../../core/entities/pokemon';
	import container from '../../core/container';
	import type { IPokemonRepository } from './data/interface/pokemon_repository';
	import TYPES from '../../core/container/types';
	import { onMount } from 'svelte';

	const repository = container.get<IPokemonRepository>(TYPES.PokemonRepository);
	let pokemons: Pokemon[] = [];

	let isLoading = false;

	const loadPokemon = async (): Promise<void> => {
		if (isLoading == true) return;
		console.log('fetch Pokemon');
		isLoading = true;
		pokemons = [...pokemons, ...(await repository.get({ limit: 4 * 24, offset: pokemons.length }))];
		isLoading = false;
	};

	onMount(() => {
		window.addEventListener('scroll', () => {
			const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

			if (endOfPage) loadPokemon();
		});
	});
</script>

{#await loadPokemon()}
	<div>Loading ...</div>
{:then}
	<div class="grid md:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-12">
		{#each pokemons as pokemon}
			<div>
				<PokemonItem {pokemon} on:click={() => goto(`/pokemon/${pokemon.name}`)} />
			</div>
		{/each}
	</div>
{/await}
