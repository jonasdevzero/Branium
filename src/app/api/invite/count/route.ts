import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { CountInviteController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new CountInviteController());
