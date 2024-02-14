import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { FindPublicKeyController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new FindPublicKeyController());
