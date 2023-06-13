import type { UpdateUser } from '../data_source/user_data_source';
import type { User } from '../entities/user';

export interface IUserRepository {
	find(uid: string): Promise<User | undefined>;
	insert(uid: string, user: User, transaction?: unknown): Promise<void>;
	update(uid: string, param: UpdateUser, transaction?: unknown): Promise<void>;
}
