import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import {
  EditContactController,
  LoadContactController,
} from "@/api/presentation/controllers";

export const GET = adaptRoute(new LoadContactController());

export const PUT = adaptRoute(new EditContactController());
