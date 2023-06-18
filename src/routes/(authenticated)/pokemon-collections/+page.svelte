<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import container from '../../../core/container';
	import TYPES from '../../../core/container/types';
	import type { IPokemonCollectionRepository } from '../../../core/repositories/pokemon_collection_repository';
	import type { PokemonCollection } from '../../../core/entities/pokemon_collection';
	import type { User } from 'firebase/auth';
	import type { Writable } from 'svelte/store';
	import PokemonCollectionItem from './component/PokemonCollectionItem.svelte';

	const pokemonCollectionRepository = container.get<IPokemonCollectionRepository>(
		TYPES.PokemonCollectionRepository
	);

	let pokemonCollections: PokemonCollection[] = [];

	const firebaseUser = getContext<Writable<User | null | undefined>>('firebaseUser');

	$: {
		const uid = $firebaseUser?.uid;

		if (uid) {
			pokemonCollectionRepository.get(uid).then((value) => {
				pokemonCollections = value;
			});
		}
	}

	onMount(() => {});
</script>

<div class="grid md:grid-cols-4 lg:grid-cols-8 2xl:grid-cols-12">
	{#each pokemonCollections as pokemonCollection}
		<PokemonCollectionItem {pokemonCollection} />
	{/each}
</div>
