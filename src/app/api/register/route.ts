import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { RegisterUserController } from "@/api/presentation/controllers";

export const POST = adaptRoute(new RegisterUserController());
