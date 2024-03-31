import { messagesApi } from "@/api/services/messagesApi";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class DeleteMessageController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.user;
    const { messageId } = httpRequest.params;

    await messagesApi.delete(`/message/${id}/${messageId}`);

    return response.noContent();
  }
}
