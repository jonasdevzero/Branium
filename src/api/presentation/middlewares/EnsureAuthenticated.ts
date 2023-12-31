import { HttpRequest, Middleware } from "../protocols";

export class EnsureAuthenticated implements Middleware {
  constructor() {}

  async handle(httpRequest: HttpRequest): Promise<void> {
    // ...
  }
}
