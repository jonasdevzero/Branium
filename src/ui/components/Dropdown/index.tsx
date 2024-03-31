"use client";
import { useOutsideClick } from "@/ui/hooks";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
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
  position: {
    containerId?: string;
    horizontalAxis: Array<"left" | "right">;
    verticalAxis: Array<"top" | "bottom">;
  };
}

export function Dropdown({ icon, options, position }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  const setPosition = useCallback(() => {
    if (!ref.current || !dropdownRef.current) return;

    let containerRect = {
      top: 0,
      left: 0,
      bottom: window.innerHeight,
      right: window.innerWidth,
    };

    const { containerId, horizontalAxis, verticalAxis } = position;

    const spaceGap = 4;
    const buttonRect = ref.current.getBoundingClientRect();
    const container = containerId ? document.getElementById(containerId) : null;

    if (container) containerRect = container.getBoundingClientRect();

    const { width: dropdownWidth, height: dropdownHeight } =
      dropdownRef.current.getBoundingClientRect();

    const bottomSpace =
      containerRect.bottom - buttonRect.bottom - spaceGap >= dropdownHeight;

    const topSpace = buttonRect.top - containerRect.top >= dropdownHeight;

    const rightSpace = containerRect.right - buttonRect.right >= dropdownWidth;

    const leftSpace = buttonRect.left - containerRect.left >= dropdownWidth;

    let style: Record<string, unknown> = {};

    for (const position of horizontalAxis) {
      if (position === "left" && leftSpace) {
        style.left = `${buttonRect.left - dropdownWidth + buttonRect.width}px`;

        break;
      }

      if (position === "right" && rightSpace) {
        style.left = `${buttonRect.right - buttonRect.width}px`;
        break;
      }
    }

    for (const position of verticalAxis) {
      if (position === "top" && topSpace) {
        style.top = `${buttonRect.top - dropdownHeight}px`;
        break;
      }

      if (position === "bottom" && bottomSpace) {
        style.top = `${buttonRect.bottom}px`;
        break;
      }
    }

    setDropdownStyle(style);
  }, [position]);

  useLayoutEffect(() => {
    setPosition();
  }, [isOpen, setPosition]);

  useLayoutEffect(() => {
    window.addEventListener("resize", setPosition);

    return () => {
      window.removeEventListener("resize", setPosition);
    };
  }, [setPosition]);

  return (
    <div ref={ref} className="dropdown">
      <Button.Icon
        className="dropdown__toggle"
        onClick={() => setIsOpen(!isOpen)}
        icon="more_vert"
      >
        {icon}
      </Button.Icon>

      <div
        ref={dropdownRef}
        className={`dropdown__list${isOpen ? " dropdown__list--open" : ""}`}
        style={dropdownStyle}
      >
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
    </div>
  );
}
