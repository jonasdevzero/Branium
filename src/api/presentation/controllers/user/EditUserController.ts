import { messagesApi } from "@/api/services/messagesApi";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { EnsureAuthenticated } from "../../middlewares";

@controller()
@middlewares(EnsureAuthenticated)
export class EditUserController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body;
    const { id } = httpRequest.user;

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) =>
      formData.append(key, value as string)
    );

    await messagesApi.put(`/profile/${id}`, formData);

    return response.ok();
  }
}
