import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
	constructor(key: string) {
		super(`${key} not found`, 404);
	}
}
