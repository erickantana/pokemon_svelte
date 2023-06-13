import { injectable } from 'inversify';
import { PokeBallType } from '../enums/poke_ball_type';
import type { IChanceService } from './chance_service';
import type { IPokeService } from './poke_service';

export type PokeBallUpgradePercentage = {
	targetBall: PokeBallType;
	percentage: number;
};

export type PokeServiceArgs = {
	catchPercentage: Record<PokeBallType, number>;
	pokeBallUpgradePercentage: Partial<Record<PokeBallType, PokeBallUpgradePercentage>>;
	instantLevelUpPercentage: number;
	instantLevelUpMax: number;
};

@injectable()
export class PokeServiceImpl implements IPokeService {
	chanceService: IChanceService;

	catchPercentage: Record<PokeBallType, number>;
	pokeBallUpgradePercentage: Partial<Record<PokeBallType, PokeBallUpgradePercentage>>;
	instantLevelUpPercentage: number;
	instantLevelUpMax: number;

	constructor({
		catchPercentage,
		pokeBallUpgradePercentage,
		instantLevelUpPercentage,
		instantLevelUpMax,
		chanceService
	}: {
		catchPercentage: Record<PokeBallType, number>;
		pokeBallUpgradePercentage: Partial<Record<PokeBallType, PokeBallUpgradePercentage>>;
		instantLevelUpPercentage: number;
		instantLevelUpMax: number;
		chanceService: IChanceService;
	}) {
		this.catchPercentage = catchPercentage;
		this.pokeBallUpgradePercentage = pokeBallUpgradePercentage;
		this.instantLevelUpMax = instantLevelUpMax;
		this.instantLevelUpPercentage = instantLevelUpPercentage;
		this.chanceService = chanceService;
	}

	isUpgradable(ball: PokeBallType): boolean {
		return this.pokeBallUpgradePercentage[ball] != undefined;
	}

	upgradePokeball(ball: PokeBallType): PokeBallType {
		const upgradeData: PokeBallUpgradePercentage | undefined = this.pokeBallUpgradePercentage[ball];
		if (upgradeData == undefined) {
			throw new Error(`State Error. ${ball} cannot be upgraded to any further`);
		}

		const isSuccess = this.chanceService.run(upgradeData.percentage);
		return isSuccess ? upgradeData.targetBall : ball;
	}

	generatePokeBall(count: number): PokeBallType[] {
		const pokeballs: PokeBallType[] = [];
		for (let index = 0; index < count; index++) {
			let pokeball = PokeBallType.PokeBall;
			let upgradedPokeball = PokeBallType.PokeBall;

			while (
				this.isUpgradable(pokeball) &&
				(upgradedPokeball = this.upgradePokeball(pokeball)) !== pokeball
			) {
				pokeball = upgradedPokeball;
			}

			pokeballs.push(pokeball);
		}

		return pokeballs;
	}

	catchPokemon(ball: PokeBallType): boolean {
		const catchPercentage = this.catchPercentage[ball];
		if (catchPercentage == undefined) {
			throw new Error(`State Error. ${ball} does not have defined catch percentage`);
		}

		return this.chanceService.run(catchPercentage);
	}

	instantLevelUpBonus(level: number): number {
		let result = level;
		while (
			result < this.instantLevelUpMax &&
			this.chanceService.run(this.instantLevelUpPercentage)
		) {
			result++;
		}

		return result;
	}
}
