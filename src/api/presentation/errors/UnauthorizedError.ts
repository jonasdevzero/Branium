import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
	constructor(message?: string) {
		super(message || 'Unauthorized', 401);
	}
}
