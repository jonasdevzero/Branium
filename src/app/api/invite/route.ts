import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { CreateInviteController } from "@/api/presentation/controllers";

export const POST = adaptRoute(new CreateInviteController());
