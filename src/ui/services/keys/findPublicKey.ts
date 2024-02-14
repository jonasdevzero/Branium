import { Fetcher } from "@/ui/utils";

export async function findPublicKeyService(userId: string) {
  return await Fetcher.get<string | null>(`/api/keys/public/${userId}2`);
}
