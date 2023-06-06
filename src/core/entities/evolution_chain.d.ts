export type EvolutionChain = {
	id?: int | null;
	evolveTo?: EvolutionChain[] | null;
	speciesName?: string | null;
	speciesUrl?: string | null;
};
