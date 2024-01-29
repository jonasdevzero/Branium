import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class ResponseInviteController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.user;
    const data = httpRequest.body;

    Object.assign(data, { profileId: id });

    await services.messages.post("/invite/response", data);

    return response.noContent();
  }
}
