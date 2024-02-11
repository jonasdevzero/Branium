import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { LoadContactController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new LoadContactController());
