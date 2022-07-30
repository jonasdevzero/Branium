import Link from 'next/link';

import { Container } from './styles';

interface Props {
  isLoginHidden?: boolean;
}

export const Header: React.FC<Props> = ({ isLoginHidden = false }) => {
  return (
    <Container>
      <Link href="/">
        <a className="header__title">Branium</a>
      </Link>

      {!isLoginHidden && (
        <Link href="/login">
          <a className="header__login">SignIn</a>
        </Link>
      )}
    </Container>
  );
};
