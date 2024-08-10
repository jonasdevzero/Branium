import { services } from "@/api/services";
import { cookies } from "next/headers";
import { UnauthorizedError } from "../errors";
import { HttpRequest, Middleware } from "../protocols";

export class EnsureAuthenticated implements Middleware {
  constructor() {}

  async handle(httpRequest: HttpRequest): Promise<void> {
    const token = cookies().get("access")?.value;

    if (!token) {
      throw new UnauthorizedError("Invalid token");
    }

    const { data: userId } = await services.auth.get<string>("/auth/verify", {
      headers: { Authorization: `Bearer ${token}` },
    });

    Object.assign(httpRequest.user, { id: userId });
  }
}
