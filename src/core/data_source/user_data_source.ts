import type { User } from '../entities/user';
import type { PokeBallType } from '../enums/poke_ball_type';
import type { NumberModify } from './number_modify';

export type UpdateUser = {
	lastSpawnedPokeBall?: Date | undefined;
	pokeballs?: Partial<Record<PokeBallType, number | undefined | NumberModify>> | undefined;
};

export interface IUserDataSource {
	find(uid: string): Promise<User | undefined>;
	insert(uid: string, user: User, transaction?: unknown): Promise<void>;
	update(uid: string, param: UpdateUser, transaction?: unknown): Promise<void>;
}
