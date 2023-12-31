import { Controller, Middleware } from "../protocols";

type Class<T> = { new (...args: any[]): T };

export const kControllerMiddlewares = Symbol("controller.middlewares");

export function middlewares(...middlewares: Array<Class<Middleware>>) {
  const middlewareInstances = middlewares.map((key) => {
    const instance = new key();

    if (!instance) {
      throw new Error(`Middleware not found: ${key}`);
    }

    return instance;
  });

  return function decorator<T extends Class<Controller>>(
    constructor: T
  ): T | void {
    (constructor as any)[kControllerMiddlewares] = middlewareInstances;
    return constructor;
  };
}
