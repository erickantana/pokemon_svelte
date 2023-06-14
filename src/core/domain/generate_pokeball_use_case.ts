import { inject, injectable } from 'inversify';
import type { IUserRepository } from '../repositories/user_repository';
import type { UseCase } from './use_case';
import TYPES from '../container/types';
import { PokeBallType } from '../enums/poke_ball_type';
import type { ITimeService } from '../services/time_service';
import type { IPokeService } from '../services/poke_service';
import { NumberModifier } from '../data_source/number_modifier';
import { runTransaction } from 'firebase/firestore';
import { db } from '../../firebase';

export type GeneratePokeBallParam = {
	uid: string;
};

@injectable()
export class GeneratePokeBallUseCase implements UseCase<GeneratePokeBallParam, Date | null> {
	userRepository: IUserRepository;
	timeService: ITimeService;
	pokeService: IPokeService;
	spawnInterval: number = 1000 * 60 * 5; // 5 minutes

	constructor(
		@inject(TYPES.UserRepository) userRepository: IUserRepository,
		@inject(TYPES.TimeService) timeService: ITimeService,
		@inject(TYPES.PokeService) pokeService: IPokeService
	) {
		this.userRepository = userRepository;
		this.timeService = timeService;
		this.pokeService = pokeService;
	}

	async call(param: GeneratePokeBallParam): Promise<Date | null> {
		return await runTransaction<Date | null>(db, async (transaction) => {
			const { uid } = param;

			const user = await this.userRepository.find(uid);

			if (user) {
				// Existing User
				const now = new Date();
				const pokeballs = user.pokeballs;
				const lastSpawnedPokeBall = user.lastSpawnedPokeBall;
				let currentBallCount = 0;
				for (const key in pokeballs) {
					const data = pokeballs[key as keyof typeof PokeBallType];
					currentBallCount += data ?? 0;
				}

				const maxPokeballToHold = 20;
				const maxSpawnedCount = maxPokeballToHold - currentBallCount;

				if (lastSpawnedPokeBall.getTime() < now.getTime()) {
					const { stepCount, maxThresholdDate } = this.timeService.getTimeStep(
						lastSpawnedPokeBall,
						now,
						this.spawnInterval
					);
					const numberOfPokeballToGenerate = Math.min(maxSpawnedCount, stepCount);
					const generatedPokeballs = this.pokeService.generatePokeBall(numberOfPokeballToGenerate);
					const pokeballs: Record<PokeBallType, number> = {
						PokeBall: 0,
						GreatBall: 0,
						UltraBall: 0,
						MasterBall: 0
					};

					for (let index = 0; index < generatedPokeballs.length; index++) {
						const generatedPokeBall = generatedPokeballs[index];
						pokeballs[generatedPokeBall]++;
					}

					await this.userRepository.update(
						uid,
						{
							lastSpawnedPokeBall: maxThresholdDate,
							pokeballs: {
								PokeBall: {
									value: pokeballs[PokeBallType.PokeBall],
									modifier: NumberModifier.increment
								},
								GreatBall: {
									value: pokeballs[PokeBallType.GreatBall],
									modifier: NumberModifier.increment
								},
								UltraBall: {
									value: pokeballs[PokeBallType.UltraBall],
									modifier: NumberModifier.increment
								},
								MasterBall: {
									value: pokeballs[PokeBallType.MasterBall],
									modifier: NumberModifier.increment
								}
							}
						},
						transaction
					);
					return maxThresholdDate;
				}
			} else {
				// New User
				const lastSpawnedPokeBall = new Date();
				const generatedPokeballs = this.pokeService.generatePokeBall(10);
				const pokeballs: Record<PokeBallType, number> = {
					PokeBall: 0,
					GreatBall: 0,
					UltraBall: 0,
					MasterBall: 0
				};

				for (let index = 0; index < generatedPokeballs.length; index++) {
					const ball = generatedPokeballs[index];
					pokeballs[ball]++;
				}
				await this.userRepository.insert(
					uid,
					{ lastSpawnedPokeBall, pokeballs: pokeballs },
					transaction
				);
				return lastSpawnedPokeBall;
			}

			return null;
		});
	}
}
