import { Container, type interfaces } from 'inversify';
import 'reflect-metadata';
import TYPES from './types';
import type { IPokeService } from '../services/poke_service';
import {
	PokeServiceImpl,
	type PokeBallUpgradePercentage,
	type PokeServiceArgs
} from '../services/poke_service_impl';
import type { IChanceService } from '../services/chance_service';
import { ChanceServiceImpl } from '../services/chance_service_impl';
import type { ITimeService } from '../services/time_service';
import { TimeServiceImpl } from '../services/time_service_impl';
import { PokeBallType } from '../enums/poke_ball_type';
import type { IUserDataSource } from '../data_source/user_data_source';
import { UserFirestoreDataSource } from '../data_source/user_firestore_data_source';
import type { IUserRepository } from '../repositories/user_repository';
import { UserRepositoryImpl } from '../repositories/user_repository_impl';
import type { Firestore } from 'firebase/firestore';
import { db } from '../../firebase';
import type { IPokemonCollectionDataSource } from '../data_source/pokemon_collection_data_source';
import { PokemonFirestoreDataSource } from '../data_source/pokemon_firestore_data_source';
import type { IPokemonCollectionRepository } from '../repositories/pokemon_collection_repository';
import { PokemonCollectionRepositoryImpl } from '../repositories/pokemon_collection_repository_impl';
import type { UseCase } from '../domain/use_case';
import { CatchPokemonUseCase, type CatchPokemonParam } from '../domain/catch_pokemon_use_case';
import {
	GeneratePokeBallUseCase,
	type GeneratePokeBallParam
} from '../domain/generate_pokeball_use_case';
import type { IPokemonDataSource } from '../../routes/(authenticated)/pokemon/data/interface/pokemon_data_source';
import { PokemonGraphQLDataSource } from '../../routes/(authenticated)/pokemon/data/impl/pokemon_graphql_data_source';
import { PokemonRepository } from '../../routes/(authenticated)/pokemon/data/impl/pokemon_repository';
import type { IPokemonRepository } from '../../routes/(authenticated)/pokemon/data/interface/pokemon_repository';

const container = new Container();

const catchPercentage: Record<PokeBallType, number> = {
	[PokeBallType.PokeBall]: 40,
	[PokeBallType.GreatBall]: 60,
	[PokeBallType.UltraBall]: 80,
	[PokeBallType.MasterBall]: 100
};
const pokeBallUpgradePercentage: Partial<Record<PokeBallType, PokeBallUpgradePercentage>> = {
	[PokeBallType.PokeBall]: { percentage: 40, targetBall: PokeBallType.GreatBall },
	[PokeBallType.GreatBall]: { percentage: 30, targetBall: PokeBallType.UltraBall },
	[PokeBallType.UltraBall]: { percentage: 20, targetBall: PokeBallType.MasterBall }
};
const instantLevelUpPercentage = 30;
const instantLevelUpMax = 10;

container.bind<IPokemonDataSource>(TYPES.PokemonDataSource).to(PokemonGraphQLDataSource);
container.bind<IPokemonRepository>(TYPES.PokemonRepository).to(PokemonRepository);

container.bind<IPokeService>(TYPES.PokeService).toDynamicValue((context: interfaces.Context) => {
	const pokeServiceFactory = context.container.get<
		(pokeServiceArgs: PokeServiceArgs) => IPokeService
	>(TYPES.PokeServiceFactory);
	return pokeServiceFactory({
		catchPercentage,
		pokeBallUpgradePercentage,
		instantLevelUpMax,
		instantLevelUpPercentage
	});
});

container
	.bind<interfaces.Factory<IPokeService>>(TYPES.PokeServiceFactory)
	.toFactory<IPokeService, [pokeServiceArgs: PokeServiceArgs]>((context: interfaces.Context) => {
		return ({
			catchPercentage,
			pokeBallUpgradePercentage,
			instantLevelUpPercentage,
			instantLevelUpMax
		}) => {
			const chanceService = context.container.get<IChanceService>(TYPES.ChanceService);
			return new PokeServiceImpl({
				chanceService,
				catchPercentage,
				pokeBallUpgradePercentage,
				instantLevelUpMax,
				instantLevelUpPercentage
			});
		};
	});

container.bind<IChanceService>(TYPES.ChanceService).to(ChanceServiceImpl);
container.bind<ITimeService>(TYPES.TimeService).to(TimeServiceImpl);

container.bind<IUserDataSource>(TYPES.UserDataSource).to(UserFirestoreDataSource);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepositoryImpl);
container.bind<Firestore>(TYPES.Firestore).toConstantValue(db);

container
	.bind<IPokemonCollectionDataSource>(TYPES.PokemonCollectionDataSource)
	.to(PokemonFirestoreDataSource);
container
	.bind<IPokemonCollectionRepository>(TYPES.PokemonCollectionRepository)
	.to(PokemonCollectionRepositoryImpl);

container.bind<UseCase<CatchPokemonParam, void>>(TYPES.CatchPokemonUseCase).to(CatchPokemonUseCase);
container
	.bind<UseCase<GeneratePokeBallParam, Date | null>>(TYPES.GeneratePokeBallUseCase)
	.to(GeneratePokeBallUseCase);

export default container;
