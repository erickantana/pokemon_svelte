const TYPES = {
	PokemonRepository: Symbol('PokemonRepository'),
	PokemonDataSource: Symbol('PokemonDataSource'),
	PokeService: Symbol('PokeService'),
	TimeService: Symbol('TimeService'),
	ChanceService: Symbol('ChanceService'),
	PokeServiceFactory: Symbol('PokeServiceFactory'),
	UserRepository: Symbol('UserRepository'),
	UserDataSource: Symbol('UserDataSource'),
	Firestore: Symbol('Firestore'),
	PokemonCollectionDataSource: Symbol('PokemonCollectionDataSource'),
	PokemonCollectionRepository: Symbol('PokemonCollectionRepository'),
	CatchPokemonUseCase: Symbol('CatchPokemonUseCase'),
	GeneratePokeBallUseCase: Symbol('GeneratePokeBallUseCase')
};

export default TYPES;
