import { services } from "@/api/services";
import { controller, middlewares } from "../../decorators";
import { response } from "../../helpers";
import { EnsureAuthenticated } from "../../middlewares";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

@controller()
@middlewares(EnsureAuthenticated)
export class EditContactController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const userId = httpRequest.user.id;
    const { contactId } = httpRequest.params;
    const data = httpRequest.body;

    Object.assign(data, { profileId: userId, contactId });

    await services.messages.put("/contact", data);

    return response.noContent();
  }
}
