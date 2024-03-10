import { MaterialSymbol } from "react-material-symbols";
import "./styles.css";
import Picker, { Categories, Theme } from "emoji-picker-react";
import { useRef, useState } from "react";
import { useOutsideClick } from "@/ui/hooks";

interface Props {
  onPick(emoji: string): void;
}

export function EmojiPicker({ onPick }: Props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="emoji__picker">
      <button
        type="button"
        className="button icon__button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MaterialSymbol icon="mood" />
      </button>

      <Picker
        className="picker"
        open={isOpen}
        theme={Theme.DARK}
        onEmojiClick={(e) => onPick(e.emoji)}
        skinTonesDisabled
        categories={[
          {
            category: Categories.SUGGESTED,
            name: "Recentemente usado",
          },
          {
            category: Categories.SMILEYS_PEOPLE,
            name: "Smileys e pessoas",
          },
          {
            category: Categories.ANIMALS_NATURE,
            name: "Animais e natureza",
          },
          {
            category: Categories.FOOD_DRINK,
            name: "Comidas e bebidas",
          },
          {
            category: Categories.ACTIVITIES,
            name: "Atividades",
          },
          {
            category: Categories.TRAVEL_PLACES,
            name: "Viagens e lugares",
          },
          {
            category: Categories.OBJECTS,
            name: "Objetos",
          },
          {
            category: Categories.SYMBOLS,
            name: "Símbolos",
          },
          {
            category: Categories.FLAGS,
            name: "Bandeiras",
          },
        ]}
      />
    </div>
  );
}
