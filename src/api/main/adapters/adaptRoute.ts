import { Controller, HttpRequest } from "@/api/presentation/protocols";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Record<string, string>;
}

export const adaptRoute = (controller: Controller) => {
  return async (request: NextRequest, params: Params) => {
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
      const body = await request.json();

      Object.assign(httpRequest, { body });
    }

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();

      formData.forEach((value, key) => (httpRequest.body[key] = value));
    }

    const httpResponse = await controller.handle(httpRequest);

    let responseBody = null;

    if (
      typeof httpResponse.body === "string" ||
      typeof httpResponse.body === "number"
    )
      responseBody = String(httpResponse.body);

    if (typeof httpResponse.body === "object")
      responseBody = JSON.stringify(httpResponse.body);

    const response = new NextResponse(responseBody, {
      status: httpResponse.statusCode,
    });

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
