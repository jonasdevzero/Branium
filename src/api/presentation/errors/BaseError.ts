export class BaseError extends Error {
	statusCode: number;
	meta: Array<unknown>;

	constructor(message: string, statusCode: number, meta: Array<unknown> = []) {
		super();
		this.name = this.constructor.name;
		this.message = message;
		this.statusCode = statusCode;
		this.meta = meta;
	}
}
