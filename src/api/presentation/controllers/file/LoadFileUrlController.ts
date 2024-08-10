import { messagesApi } from "@/api/services/messagesApi";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class LoadFileUrlController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { key } = httpRequest.params;

    const result = await messagesApi.get<string>(`/file/${key}`);

    return response.ok(result.data);
  }
}
