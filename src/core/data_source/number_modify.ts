import { increment, type FieldValue } from 'firebase/firestore';
import { NumberModifier } from './number_modifier';

export function isNumberModify(obj: unknown): obj is NumberModify {
	return (
		Object.prototype.hasOwnProperty.call(obj, 'value') &&
		Object.prototype.hasOwnProperty.call(obj, 'modifier')
	);
}

export type NumberModify = {
	value: number;
	modifier: NumberModifier;
};

export function numberModifyToFieldValue(modify: NumberModify): FieldValue {
	switch (modify.modifier) {
		case NumberModifier.increment:
			return increment(modify.value);

		case NumberModifier.decrement:
			return increment(modify.value * -1);

		default:
			throw new Error('Invalid Modifier');
	}
}
