import "./styles.css";
import Image from "next/image";
import { MaterialSymbol } from "react-material-symbols";

type FileType = "image";

interface Props {
  close(): void;
  files: Array<{
    url: string;
    type: FileType;
  }>;
}

export const MediaViewer: React.FC<Props> = ({ close, files }) => {
  return (
    <div className="media__container">
      <button
        type="button"
        className="media__close icon__button"
        onClick={close}
      >
        <MaterialSymbol icon="close" size={32} color="#fff" />
      </button>

      {files.map((file) => {
        return (
          <Image
            key={file.url}
            src={file.url}
            layout="fill"
            unoptimized
            alt="file"
          />
        );
      })}
    </div>
  );
};
