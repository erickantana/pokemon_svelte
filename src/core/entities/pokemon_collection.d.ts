export type EvolutionStage = {
	name: string;
	levelThreshold: number;
};

export type PokemonCollection = {
	name: string;
	evolutionStages: EvolutionStage[]; // Represents pokemon evolution stage, its current stage will be the last element of this array
	obtainedAt: Date;
	level: number;
};
