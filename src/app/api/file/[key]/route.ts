import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { LoadFileUrlController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new LoadFileUrlController());
