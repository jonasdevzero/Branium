import { OutgoingHttpHeaders } from "http";

export interface HttpRequest {
  body?: any;
  query: URLSearchParams;
  params: Record<string, string>;
  user: {
    id: string;
  };
}

export interface HttpResponseOptions {
  headers?: OutgoingHttpHeaders;
  cookies?: Record<string, string>;
}

export interface HttpResponse {
  body?: any;
  statusCode: number;
  options?: HttpResponseOptions;
}

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
