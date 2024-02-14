"client-only";
import { ApiError } from "@/domain/models";
import { toast } from "../modules";

type FetchMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type FetchBody = string | Object | FormData | null;
type FetchHeaders = Record<string, string>;

export class Fetch {
  static async request<R extends unknown>(
    method: FetchMethod,
    path: string,
    body?: FetchBody,
    headers: FetchHeaders = {}
  ): Promise<R> {
    const contentType = this.getContentType(body);

    const parsedBody =
      contentType === "application/json"
        ? JSON.stringify(body)
        : (body as string);

    if (!!contentType) headers["Content-Type"] = contentType;

    const response = await fetch(path, {
      method,
      body: parsedBody,
      headers,
    });

    if (!response.ok) {
      const error = (await response.json()) as ApiError;
      this.treatError(error);
    }

    return this.treatResponse(response);
  }

  private static getContentType(body?: FetchBody): string | undefined {
    if (typeof body === "string") return "text/plain";

    const isFormData = body instanceof FormData;

    if (typeof body === "object" && !isFormData) return "application/json";

    if (isFormData) return "multipart/form-data";

    return undefined;
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
    body?: FetchBody,
    headers?: FetchHeaders
  ) {
    return this.request<R>("GET", path, body, headers);
  }

  static post<R extends unknown>(
    path: string,
    body?: FetchBody,
    headers?: FetchHeaders
  ) {
    return this.request<R>("POST", path, body, headers);
  }

  static put<R extends unknown>(
    path: string,
    body?: FetchBody,
    headers?: FetchHeaders
  ) {
    return this.request<R>("PUT", path, body, headers);
  }

  static patch<R extends unknown>(
    path: string,
    body?: FetchBody,
    headers?: FetchHeaders
  ) {
    return this.request<R>("PATCH", path, body, headers);
  }

  static delete<R extends unknown>(
    path: string,
    body?: FetchBody,
    headers?: FetchHeaders
  ) {
    return this.request<R>("DELETE", path, body, headers);
  }
}
