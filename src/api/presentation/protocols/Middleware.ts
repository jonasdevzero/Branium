import { HttpRequest } from './Http';

export interface Middleware {
	handle(httpRequest: HttpRequest): Promise<void>;
}
