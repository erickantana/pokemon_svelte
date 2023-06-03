export interface IRepository<T> {
	get(): Promise<T[]>;
	findById(id: string): Promise<T | null>;
}
