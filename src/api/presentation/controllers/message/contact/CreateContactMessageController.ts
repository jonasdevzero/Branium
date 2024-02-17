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
export class CreateContactMessageController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body;
    const { id } = httpRequest.user;

    Object.assign(data, { "sender.id": id });

    const formData = new FormData();

    Object.entries(data).map(([key, value]) =>
      formData.append(key, String(value))
    );

    await messagesApi.post("/message/contact", formData);

    return response.created();
  }
}
