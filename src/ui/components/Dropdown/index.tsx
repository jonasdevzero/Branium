"use client";
import { useRef, useState } from "react";
import "./styles.css";
import { MaterialSymbol } from "react-material-symbols";
import { useOutsideClick } from "@/ui/hooks";

export interface DropdownItem {
  icon?: React.ReactNode;
  label: string;
  onClick(): void;
}

interface Props {
  options: Array<DropdownItem>;
}

export function Dropdown({ options }: Props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  return (
    <div ref={ref} className="dropdown">
      <button
        type="button"
        className="dropdown__toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MaterialSymbol icon="more_vert" size={24} />
      </button>

      {isOpen && (
        <div className="dropdown__list">
          {options.map((option) => (
            <div
              key={option.label}
              className="dropdown__item"
              onClick={() => {
                setIsOpen(false);
                option.onClick();
              }}
            >
              {option.icon}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
