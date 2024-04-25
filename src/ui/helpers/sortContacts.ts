import { Contact } from "@/domain/models";
import { getTime, sleep } from "@/ui/helpers";
import { Dispatch, SetStateAction } from "react";

interface SortContactsProps {
  contacts: Contact[];
  setContacts: Dispatch<SetStateAction<Contact[]>>;
}

export async function sortContacts(data: SortContactsProps) {
  const { contacts, setContacts } = data;

  const copy = [...contacts.reduce(removeDuplicated, [] as Contact[])];
  const n = copy.length;

  setContacts(copy);

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      const contactA = copy[j];
      const contactB = copy[j + 1];

      const lastUpdateA = getTime(contactA.lastUpdate);
      const lastUpdateB = getTime(contactB.lastUpdate);

      if (lastUpdateA < lastUpdateB) {
        [copy[j], copy[j + 1]] = [copy[j + 1], copy[j]];
        setContacts([...copy]);
        await sleep(200);
      }
    }
  }
}

function removeDuplicated(contacts: Contact[], contact: Contact) {
  const hasContact = contacts.some((m) => m.id === contact.id);
  !hasContact ? contacts.push(contact) : null;

  return contacts;
}
