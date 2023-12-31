import { BaseError } from './BaseError';

export class NotAuthorizedError extends BaseError {
	constructor(message: string) {
		super(message, 403);
	}
}
