import {
	doc,
	getDoc,
	type Firestore,
	Timestamp,
	QueryDocumentSnapshot,
	setDoc,
	updateDoc,
	FieldValue,
	increment,
	Transaction
} from 'firebase/firestore';
import type { IUserDataSource, UpdateUser } from './user_data_source';
import type { PokeBallType } from '../enums/poke_ball_type';
import type { User } from '../entities/user';
import { inject, injectable } from 'inversify';
import TYPES from '../container/types';
import { isNumberModify, numberModifyToFieldValue, type NumberModify } from './number_modify';
import { NumberModifier } from './number_modifier';

const userConverter = {
	toFirestore: (data: User) => data,
	fromFirestore: (snap: QueryDocumentSnapshot): User => {
		const { lastSpawnedPokeBall, pokeballs } = snap.data() as {
			lastSpawnedPokeBall: Timestamp;
			pokeballs: Partial<Record<PokeBallType, number>>;
		};
		return {
			lastSpawnedPokeBall: lastSpawnedPokeBall.toDate(),
			pokeballs
		};
	}
};

@injectable()
export class UserFirestoreDataSource implements IUserDataSource {
	db: Firestore;

	constructor(@inject(TYPES.Firestore) db: Firestore) {
		this.db = db;
	}

	async update(uid: string, param: UpdateUser, transaction?: unknown): Promise<void> {
		const pokeBall = param.pokeballs?.PokeBall;
		const greatBall = param.pokeballs?.GreatBall;
		const masterBall = param.pokeballs?.MasterBall;
		const ultraBall = param.pokeballs?.UltraBall;

		const docRef = doc(this.db, 'users', uid).withConverter(userConverter);
		const newUser = {
			...(param.lastSpawnedPokeBall != undefined && {
				lastSpawnedPokeBall: param.lastSpawnedPokeBall
			}),
			...(pokeBall != undefined && {
				'pokeballs.PokeBall': isNumberModify(pokeBall)
					? numberModifyToFieldValue(pokeBall)
					: pokeBall
			}),
			...(greatBall != undefined && {
				'pokeballs.GreatBall': isNumberModify(greatBall)
					? numberModifyToFieldValue(greatBall)
					: greatBall
			}),
			...(masterBall != undefined && {
				'pokeballs.MasterBall': isNumberModify(masterBall)
					? numberModifyToFieldValue(masterBall)
					: masterBall
			}),
			...(ultraBall != undefined && {
				'pokeballs.UltraBall': isNumberModify(ultraBall)
					? numberModifyToFieldValue(ultraBall)
					: ultraBall
			})
		};

		if (transaction instanceof Transaction) {
			transaction.update(docRef, newUser);
		} else {
			updateDoc(docRef, newUser);
		}
	}

	async insert(uid: string, user: User, transaction?: unknown): Promise<void> {
		const docRef = doc(this.db, 'users', uid).withConverter(userConverter);
		if (transaction instanceof Transaction) {
			transaction.set(docRef, user);
		} else {
			await setDoc(docRef, user);
		}
	}

	async find(uid: string): Promise<User | undefined> {
		const docRef = doc(this.db, 'users', uid).withConverter(userConverter);
		const userDoc = await getDoc(docRef);

		return userDoc.data();
	}
}
