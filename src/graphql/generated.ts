import client from "../core/graphql_client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions, QueryOptions
      } from "@apollo/client";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string | number; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  JSON: { input: any; output: any; }
  JSONObject: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

export type Ability = {
  __typename?: 'Ability';
  ability?: Maybe<BaseName>;
  is_hidden?: Maybe<Scalars['Boolean']['output']>;
  slot?: Maybe<Scalars['Int']['output']>;
};

export type BaseList = {
  __typename?: 'BaseList';
  count?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  next?: Maybe<Scalars['String']['output']>;
  previous?: Maybe<Scalars['String']['output']>;
  results?: Maybe<Array<Maybe<BaseName>>>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type BaseName = {
  __typename?: 'BaseName';
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type BaseResponse = {
  __typename?: 'BaseResponse';
  message?: Maybe<Scalars['String']['output']>;
  params?: Maybe<Scalars['JSON']['output']>;
  response?: Maybe<Scalars['JSON']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type GameIndex = {
  __typename?: 'GameIndex';
  game_index?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<BaseName>;
};

export type HeldItem = {
  __typename?: 'HeldItem';
  item?: Maybe<BaseName>;
  version_details?: Maybe<Array<Maybe<VersionDetail>>>;
};

export type Move = {
  __typename?: 'Move';
  move?: Maybe<BaseName>;
  version_group_details?: Maybe<Array<Maybe<VersionGroupDetail>>>;
};

export type Pokemon = {
  __typename?: 'Pokemon';
  abilities?: Maybe<Array<Maybe<Ability>>>;
  base_experience?: Maybe<Scalars['Int']['output']>;
  forms?: Maybe<Array<Maybe<BaseName>>>;
  game_indices?: Maybe<Array<Maybe<GameIndex>>>;
  height?: Maybe<Scalars['Int']['output']>;
  held_items?: Maybe<Array<Maybe<HeldItem>>>;
  id?: Maybe<Scalars['Int']['output']>;
  is_default?: Maybe<Scalars['Boolean']['output']>;
  location_area_encounters?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  moves?: Maybe<Array<Maybe<Move>>>;
  name?: Maybe<Scalars['String']['output']>;
  order?: Maybe<Scalars['Int']['output']>;
  species?: Maybe<BaseName>;
  sprites?: Maybe<Sprite>;
  stats?: Maybe<Array<Maybe<Stat>>>;
  status?: Maybe<Scalars['Boolean']['output']>;
  types?: Maybe<Array<Maybe<Type>>>;
  weight?: Maybe<Scalars['Int']['output']>;
};

export type PokemonItem = {
  __typename?: 'PokemonItem';
  artwork?: Maybe<Scalars['String']['output']>;
  dreamworld?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type PokemonList = {
  __typename?: 'PokemonList';
  count?: Maybe<Scalars['Int']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  next?: Maybe<Scalars['String']['output']>;
  nextOffset?: Maybe<Scalars['Int']['output']>;
  params?: Maybe<Scalars['JSON']['output']>;
  prevOffset?: Maybe<Scalars['Int']['output']>;
  previous?: Maybe<Scalars['String']['output']>;
  results?: Maybe<Array<Maybe<PokemonItem>>>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type Query = {
  __typename?: 'Query';
  abilities?: Maybe<BaseList>;
  ability?: Maybe<BaseResponse>;
  berries?: Maybe<BaseList>;
  berry?: Maybe<BaseResponse>;
  eggGroup?: Maybe<BaseResponse>;
  eggGroups?: Maybe<BaseList>;
  encounterMethod?: Maybe<BaseResponse>;
  encounterMethods?: Maybe<BaseList>;
  evolutionChain?: Maybe<BaseResponse>;
  evolutionChains?: Maybe<BaseList>;
  evolutionTrigger?: Maybe<BaseResponse>;
  evolutionTriggers?: Maybe<BaseList>;
  gender?: Maybe<BaseResponse>;
  genders?: Maybe<BaseList>;
  growthRate?: Maybe<BaseResponse>;
  growthRates?: Maybe<BaseList>;
  location?: Maybe<BaseResponse>;
  locations?: Maybe<BaseList>;
  move?: Maybe<BaseResponse>;
  moves?: Maybe<BaseList>;
  nature?: Maybe<BaseResponse>;
  natures?: Maybe<BaseList>;
  pokemon?: Maybe<Pokemon>;
  pokemons?: Maybe<PokemonList>;
  region?: Maybe<BaseResponse>;
  regions?: Maybe<BaseList>;
  species?: Maybe<BaseList>;
  types?: Maybe<BaseList>;
};


export type QueryAbilityArgs = {
  ability: Scalars['String']['input'];
};


export type QueryBerryArgs = {
  berry: Scalars['String']['input'];
};


export type QueryEggGroupArgs = {
  eggGroup: Scalars['String']['input'];
};


export type QueryEncounterMethodArgs = {
  encounterMethod: Scalars['String']['input'];
};


export type QueryEvolutionChainArgs = {
  id: Scalars['String']['input'];
};


export type QueryEvolutionTriggerArgs = {
  name: Scalars['String']['input'];
};


export type QueryGenderArgs = {
  gender: Scalars['String']['input'];
};


export type QueryGrowthRateArgs = {
  growthRate: Scalars['String']['input'];
};


export type QueryLocationArgs = {
  location: Scalars['String']['input'];
};


export type QueryMoveArgs = {
  move: Scalars['String']['input'];
};


export type QueryNatureArgs = {
  nature: Scalars['String']['input'];
};


export type QueryPokemonArgs = {
  name: Scalars['String']['input'];
};


export type QueryPokemonsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRegionArgs = {
  region: Scalars['String']['input'];
};

export type Sprite = {
  __typename?: 'Sprite';
  back_default?: Maybe<Scalars['String']['output']>;
  back_female?: Maybe<Scalars['String']['output']>;
  back_shiny?: Maybe<Scalars['String']['output']>;
  back_shiny_female?: Maybe<Scalars['String']['output']>;
  front_default?: Maybe<Scalars['String']['output']>;
  front_female?: Maybe<Scalars['String']['output']>;
  front_shiny?: Maybe<Scalars['String']['output']>;
  front_shiny_female?: Maybe<Scalars['String']['output']>;
};

export type Stat = {
  __typename?: 'Stat';
  base_stat?: Maybe<Scalars['Int']['output']>;
  effort?: Maybe<Scalars['Int']['output']>;
  stat?: Maybe<BaseName>;
};

export type Type = {
  __typename?: 'Type';
  slot?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<BaseName>;
};

export type VersionDetail = {
  __typename?: 'VersionDetail';
  rarity?: Maybe<Scalars['Int']['output']>;
  version?: Maybe<BaseName>;
};

export type VersionGroupDetail = {
  __typename?: 'VersionGroupDetail';
  level_learned_at?: Maybe<Scalars['Int']['output']>;
  move_learn_method?: Maybe<BaseName>;
  version_group?: Maybe<BaseName>;
};

export type PokemonsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type PokemonsQuery = { __typename?: 'Query', pokemons?: { __typename?: 'PokemonList', count?: number | null, next?: string | null, previous?: string | null, status?: boolean | null, message?: string | null, results?: Array<{ __typename?: 'PokemonItem', url?: string | null, name?: string | null, image?: string | null } | null> | null } | null };

export type PokemonQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type PokemonQuery = { __typename?: 'Query', pokemon?: { __typename?: 'Pokemon', id?: number | null, name?: string | null, sprites?: { __typename?: 'Sprite', front_default?: string | null } | null, moves?: Array<{ __typename?: 'Move', move?: { __typename?: 'BaseName', name?: string | null } | null } | null> | null, types?: Array<{ __typename?: 'Type', type?: { __typename?: 'BaseName', id?: number | null, name?: string | null, url?: string | null } | null } | null> | null } | null };


export const PokemonsDoc = gql`
    query pokemons($limit: Int, $offset: Int) {
  pokemons(limit: $limit, offset: $offset) {
    count
    next
    previous
    status
    message
    results {
      url
      name
      image
    }
  }
}
    `;
export const PokemonDoc = gql`
    query pokemon($name: String!) {
  pokemon(name: $name) {
    id
    name
    sprites {
      front_default
    }
    moves {
      move {
        name
      }
    }
    types {
      type {
        id
        name
        url
      }
    }
  }
}
    `;
export const pokemons = (
            options: Omit<
              WatchQueryOptions<PokemonsQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<PokemonsQuery> & {
              query: ObservableQuery<
                PokemonsQuery,
                PokemonsQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: PokemonsDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<PokemonsQuery> & {
                query: ObservableQuery<
                  PokemonsQuery,
                  PokemonsQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncpokemons = (
                options: Omit<
                  QueryOptions<PokemonsQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<PokemonsQuery>({query: PokemonsDoc, ...options})
              }
            
export const pokemon = (
            options: Omit<
              WatchQueryOptions<PokemonQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<PokemonQuery> & {
              query: ObservableQuery<
                PokemonQuery,
                PokemonQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: PokemonDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<PokemonQuery> & {
                query: ObservableQuery<
                  PokemonQuery,
                  PokemonQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        
              export const Asyncpokemon = (
                options: Omit<
                  QueryOptions<PokemonQueryVariables>,
                  "query"
                >
              ) => {
                return client.query<PokemonQuery>({query: PokemonDoc, ...options})
              }
            