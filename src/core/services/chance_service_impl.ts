import { injectable } from 'inversify';
import type { IChanceService } from './chance_service';

@injectable()
export class ChanceServiceImpl implements IChanceService {
	run(percentage: number): boolean {
		return percentage / 100 >= Math.random();
	}
}
