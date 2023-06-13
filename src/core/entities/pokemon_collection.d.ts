export type EvolutionStage = {
	name: string;
	levelThreshold: number;
};

export type PokemonCollection = {
	name: string;
	evolutionStages: EvolutionStage[];
	obtainedAt: Date;
	level: number;
};
