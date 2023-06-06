import { ApolloClient, InMemoryCache } from '@apollo/client/core';

export default new ApolloClient({
	uri: 'https://graphql-pokeapi.vercel.app/api/graphql',
	cache: new InMemoryCache()
});
