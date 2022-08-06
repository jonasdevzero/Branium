import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;

  color: ${({ theme }) => theme.textColor};

  background-color: ${({ theme }) => theme.backgroundColor};

  @media (min-width: 1950px) {
    padding: 0 12%;
  }

  @media (min-width: 2100px) {
    padding: 0 18%;
  }
`;

export const Main = styled.main`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: calc(100vh - 2 * 9.5rem);

  padding: 0 7.5rem;

  @media (min-width: 1950px) {
    padding: 0 3.5rem !important;
  }

  @media (max-width: 1250px) {
    padding: 0 4rem;
  }

  @media (max-width: 860px) {
    height: calc(100vh - 2 * 7rem);

    padding: 0 2rem;
  }

  @media (max-width: 430px) {
    height: calc(100vh - 2 * 4.5rem);

    padding: 0 1rem;
  }
`;

export const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
