import { response } from "@/api/presentation/helpers";
import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/api/presentation/protocols";
import { services } from "@/api/services";
import { controller } from "@/api/presentation/decorators";

@controller()
export class RegisterUserController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body;

    await services.auth.post("/register", data);

    return response.created();
  }
}
