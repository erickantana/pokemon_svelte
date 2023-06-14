<script lang="ts">
	import '../app.css';

	import container from '../core/container';
	import TYPES from '../core/container/types';
	import { auth } from '../firebase';
	import type { UseCase } from '../core/domain/use_case';
	import type { GeneratePokeBallParam } from '../core/domain/generate_pokeball_use_case';

	let lastSpawnedPokeBall: Date | null = null;

	const useCase = container.get<UseCase<GeneratePokeBallParam, Date>>(
		TYPES.GeneratePokeBallUseCase
	);

	let nextPokeBallIn: string | null = null;

	auth.onAuthStateChanged(async (auth) => {
		lastSpawnedPokeBall = auth != null ? await useCase.call({ uid: auth.uid }) : null;
	});

	setInterval(timer, 1000);

	function timer() {
		if (lastSpawnedPokeBall == null) return;

		let startTime = lastSpawnedPokeBall.getTime();
		let endTime = new Date().getTime();

		const seconds = Math.max(60 * 5 - Math.floor((endTime - startTime) / 1000), 0);

		nextPokeBallIn = `${Math.floor(seconds / 60)} : ${seconds % 60}`;

		const uid = auth.currentUser?.uid;
		if (seconds == 0 && uid) {
			useCase.call({ uid }).then((value) => {
				if (value != null) lastSpawnedPokeBall = value;
			});
		}
	}

	let hidden = true;
</script>

<div class="p-6 sticky top-0 bg-primary-800 shadow-xl">
	<span class="text-white">
		{#if nextPokeBallIn}
			<b>Next Pokeball In {nextPokeBallIn}</b>
		{:else}
			<span>&nbsp;</span>
		{/if}
	</span>
</div>

<div class="p-4">
	<slot />
</div>

<style>
</style>
