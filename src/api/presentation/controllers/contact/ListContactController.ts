import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class ListContactController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const userId = httpRequest.user.id;
    const { query } = httpRequest;

    const url = `/contact/${userId}?${query.toString()}`;

    const { data } = await services.messages.get(url);

    return response.ok(data);
  }
}
