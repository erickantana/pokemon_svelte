import { inject, injectable } from 'inversify';
import type { EvolutionStage, PokemonCollection } from '../entities/pokemon_collection';
import type {
	IPokemonCollectionDataSource,
	UpdatePokemonCollection
} from './pokemon_collection_data_source';
import TYPES from '../container/types';
import {
	doc,
	QueryDocumentSnapshot,
	type Firestore,
	Timestamp,
	getDoc,
	Transaction,
	setDoc,
	updateDoc,
	collection,
	getDocs
} from 'firebase/firestore';
import { isNumberModify, numberModifyToFieldValue } from './number_modify';

const pokemonCollectionConverter = {
	toFirestore: (data: PokemonCollection) => data,
	fromFirestore: (snap: QueryDocumentSnapshot): PokemonCollection => {
		const { name, obtainedAt, level, evolutionStages } = snap.data() as {
			name: string;
			obtainedAt: Timestamp;
			level: number;
			evolutionStages: EvolutionStage[];
		};

		return {
			name,
			level,
			obtainedAt: obtainedAt.toDate(),
			evolutionStages
		};
	}
};

@injectable()
export class PokemonFirestoreDataSource implements IPokemonCollectionDataSource {
	db: Firestore;

	constructor(@inject(TYPES.Firestore) db: Firestore) {
		this.db = db;
	}

	async get(uid: string): Promise<PokemonCollection[]> {
		const pokemonCollections = collection(this.db, 'users', uid, 'pokemons').withConverter(
			pokemonCollectionConverter
		);
		const querySnapshot = await getDocs(pokemonCollections);

		const data = querySnapshot.docs.map((doc) => {
			return doc.data();
		});

		return data;
	}

	async find(uid: string, basicName: string): Promise<PokemonCollection | undefined> {
		const docRef = doc(this.db, 'users', uid, 'pokemons', basicName).withConverter(
			pokemonCollectionConverter
		);
		const pokemonCollectionDoc = await getDoc(docRef);

		return pokemonCollectionDoc.data();
	}

	async insert(
		uid: string,
		basicName: string,
		pokemonCollection: PokemonCollection,
		transaction?: unknown
	): Promise<void> {
		const docRef = doc(this.db, 'users', uid, 'pokemons', basicName).withConverter(
			pokemonCollectionConverter
		);
		if (transaction instanceof Transaction) {
			transaction.set(docRef, pokemonCollection);
		} else {
			await setDoc(docRef, pokemonCollection);
		}
	}

	async update(
		uid: string,
		basicName: string,
		param: UpdatePokemonCollection,
		transaction?: unknown
	): Promise<void> {
		const { level, evolutionStages } = param;

		const docRef = doc(this.db, 'users', uid, 'pokemons', basicName).withConverter(
			pokemonCollectionConverter
		);

		const newPokemonCollection = {
			...(level != undefined && {
				level: isNumberModify(level) ? numberModifyToFieldValue(level) : level
			}),
			...(evolutionStages != undefined && { evolutionStages })
		};

		if (transaction instanceof Transaction) {
			transaction.update(docRef, newPokemonCollection);
		} else {
			updateDoc(docRef, newPokemonCollection);
		}
	}
}
