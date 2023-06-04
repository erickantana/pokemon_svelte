import type { Type } from './type';

export type Pokemon = {
	name?: string | null | undefined;
	image?: string | null | undefined;
	url?: string | null | undefined;
	types?: (Type | null)[] | null | undefined;
};
