import { Controller, HttpRequest } from "@/api/presentation/protocols";
import { headers } from "next/headers";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request) => {
    const { method } = request;
    const headersList = headers();

    const httpRequest: HttpRequest = {
      body: {},
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

    if (contentType === "multipart/form-data") {
      httpRequest.formData = await request.formData();
    }

    const httpResponse = await controller.handle(httpRequest);

    const response = new Response(
      httpResponse.body ? JSON.stringify(httpResponse.body) : null,
      { status: httpResponse.statusCode }
    );

    return response;
  };
};
