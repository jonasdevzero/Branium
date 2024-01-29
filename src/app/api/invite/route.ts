import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import {
  CreateInviteController,
  ListInviteController,
} from "@/api/presentation/controllers";

export const GET = adaptRoute(new ListInviteController());

export const POST = adaptRoute(new CreateInviteController());
