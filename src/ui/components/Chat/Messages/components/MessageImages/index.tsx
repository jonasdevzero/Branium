import Image from "next/image";
import "./styles.css";
import { MaterialSymbol } from "react-material-symbols";
import { useMessages } from "@/ui/hooks";

interface Props {
  images: File[];
}

export function MessageImages({ images }: Props) {
  const { selectFiles } = useMessages();

  if (!images.length) return null;

  return (
    <div className="message__images">
      {images.map((image, index, arr) => {
        if (index > 3 && arr.length > 4) return null;
        const url = URL.createObjectURL(image);

        return (
          <Image
            key={`${image.name}-${image.lastModified}`}
            width={200}
            height={200}
            src={url}
            alt={image.name}
            onLoad={() => URL.revokeObjectURL(url)}
            onClick={() => selectFiles(arr, index)}
          />
        );
      })}

      {images.length > 4 && (
        <button type="button" onClick={() => selectFiles(images, 3)}>
          <MaterialSymbol icon="add" size={40} color="#fff" />
        </button>
      )}
    </div>
  );
}
