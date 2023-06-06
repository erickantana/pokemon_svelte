export interface IRepository<T> {
	get({ limit, offset }: { limit?: number; offset?: number }): Promise<T[]>;
	findById(id: string): Promise<T | null>;
}
