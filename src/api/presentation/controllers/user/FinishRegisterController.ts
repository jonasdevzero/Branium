import { controller } from "@/api/presentation/decorators";
import { response } from "@/api/presentation/helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/api/presentation/protocols";
import { services } from "@/api/services";

interface ValidateEmailResult {
  id: string;
  username: string;
}

@controller()
export class FinishRegisterController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { token, email, name } = httpRequest.body;
    const [image] = httpRequest.files?.image || [];

    const res = await services.auth.post<ValidateEmailResult>(
      "/register/validate-email",
      { token, email }
    );

    const { id, username } = res.data;

    const formData = new FormData();

    formData.append("id", id);
    formData.append("username", username);
    formData.append("name", name);
    image ? formData.append("image", image) : null;

    try {
      await services.messages.post("/profile", formData);
    } catch (e) {
      // ...
    }

    return response.ok();
  }
}
