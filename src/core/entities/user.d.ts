import type { PokeBallType } from '../enums/poke_ball_type';

export type User = {
	lastSpawnedPokeBall: Date;
	pokeballs: Partial<Record<PokeBallType, number>>;
};
