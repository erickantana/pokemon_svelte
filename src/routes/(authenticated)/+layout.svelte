<script lang="ts">
	import '../../app.css';
	import container from '../../core/container';
	import TYPES from '../../core/container/types';
	import { auth, db } from '../../firebase';
	import type { UseCase } from '../../core/domain/use_case';
	import type { GeneratePokeBallParam } from '../../core/domain/generate_pokeball_use_case';
	import { onMount, setContext } from 'svelte';
	import { doc, onSnapshot } from 'firebase/firestore';
	import type { User } from '../../core/entities/user';
	import { userConverter } from '../../core/data_source/user_firestore_data_source';
	import type { PokeBallType } from '../../core/enums/poke_ball_type';
	import { writable, type Writable } from 'svelte/store';
	import type { User as FirebaseUser } from 'firebase/auth';
	import NavbarItem from './components/NavbarItem.svelte';
	import Drawer from './components/Drawer.svelte';

	export let data;

	let lastSpawnedPokeBall: Date | null = null;
	const useCase = container.get<UseCase<GeneratePokeBallParam, Date>>(
		TYPES.GeneratePokeBallUseCase
	);
	let nextPokeBallIn: string | null = null;
	async function timer() {
		if (lastSpawnedPokeBall == null) return;

		let startTime = lastSpawnedPokeBall.getTime();
		let endTime = new Date().getTime();

		const timeDiffInSeconds = 60 * 5 - Math.floor((endTime - startTime) / 1000);
		const remainingTime = Math.max(timeDiffInSeconds, 0);

		const minute = `${Math.floor(remainingTime / 60)}`.padStart(2, '0');
		const second = `${remainingTime % 60}`.padStart(2, '0');

		nextPokeBallIn = `${minute} : ${second}`;

		const uid = auth.currentUser?.uid;
		if (timeDiffInSeconds == 0 && uid) {
			useCase.call({ uid }).then((value) => {
				if (value != null) lastSpawnedPokeBall = value;
			});
		}

		setTimeout(timer, 1000);
	}

	let user: User | null = null;
	let pokeballs: { type: PokeBallType; count: number }[] = [];
	$: {
		let userPokeballs = user?.pokeballs;
		pokeballs = [];
		if (userPokeballs) {
			for (const key in userPokeballs) {
				const pokeballCount = userPokeballs[key as keyof typeof PokeBallType];
				if (pokeballCount != undefined) {
					pokeballs = [
						...pokeballs,
						{
							type: key as PokeBallType,
							count: pokeballCount
						}
					];
				}
			}
		}
	}

	const firebaseUser: Writable<FirebaseUser | null | undefined> = writable<
		FirebaseUser | null | undefined
	>();
	setContext('firebaseUser', firebaseUser);

	onMount(() => {
		auth.onAuthStateChanged(async (auth: FirebaseUser | null) => {
			firebaseUser.set(auth);

			lastSpawnedPokeBall = auth != null ? await useCase.call({ uid: auth.uid }) : null;

			if (auth) {
				const userDoc = doc(db, 'users', auth.uid).withConverter(userConverter);
				onSnapshot(userDoc, (doc) => {
					user = doc.data() ?? null;
				});
			}

			timer();
		});
	});
</script>

<!-- App Layout -->
<div>
	<!-- Header -->
	<div class="px-8 h-16 sticky top-0 bg-gray-800 shadow-xl flex">
		<div class="text-gray-300 flex align-middle">
			<div class="flex-1 self-center">
				<Drawer />
				<img
					class="h-8 w-8 mr-4 inline-block"
					src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Pokebola-pokeball-png-0.png/769px-Pokebola-pokeball-png-0.png"
					alt="logo"
				/>
				<div class="hidden md:inline-block align-middle">
					<NavbarItem class="ml-4" href="/" label="Home" />
					<NavbarItem class="ml-4" href="/pokemon" label="Pokemon" />
					<NavbarItem class="ml-4" href="/pokemon-collections" label="Collection" />
				</div>
				<!-- {#if nextPokeBallIn}
				<b>Next pokeball in {nextPokeBallIn}</b>
			{:else}
				<span>&nbsp;</span>
			{/if} -->
			</div>
			<!-- <div>
			{#each pokeballs as pokeball}
				<div class="inline-block ml-4"><b>{pokeball.type}: {pokeball.count}</b></div>
			{/each}
		</div> -->
		</div>
	</div>

	<!-- Content -->
	<div class="p-4">
		{#if firebaseUser == undefined}
			<div>Loading</div>
		{:else}
			<slot />
		{/if}
	</div>
</div>

<style>
	:global(body) {
		height: 100%;
		background-color: theme('colors.gray.950');
	}
</style>
