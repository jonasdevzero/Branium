import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { LoginUserController } from "@/api/presentation/controllers";

export const POST = adaptRoute(new LoginUserController());
