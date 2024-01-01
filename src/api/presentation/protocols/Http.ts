export interface HttpRequest {
  body?: any;
  files: Record<string, Blob[]>;
  user: {
    id: string;
  };
}

export interface HttpResponse {
  body?: any;
  statusCode: number;
}

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
