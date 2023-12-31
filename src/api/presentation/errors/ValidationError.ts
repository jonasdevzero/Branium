import { BaseError } from './BaseError';

export class ValidationError extends BaseError {
	constructor(meta: Array<unknown>) {
		super('Validation error', 400, meta);
	}
}
