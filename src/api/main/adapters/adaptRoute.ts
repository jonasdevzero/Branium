import { Controller, HttpRequest } from "@/api/presentation/protocols";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

interface Params {
  params: Record<string, string>;
}

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, params: Params) => {
    const { method } = request;
    const headersList = headers();

    let query = new URLSearchParams();

    if (method.toLowerCase() === "get") {
      const { searchParams } = new URL(request.url);
      query = searchParams;
    }

    const httpRequest: HttpRequest = {
      body: {},
      query,
      params: params.params,
      user: { id: "" },
    };

    const contentType = headersList.get("Content-Type");

    const canLoadBody =
      contentType === "application/json" &&
      ["post", "put", "patch"].includes(method.toLowerCase());

    if (canLoadBody && request.body) {
      const readable = await request.body.getReader().read();

      const body = JSON.parse(readable.value?.toString() || "{}");

      Object.assign(httpRequest, { body });
    }

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      formData.forEach((value, key) => (httpRequest.body[key] = value));
    }

    const httpResponse = await controller.handle(httpRequest);

    const response = new NextResponse(
      typeof httpResponse.body !== "undefined"
        ? JSON.stringify(httpResponse.body)
        : null,
      { status: httpResponse.statusCode }
    );

    const responseHeaders = httpResponse.options?.headers || {};
    const responseCookies = httpResponse.options?.cookies || {};

    if (typeof httpResponse.body === "object") {
      responseHeaders["content-type"] = "application/json";
    }

    for (const [key, value] of Object.entries(responseHeaders)) {
      if (!value) continue;

      response.headers.set(key, value.toString());
    }

    for (const [key, value] of Object.entries(responseCookies)) {
      if (!value) continue;

      response.cookies.set(key, value.toString(), {
        secure: true,
        sameSite: true,
        path: "/",
      });
    }

    return response;
  };
};
