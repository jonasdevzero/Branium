import { messagesApi } from "@/api/services/messagesApi";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class EditMessageController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.user;
    const { messageId } = httpRequest.params;
    const data = httpRequest.body;

    await messagesApi.patch(`/message/${id}/${messageId}`, data);

    return response.noContent();
  }
}
