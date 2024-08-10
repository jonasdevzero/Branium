import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { EditUserController } from "@/api/presentation/controllers";

export const PUT = adaptRoute(new EditUserController());
