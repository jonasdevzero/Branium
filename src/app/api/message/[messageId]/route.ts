import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import {
  DeleteMessageController,
  EditMessageController,
} from "@/api/presentation/controllers/message";

export const PATCH = adaptRoute(new EditMessageController());

export const DELETE = adaptRoute(new DeleteMessageController());
