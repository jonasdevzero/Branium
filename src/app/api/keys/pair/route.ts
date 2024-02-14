import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { GetKeyPairController } from "@/api/presentation/controllers";

export const POST = adaptRoute(new GetKeyPairController());
