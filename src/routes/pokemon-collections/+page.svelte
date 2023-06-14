<script lang="ts">
	import { onMount } from 'svelte';
	import container from '../../core/container';
	import TYPES from '../../core/container/types';
	import type { IPokemonCollectionRepository } from '../../core/repositories/pokemon_collection_repository';
	import { auth } from '../../firebase';
	import type { PokemonCollection } from '../../core/entities/pokemon_collection';

	const pokemonCollectionRepository = container.get<IPokemonCollectionRepository>(
		TYPES.PokemonCollectionRepository
	);

	let pokemonCollections: PokemonCollection[] = [];
	const uid = auth.currentUser?.uid;

	onMount(() => {
		if (uid) {
			pokemonCollectionRepository.get(uid).then((value) => {
				pokemonCollections = value;
			});
		}
	});
</script>

{#each pokemonCollections as pokemonCollection}
	{pokemonCollection.name}
{/each}
