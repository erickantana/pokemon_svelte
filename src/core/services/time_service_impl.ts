import { injectable } from 'inversify';
import type { ITimeService, TimeStepMetaData } from './time_service';

@injectable()
export class TimeServiceImpl implements ITimeService {
	getTimeStep(start: Date, end: Date, stepWidth: number): TimeStepMetaData {
		const startMilliseconds = start.getTime();
		const endMilliseconds = end.getTime();

		const range = endMilliseconds - startMilliseconds;
		const stepCount = Math.floor(range / stepWidth);
		const remainingTime = range % stepWidth;
		const maxThresholdDate = new Date(endMilliseconds - remainingTime);

		return {
			maxThresholdDate: maxThresholdDate,
			stepCount: stepCount
		};
	}
}
