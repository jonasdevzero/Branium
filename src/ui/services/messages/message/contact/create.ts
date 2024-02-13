import { CreateContactMessageDTO } from "@/domain/dtos";
import { createNestedFormData } from "@/ui/helpers";

export async function createContactMessage(data: CreateContactMessageDTO) {
  const formData = createNestedFormData(data);

  const response = await fetch("/api/message/contact", {
    body: formData,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (!response.ok) throw await response.json();
}
