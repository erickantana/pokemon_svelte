export type TimeStepMetaData = {
	stepCount: number;
	maxThresholdDate: Date;
};

export interface ITimeService {
	getTimeStep(start: Date, end: Date, stepWidth: number): TimeStepMetaData;
}
