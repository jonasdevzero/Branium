import { services } from "@/api/services";
import { controller } from "../../decorators";
import { response } from "../../helpers";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { ApiError, Authentication, KeyPair } from "@/domain/models";
import { InternalServerError } from "../../errors";

@controller()
export class LoginUserController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { username, password } = httpRequest.body;

    const res = await services.auth.post<Authentication>("/login", {
      username,
      password,
    });

    const { access, refresh } = res.data;

    const { data: userId } = await services.auth.get<string>("/auth/verify", {
      headers: { Authorization: `Bearer ${access}` },
    });

    const keyPair = await this.getKeyPair(userId, password);

    return response.ok(keyPair, {
      cookies: { access, refresh },
    });
  }

  private async getKeyPair(userId: string, password: string) {
    let keyPair: KeyPair;

    const token = Buffer.from(`${userId}:${password}`, "utf-8").toString(
      "base64"
    );

    try {
      const { data } = await services.keys.get<KeyPair>("/", {
        headers: { Authorization: `Basic ${token}` },
      });

      keyPair = data;
    } catch (e) {
      const error = e as ApiError;

      if (error.message !== "key pair not found")
        throw new InternalServerError("get key pair");

      const { data } = await services.keys.post<KeyPair>("/generate", {
        userId,
        password,
      });

      keyPair = data;
    }

    return keyPair;
  }
}
