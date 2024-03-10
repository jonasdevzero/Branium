import { MaterialSymbol } from "react-material-symbols";
import "./styles.css";

interface Props {
  id?: string;
  isOpen: boolean;
  close?: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({
  id,
  isOpen,
  close,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay" onClick={close}></div>
      <div className="modal__container" id={id}>
        <div className="modal__header">
          <h4 className="header4">{title}</h4>

          {!!close && (
            <button
              id="close-modal"
              className="button modal__close icon__button"
              type="button"
              onClick={close}
            >
              <MaterialSymbol icon="close" size={24} color="#fff" />
            </button>
          )}
        </div>

        <div className="modal__content">{children}</div>
      </div>
    </>
  );
};
