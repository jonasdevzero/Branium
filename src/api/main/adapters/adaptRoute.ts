import { Controller, HttpRequest } from "@/api/presentation/protocols";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request) => {
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
      files: {},
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
      const files: Record<string, Blob[]> = {};

      formData.forEach((value, key) => {
        if (value instanceof File) {
          files[key] ? files[key].push(value) : (files[key] = [value]);
          return;
        }
        httpRequest.body[key] = value;
      });

      Object.assign(httpRequest, { files });
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
