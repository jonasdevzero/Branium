import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { ResponseInviteController } from "@/api/presentation/controllers";

export const POST = adaptRoute(new ResponseInviteController());
