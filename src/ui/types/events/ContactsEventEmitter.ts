import { Contact } from "@/domain/models";
import { TypedEventEmitter } from "../TypedEventEmitter";
import { BlockContactDTO, EditedContactDTO } from "@/domain/dtos";

interface ListenerEvents {
  "contact:new": Contact;
  "contact:block": BlockContactDTO;
  "contact:edit": EditedContactDTO;
}

interface EmitterEvents {
  "contact:new": [Contact];
  "contact:block": [BlockContactDTO];
  "contact:edit": [EditedContactDTO];
}

export interface ContactsEventEmitter
  extends TypedEventEmitter<ListenerEvents, EmitterEvents> {}
