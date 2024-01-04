import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { AuthUserController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new AuthUserController());
