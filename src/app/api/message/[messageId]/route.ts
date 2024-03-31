import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { DeleteMessageController } from "@/api/presentation/controllers/message";

export const DELETE = adaptRoute(new DeleteMessageController());
