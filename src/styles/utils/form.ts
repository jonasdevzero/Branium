import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.formColors.background};
  padding: 2rem 1.5rem;
  border-radius: 0.5rem;

  .form__title {
    font-size: 2rem;
    font-weight: 400;

    margin-bottom: 2rem;
  }

  .form__label {
    display: flex;
    flex-direction: column;
    width: 16.5rem;
  }

  .form__label + .form__label {
    margin-top: 0.75rem;
  }

  .form__error {
    display: flex;
    align-items: center;

    font-size: 0.75rem;
    font-weight: 400;
    color: ${({ theme }) => theme.danger};

    padding-bottom: 0.25rem;

    svg {
      margin-right: 0.25rem;
    }

    .label_inner {
      border: solid 1px ${({ theme }) => theme.danger};
    }
  }

  .label__inner {
    display: flex;
    align-items: center;

    background-color: ${({ theme }) => theme.formColors.inputBackground};
    padding: 0.75rem 1rem;
    border-radius: 0.25rem;

    &.error {
      border: thin solid ${({ theme }) => theme.danger};
    }
  }

  .form__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    font-size: 1.125rem;
    color: ${({ theme }) => theme.formColors.placeholder};

    padding-right: 0.5rem;
    border-right: solid 1px ${({ theme }) => theme.formColors.placeholder};
  }

  .form__input {
    width: 100%;

    font-size: 0.875rem;
    color: ${({ theme }) => theme.formColors.inputText};

    background-color: transparent;
    padding: 0.5rem;
    border: none;

    ::placeholder {
      color: ${({ theme }) => theme.formColors.placeholder};
      opacity: 1;
    }

    :-ms-input-placeholder {
      color: ${({ theme }) => theme.formColors.placeholder};
    }

    ::-ms-input-placeholder {
      color: ${({ theme }) => theme.formColors.placeholder};
    }
  }

  .form__submit {
    width: 100%;
    position: relative;

    font-size: 1rem;
    font-weight: 400;
    color: ${({ theme }) => theme.textColor};

    background-color: ${({ theme }) => theme.buttonColor};
    margin-top: 1rem;
    padding: 1rem 0;
    border-radius: 0.25rem;

    transition: opacity 0.3s linear;
    cursor: pointer;
  }

  .form__submit:hover {
    bottom: 0.25rem;
    opacity: 0.8;
    box-shadow: 3px 3px ${({ theme }) => theme.buttonColorDark};
  }

  .form__submit:active {
    bottom: 0;
    box-shadow: none;
  }

  .form__link {
    font-size: 0.875rem;
    text-decoration: underline;

    margin-top: 1rem;

    transition: opacity 0.3s ease;
  }

  .form__link:hover {
    opacity: 0.8;
  }
`;
