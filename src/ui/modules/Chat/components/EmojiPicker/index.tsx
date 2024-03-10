import { Button } from "@/ui/components";
import { useOutsideClick } from "@/ui/hooks";
import Picker, { Categories, Theme } from "emoji-picker-react";
import { useRef, useState } from "react";
import "./styles.css";

interface Props {
  onPick(emoji: string): void;
}

export function EmojiPicker({ onPick }: Props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="emoji__picker">
      <Button.Icon icon="mood" onClick={() => setIsOpen(!isOpen)} />

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
