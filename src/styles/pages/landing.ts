import styled from 'styled-components';

export const Inner = styled.div`
  display: flex;
  flex-direction: column;

  .main__title {
    font-size: 5rem;
    font-weight: 400;
  }

  .main__subscribe {
    width: fit-content;
    position: relative;

    font-size: 1.5rem;

    background-color: ${({ theme }) => theme.buttonColor};
    margin-top: 2.5rem;
    padding: 1.25rem 4.5rem;
    border: solid 1px ${({ theme }) => theme.buttonColorDark};
    border-radius: 0.25rem;

    transition: opacity 0.3s linear;
    box-shadow: 3px 4px ${({ theme }) => theme.buttonColorDark};

    cursor: pointer;
  }

  .main__subscribe:hover {
    bottom: 0.25rem;
    opacity: 0.8;
  }

  .main__subscribe:active {
    bottom: 0;
  }

  @media (max-width: 1460px) {
    .main__title {
      font-size: 4rem;
    }

    .main__subscribe {
      padding: 1rem 4rem;
    }
  }

  @media (max-width: 1120px) {
    .main__title {
      font-size: 3.5rem;
    }

    .main__subscribe {
      font-size: 1.25rem;

      padding: 1rem 3.5rem;
    }
  }

  @media (max-width: 980px) {
    .main__title {
      font-size: 3rem;
    }

    .main__subscribe {
      font-size: 1rem;

      margin-top: 2rem;
    }
  }

  @media (max-width: 800px) {
    .main__title {
      font-size: 2.5rem;
    }

    .main__subscribe {
      margin-top: 1.5rem;
      padding: 0.75rem 2.5rem;
    }
  }

  @media (max-width: 680px) {
    width: 100%;
    align-items: center;

    .main__title {
      font-size: 3.5rem;
      text-align: center;
    }

    .main__subscribe {
      font-size: 1.5rem;

      margin-top: 2.5rem;
      padding: 1rem 3.5rem;
    }
  }

  @media (max-width: 500px) {
    .main__title {
      font-size: 3rem;
    }

    .main__subscribe {
      font-size: 1.25rem;
    }
  }

  @media (max-width: 430px) {
    .main__title {
      font-size: 2.5rem;
    }

    .main__subscribe {
      font-size: 1rem;

      margin-top: 1.5rem;
      padding: 0.75rem 2.5rem;
    }
  }
`;

export const ImageContainer = styled.div`
  width: 55%;
  height: calc(100vh - 9.5rem);
  position: relative;

  img {
    pointer-events: none;
    object-fit: contain;
  }

  @media (max-width: 680px) {
    display: none;
  }
`;
