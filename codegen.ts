import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'https://graphql-pokeapi.vercel.app/api/graphql',
	documents: './src/**/*.gql',
	generates: {
		'./src/graphql/generated.ts': {
			plugins: ['typescript', 'typescript-operations', 'graphql-codegen-svelte-apollo'],
			config: {
				clientPath: '../core/graphql_client',
				asyncQuery: true
			}
		}
	}
};
export default config;
