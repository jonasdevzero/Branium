import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { ListContactController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new ListContactController());
