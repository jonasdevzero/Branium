"use client";

import { Button } from "@/ui/components";
import { getSizeName } from "@/ui/helpers";
import "./styles.css";
import { downloadFile } from "@/ui/modules/Chat/helpers";

interface Props {
  file: File;
  download?: boolean;
}

export function Document({ file, download = false }: Props) {
  const ext = file.name.split(".").slice(-1)[0];

  return (
    <div className="document__container">
      <span className="document__name" title={file.name}>
        {file.name}
      </span>

      <div className="document__info">
        <span className="document__ext description">Arquivo: .{ext}</span>

        <span className="document__size description">
          Tamanho: {getSizeName(file.size)}
        </span>
      </div>

      {download && (
        <Button.Icon
          icon="download"
          className="document__download"
          onClick={() => downloadFile(file)}
        />
      )}
    </div>
  );
}
