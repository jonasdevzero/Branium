"use client";
import { Button } from "..";
import "./styles.css";

interface Props {
  id?: string;
  isOpen: boolean;
  close?: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ id, isOpen, close, title, children }: Props) {
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={close}></div>
      <div className="modal__container" id={id}>
        <div className="modal__header">
          <h4 className="header4">{title}</h4>

          {!!close && (
            <Button.Icon
              id="close-modal"
              icon="close"
              className="modal__close"
              onClick={close}
            />
          )}
        </div>

        <div className="modal__content">{children}</div>
      </div>
    </>
  );
}
