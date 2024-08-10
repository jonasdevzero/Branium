import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { User } from "@/domain/models";

@controller()
@middlewares(EnsureAuthenticated)
export class AuthUserController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const userId = httpRequest.user.id;

    const { data: profile } = await services.messages.get<User>(
      `/profile/${userId}`
    );

    return response.ok(profile);
  }
}
