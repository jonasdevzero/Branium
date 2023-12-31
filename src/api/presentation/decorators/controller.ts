import { response } from "../helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Middleware,
} from "../protocols";
import { kControllerMiddlewares } from "./middlewares";

type Class<T> = { new (...args: any[]): T };

export function controller() {
  return function decorator<T extends Class<Controller>>(
    constructor: T
  ): T | void {
    let middlewares: Middleware[] =
      (constructor as any)[kControllerMiddlewares] || [];

    class DecoratedController extends constructor {
      constructor(...args: any[]) {
        super(...args);
      }

      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        let httpResponse = {} as HttpResponse;

        try {
          for (const middleware of middlewares) {
            await middleware.handle(httpRequest);
          }

          httpResponse = await super.handle(httpRequest);
        } catch (error) {
          httpResponse = response.error(error as Error);
        }

        return httpResponse;
      }
    }

    return DecoratedController;
  };
}
