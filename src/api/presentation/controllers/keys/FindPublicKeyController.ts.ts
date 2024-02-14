import { services } from "@/api/services";
import { ApiError } from "@/domain/models";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class FindPublicKeyController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { userId } = httpRequest.params;

    let publicKey: string | null = null;

    try {
      const result = await services.keys.get<string>(`/public/${userId}`);
      publicKey = result.data;
    } catch (error) {
      const err = error as ApiError;

      if (err.statusCode !== 404) throw err;
    }

    return response.ok(publicKey);
  }
}
