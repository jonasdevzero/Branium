import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class ListUsersController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.user;
    const { query } = httpRequest;

    const { data } = await services.messages.get(
      `/profile/list/${id}?${query.toString()}`
    );

    return response.ok(data);
  }
}
