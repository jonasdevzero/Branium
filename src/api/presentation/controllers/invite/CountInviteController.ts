import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class CountInviteController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const userId = httpRequest.user.id;

    const url = `/invite/${userId}/count`;

    const { data } = await services.messages.get<number>(url);

    return response.ok(data);
  }
}
