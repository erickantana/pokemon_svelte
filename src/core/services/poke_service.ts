import type { Pokemon } from '../entities/pokemon';
import type { PokeBallType } from '../enums/poke_ball_type';

export interface IPokeService {
	generatePokeBall(count: number): PokeBallType[];
	catchPokemon(ball: PokeBallType): boolean;
	instantLevelUpBonus(level: number): number;
	upgradePokeball(ball: PokeBallType): PokeBallType;
	isUpgradable(ball: PokeBallType): boolean;
}
