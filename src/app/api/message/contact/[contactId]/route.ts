import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { ListContactMessagesController } from "@/api/presentation/controllers/message";

export const GET = adaptRoute(new ListContactMessagesController());
