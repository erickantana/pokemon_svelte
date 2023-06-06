import type { EvolutionChain } from './evolution_chain';
import type { Sprite } from './sprite';
import type { Type } from './type';

export type Pokemon = {
	id?: number | null;
	name?: string | null;
	image?: string | null;
	url?: string | null;
	types?: (Type | null)[] | null;
	sprites?: Sprite | null;
	height?: number | null;
	weight?: number | null;
	evolutionChain?: EvolutionChain | null;
};
