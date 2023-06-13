import { inject, injectable } from 'inversify';
import type { IUserDataSource, UpdateUser } from '../data_source/user_data_source';
import type { User } from '../entities/user';
import type { IUserRepository } from './user_repository';
import TYPES from '../container/types';

@injectable()
export class UserRepositoryImpl implements IUserRepository {
	dataSource: IUserDataSource;

	constructor(@inject(TYPES.UserDataSource) dataSource: IUserDataSource) {
		this.dataSource = dataSource;
	}

	async insert(uid: string, user: User, transaction?: unknown): Promise<void> {
		return await this.dataSource.insert(uid, user, transaction);
	}

	async update(uid: string, param: UpdateUser, transaction?: unknown): Promise<void> {
		return await this.dataSource.update(uid, param, transaction);
	}

	async find(uid: string): Promise<User | undefined> {
		return await this.dataSource.find(uid);
	}
}
