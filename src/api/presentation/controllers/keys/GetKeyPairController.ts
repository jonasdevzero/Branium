import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { KeyPair } from "@/domain/models";

@controller()
@middlewares(EnsureAuthenticated)
export class GetKeyPairController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.user;
    const { password } = httpRequest.body;

    const token = Buffer.from(`${id}:${password}`, "utf-8").toString("base64");

    const result = await services.keys.get<KeyPair>("/", {
      headers: { Authorization: `Basic ${token}` },
    });

    return response.ok(result.data);
  }
}
