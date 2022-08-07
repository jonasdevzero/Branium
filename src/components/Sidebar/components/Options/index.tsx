import { useAuth } from '@/hooks/useAuth';
import { FiLogOut, FiPlus, FiSettings, FiUser, FiUsers } from 'react-icons/fi';
import { RoomType, UpdateSettings } from '../../@types/settings';

import { Container } from './styles';

interface Props {
  currentRoomType: RoomType;
  updateSettings: UpdateSettings;
}

export const Options: React.FC<Props> = ({
  currentRoomType,
  updateSettings,
}) => {
  const { signOut } = useAuth();

  function selectRoomOption(type: RoomType) {
    return () => updateSettings((s) => ({ ...s, currentRoomType: type }));
  }

  return (
    <Container>
      <div className="sidebar__profile" />

      <div className="options__inner">
        <button
          type="button"
          className={`
            sidebar__option
            room__option
            ${currentRoomType === 'CONTACT' && 'option__selected'}
          `}
          onClick={selectRoomOption('CONTACT')}
        >
          <FiUser />
        </button>

        <button
          type="button"
          className={`
            sidebar__option
            room__option
            ${currentRoomType === 'GROUP' && 'option__selected'}
          `}
          onClick={selectRoomOption('GROUP')}
        >
          <FiUsers />
        </button>

        <button type="button" className="sidebar__option">
          <FiPlus />
        </button>
      </div>

      <div className="account__options">
        <button type="button" className="sidebar__option">
          <FiSettings />
        </button>

        <button
          type="button"
          className="sidebar__option"
          onClick={() => signOut()}
        >
          <FiLogOut />
        </button>
      </div>
    </Container>
  );
};
