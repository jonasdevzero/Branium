import { FiSearch } from 'react-icons/fi';
import { RoomType } from '../../@types/settings';
import { Container } from './styles';

interface Props {
  currentRoomType: RoomType;
}

const headerTitle = {
  CONTACT: 'Contacts',
  GROUP: 'Groups',
};

export const Rooms: React.FC<Props> = ({ currentRoomType }) => {
  return (
    <Container>
      <header className="rooms__header">
        <span>{headerTitle[currentRoomType]}</span>
      </header>

      <form className="rooms__search">
        <label htmlFor="room-search">
          <input id="room-search" type="text" placeholder="Search" />
          <FiSearch />
        </label>
      </form>

      <nav className="rooms__inner">
        <button type="button" className="rooms__room">
          <div className="room__image" />
          <span className="room__name">devone</span>
        </button>

        <button type="button" className="rooms__room">
          <div className="room__image" />
          <span className="room__name">devtwo</span>
        </button>

        <button type="button" className="rooms__room">
          <div className="room__image" />
          <span className="room__name">devthree</span>
        </button>
      </nav>
    </Container>
  );
};
