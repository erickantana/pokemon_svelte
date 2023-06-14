export interface UseCase<T, U> {
	call(param: T): Promise<U>;
}
