import { BaseError } from "@/api/presentation/errors";
import { HttpResponse, HttpResponseOptions } from "../protocols";

const ok = (body?: any, options?: HttpResponseOptions): HttpResponse => ({
  statusCode: 200,
  body,
  options: options,
});

const noContent = (): HttpResponse => ({
  statusCode: 204,
});

const created = (body?: any): HttpResponse => ({
  statusCode: 201,
  body,
});

const error = (error: Error): HttpResponse => {
  const err = error as BaseError;

  if (!err.statusCode) {
    return {
      statusCode: 500,
      body: {
        error: "InternalServerError",
        message: error.message,
      },
    };
  }

  return {
    statusCode: err.statusCode,
    body: {
      error: err.name,
      status: err.statusCode,
      message: err.message,
      meta: err.meta,
    },
  };
};

export const response = {
  ok,
  noContent,
  created,
  error,
};
