import { Container } from 'inversify';
import 'reflect-metadata';
import type { IPokemonDataSource } from '../../routes/pokemon/data/interface/pokemon_data_source';
import TYPES from './types';
import { PokemonGraphQLDataSource } from '../../routes/pokemon/data/impl/pokemon_graphql_data_source';
import type { IPokemonRepository } from '../../routes/pokemon/data/interface/pokemon_repository';
import { PokemonRepository } from '../../routes/pokemon/data/impl/pokemon_repository';

const container = new Container();

container.bind<IPokemonDataSource>(TYPES.PokemonDataSource).to(PokemonGraphQLDataSource);
container.bind<IPokemonRepository>(TYPES.PokemonRepository).to(PokemonRepository);

export default container;
