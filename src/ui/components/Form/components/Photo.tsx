"use client";
import { toast } from "@/ui/modules";
import Image from "next/image";
import React, { useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

interface PhotoInputProps {
  field: string;
  name: string;
  onSelect(photo?: File): void;
}

const supportedImages = ["image/png", "image/jpg", "image/jpeg"];
const maxSize = 2 * 1024 * 1024; // 2 MB

export const FormPhoto = React.forwardRef<HTMLLabelElement, PhotoInputProps>(
  (props, ref) => {
    const [preview, setPreview] = useState<string>();
    const { onSelect } = props;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return onSelect(undefined);

      const image = files.item(0);
      if (!image) return onSelect(undefined);

      if (!supportedImages.includes(image.type)) {
        toast.info("Formato de arquivo inválido");
        return onSelect(undefined);
      }

      if (image.size > maxSize) {
        toast.info("Arquivo muito grande, máximo: 2MB");
        return onSelect(undefined);
      }

      onSelect(image);
      const url = URL.createObjectURL(image);
      setPreview(url);
    };

    const removePhoto = () => {
      setPreview(undefined);
      onSelect(undefined);
    };

    return (
      <label ref={ref} htmlFor={props.name}>
        {props.field}
        <input
          id={props.name}
          onChange={onChange}
          type="file"
          accept=".png,.jpg,.jpeg"
          hidden
        />

        <div className="photo__wrapper">
          <div className="photo__container">
            {!preview && <MaterialSymbol icon="upload" size={32} />}
            {!!preview && (
              <Image
                src={preview}
                fill
                alt="foto"
                onLoad={() => URL.revokeObjectURL(preview)}
              />
            )}

            {!!preview && (
              <button
                type="button"
                className="button remove__photo"
                onClick={removePhoto}
              >
                <MaterialSymbol icon="close" size={16} />
              </button>
            )}
          </div>
        </div>
      </label>
    );
  }
);

FormPhoto.displayName = "FormPhoto";
