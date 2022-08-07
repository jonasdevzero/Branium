import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  color: ${({ theme }) => theme.textColor};

  background-color: ${({ theme }) => theme.backgroundColor};

  @keyframes loadingAnimation {
    100% {
      transform: rotate(360deg);
    }
  }

  .loading__title {
    font-size: 4rem;
    font-weight: 500;

    margin-bottom: 1rem;
  }

  .loading__load {
    font-size: 2.5rem;

    animation: loadingAnimation 0.7s infinite linear;
  }
`;
