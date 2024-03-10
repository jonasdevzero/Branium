"use client";
import { useOutsideClick } from "@/ui/hooks";
import { useRef, useState } from "react";
import { Button } from "..";
import "./styles.css";

export interface DropdownItem {
  icon?: React.ReactNode;
  label: string;
  onClick(): void;
}

interface Props {
  icon?: React.ReactNode;
  options: Array<DropdownItem>;
}

export function Dropdown({ icon, options }: Props) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  return (
    <div ref={ref} className="dropdown">
      <Button.Icon
        className="dropdown__toggle"
        onClick={() => setIsOpen(!isOpen)}
        icon="more_vert"
      >
        {icon}
      </Button.Icon>

      {isOpen && (
        <div className="dropdown__list">
          {options.map((option) => (
            <div
              key={option.label}
              className="dropdown__item text"
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
