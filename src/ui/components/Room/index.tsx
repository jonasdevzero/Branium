import "./styles.css";
import { Avatar, AvatarType } from "../";

interface Props {
  name: string;
  username?: string;
  image?: string | null;
  type?: AvatarType;
}

export const Room: React.FC<Props> = ({ name, username, image, type }) => {
  return (
    <div className="room__container">
      <Avatar type={type} name={name} url={image} alt={`${name} imagem`} />

      <div className="room__info text">
        <span className="text room__name" title={name}>
          {name}
        </span>

        {!!username && (
          <span className="description room__username" title={`@${username}`}>
            @{username}
          </span>
        )}
      </div>
    </div>
  );
};
