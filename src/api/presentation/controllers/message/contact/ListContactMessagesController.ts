import { controller, middlewares } from "@/api/presentation/decorators";
import { response } from "@/api/presentation/helpers";
import { EnsureAuthenticated } from "@/api/presentation/middlewares";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/api/presentation/protocols";
import { messagesApi } from "@/api/services/messagesApi";

@controller()
@middlewares(EnsureAuthenticated)
export class ListContactMessagesController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.user;
    const { contactId } = httpRequest.params;
    const query = httpRequest.query;

    const result = await messagesApi.get(
      `/message/contact/${id}/${contactId}?${query}`
    );

    return response.ok(result.data);
  }
}
