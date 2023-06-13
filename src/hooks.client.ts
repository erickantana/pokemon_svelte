import { runTransaction } from 'firebase/firestore';
import container from './core/container';
import TYPES from './core/container/types';
import type { IPokeService } from './core/services/poke_service';
import type { ITimeService } from './core/services/time_service';
import { auth, db } from './firebase';
import { PokeBallType } from './core/enums/poke_ball_type';
import type { IUserRepository } from './core/repositories/user_repository';
import { NumberModifier } from './core/data_source/number_modifier';

const pokeService = container.get<IPokeService>(TYPES.PokeService);
const timeService = container.get<ITimeService>(TYPES.TimeService);

auth.onAuthStateChanged(async (auth) => {
	console.log(auth);
	if (auth != null) {
		await runTransaction(db, async (transaction) => {
			const uid = auth.uid;
			const userRepository = container.get<IUserRepository>(TYPES.UserRepository);
			const user = await userRepository.find(uid);

			if (user) {
				const now = new Date();
				const { lastSpawnedPokeBall, pokeballs } = user;
				let currentBallCount = 0;
				for (const key in pokeballs) {
					const data = pokeballs[key as keyof typeof PokeBallType];
					currentBallCount += data ?? 0;
				}

				const maxPokeballToHold = 20;
				const maxSpawnedCount = maxPokeballToHold - currentBallCount;

				if (lastSpawnedPokeBall.getTime() < now.getTime()) {
					const { stepCount, maxThresholdDate } = timeService.getTimeStep(
						lastSpawnedPokeBall,
						now,
						1000 * 60 * 5
					);
					const numberOfPokeballToGenerate = Math.min(maxSpawnedCount, stepCount);
					const pokeballs = pokeService.generatePokeBall(numberOfPokeballToGenerate);

					const pokeBallCount = pokeballs.reduce<number>(
						(prev, current) => prev + (current == PokeBallType.PokeBall ? 1 : 0),
						0
					);
					const greatBallCount = pokeballs.reduce<number>(
						(prev, current) => prev + (current == PokeBallType.GreatBall ? 1 : 0),
						0
					);
					const ultraBallCount = pokeballs.reduce<number>(
						(prev, current) => prev + (current == PokeBallType.UltraBall ? 1 : 0),
						0
					);
					const masterBallCount = pokeballs.reduce<number>(
						(prev, current) => prev + (current == PokeBallType.MasterBall ? 1 : 0),
						0
					);

					await userRepository.update(
						uid,
						{
							lastSpawnedPokeBall: maxThresholdDate,
							pokeballs: {
								PokeBall: { value: pokeBallCount, modifier: NumberModifier.increment },
								GreatBall: { value: greatBallCount, modifier: NumberModifier.increment },
								MasterBall: { value: masterBallCount, modifier: NumberModifier.increment },
								UltraBall: { value: ultraBallCount, modifier: NumberModifier.increment }
							}
						},
						transaction
					);
				}
			} else {
				const lastSpawnedPokeBall = new Date();
				const pokeballs = pokeService.generatePokeBall(10);
				const pokeBallCount = pokeballs.reduce<number>(
					(prev, current) => prev + (current == PokeBallType.PokeBall ? 1 : 0),
					0
				);
				const greatBallCount = pokeballs.reduce<number>(
					(prev, current) => prev + (current == PokeBallType.GreatBall ? 1 : 0),
					0
				);
				const ultraBallCount = pokeballs.reduce<number>(
					(prev, current) => prev + (current == PokeBallType.UltraBall ? 1 : 0),
					0
				);
				const masterBallCount = pokeballs.reduce<number>(
					(prev, current) => prev + (current == PokeBallType.MasterBall ? 1 : 0),
					0
				);
				await userRepository.insert(
					uid,
					{
						lastSpawnedPokeBall,
						pokeballs: {
							PokeBall: pokeBallCount,
							GreatBall: greatBallCount,
							UltraBall: ultraBallCount,
							MasterBall: masterBallCount
						}
					},
					transaction
				);
			}
		});
	}
});
