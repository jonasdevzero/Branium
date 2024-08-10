import { adaptRoute } from "@/api/main/adapters/adaptRoute";
import { ListUsersController } from "@/api/presentation/controllers";

export const GET = adaptRoute(new ListUsersController());
