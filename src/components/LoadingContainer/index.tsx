import { VscLoading } from 'react-icons/vsc';

import { Container } from './styles';

export const LoadingContainer: React.FC = () => {
  return (
    <Container>
      <h2 className="loading__title">Branium</h2>
      <span className="loading__load">
        <VscLoading />
      </span>
    </Container>
  );
};
