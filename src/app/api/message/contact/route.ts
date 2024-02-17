import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { CreateContactMessageController } from "@/api/presentation/controllers/message";

export const POST = adaptRoute(new CreateContactMessageController());
