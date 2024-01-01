import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { FinishRegisterController } from "@/api/presentation/controllers";

export const POST = adaptRoute(new FinishRegisterController());
