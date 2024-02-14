import { Fetch } from "@/ui/utils";

export async function findPublicKey(userId: string) {
  return await Fetch.get<string | null>(`/api/keys/public/${userId}2`);
}
