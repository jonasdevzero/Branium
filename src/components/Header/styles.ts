import styled from 'styled-components';

export const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 9.5rem;
  max-height: 9.5rem;

  padding: 3rem 3.5rem;

  .header__title {
    font-size: 3rem;
    font-weight: 500;

    cursor: pointer;
  }

  .header__login {
    font-size: 1.75rem;

    transition: opacity 0.2s ease-in;
    cursor: pointer;
  }

  .header__login:hover {
    opacity: 0.9;
  }

  @media (max-width: 1120px) {
    .header__title {
      font-size: 2.5rem;
    }

    .header__login {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 860px) {
    min-height: 7rem;
    max-height: 7rem;

    padding: 2rem;
  }

  @media (max-width: 400px) {
    .header__title {
      font-size: 2rem;
    }

    .header__login {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 350px) {
    min-height: 4.5rem;
    max-height: 4.5rem;

    padding: 1rem;
  }
`;
