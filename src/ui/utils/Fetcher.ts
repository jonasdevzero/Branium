"client-only";
import { ApiError } from "@/domain/models";
import { toast } from "../modules";

type FetcherMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type FetcherBody = string | Object | FormData | null;
type FetcherHeaders = Record<string, string>;

export class Fetcher {
  static async request<R extends unknown>(
    method: FetcherMethod,
    path: string,
    body?: FetcherBody,
    headers?: FetcherHeaders
  ): Promise<R> {
    let contentType = "text/plain";
    let parsedBody: string | FormData | null = null;

    const isFormData = body instanceof FormData;

    if (typeof body === "string") parsedBody = body;

    if (typeof body === "object" && !isFormData) {
      contentType = "application/json";
      parsedBody = JSON.stringify(body);
    }

    if (isFormData) {
      contentType = "multipart/form-data";
      parsedBody = body;
    }

    const response = await fetch(path, {
      method,
      body: parsedBody,
      headers: { "Content-Type": contentType, ...headers },
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      this.treatError(error);
    }

    return this.treatResponse(response);
  }

  private static treatError(error: ApiError) {
    if (error.statusCode === 500) {
      toast.error(
        "Parece que houve algum problema, tente novamente em instantes!",
        {
          id: "server-error",
        }
      );
    }

    throw error;
  }

  private static treatResponse(response: Response) {
    if (response.body === null) return;

    const contentType = response.headers.get("content-type");

    if (!contentType) return response.body;

    const type = contentType.split(";")[0];

    if (type === "application/json") return response.json();
    if (type === "text/plain") return response.text();

    return response.body;
  }

  static get<R extends unknown>(
    path: string,
    body?: FetcherBody,
    headers?: FetcherHeaders
  ) {
    return this.request<R>("GET", path, body, headers);
  }

  static post<R extends unknown>(
    path: string,
    body?: FetcherBody,
    headers?: FetcherHeaders
  ) {
    return this.request<R>("POST", path, body, headers);
  }

  static put<R extends unknown>(
    path: string,
    body?: FetcherBody,
    headers?: FetcherHeaders
  ) {
    return this.request<R>("PUT", path, body, headers);
  }

  static patch<R extends unknown>(
    path: string,
    body?: FetcherBody,
    headers?: FetcherHeaders
  ) {
    return this.request<R>("PATCH", path, body, headers);
  }

  static delete<R extends unknown>(
    path: string,
    body?: FetcherBody,
    headers?: FetcherHeaders
  ) {
    return this.request<R>("DELETE", path, body, headers);
  }
}
