import { Controller, HttpRequest } from "@/api/presentation/protocols";
import { headers } from "next/headers";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request) => {
    const { method } = request;
    const headersList = headers();

    const httpRequest: HttpRequest = {
      body: {},
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

    const response = new Response(
      httpResponse.body ? JSON.stringify(httpResponse.body) : null,
      { status: httpResponse.statusCode }
    );

    return response;
  };
};
