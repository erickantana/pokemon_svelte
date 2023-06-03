export interface IDataSource<T> {
	get(): Promise<T[]>;
	findById(id: string): Promise<T | null>;
}
