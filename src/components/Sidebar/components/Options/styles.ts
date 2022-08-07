import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  background-color: #1e1e1e;
  padding: 0.75rem;

  .sidebar__profile {
    width: 3.5rem;
    height: 3.5rem;
    min-height: 3.5rem;
    max-height: 3.5rem;
    position: relative;

    font-size: 0.75rem;
    text-align: center;

    background-color: #292929;
    margin-bottom: calc(1.5rem + 3px);
    border-radius: 100%;

    &::after {
      content: '';
      position: absolute;
      bottom: calc(-0.75rem - 3px);
      left: 50%;
      transform: translateX(-50%);

      width: 50%;
      height: 3px;

      background-color: #292929;
    }
  }

  .options__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .sidebar__option {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.5rem;
    height: 3.5rem;
    min-height: 3.5rem;
    max-height: 3.5rem;

    background-color: #292929;
    border-radius: 50%;

    svg {
      font-size: 1.5rem;
      color: #fff;
    }
  }

  .sidebar__option + .sidebar__option {
    margin-top: 0.75rem;
  }

  .room__option {
    position: relative;

    ::before {
      content: '';
      position: absolute;
      top: 50%;
      left: -12px;
      transform: translateY(-50%);

      width: 2px;
      height: 0;

      background-color: #fff;
      border-radius: 0.25rem;

      transition: height 0.3s ease;
    }

    &.option__selected {
      ::before {
        height: 45%;
      }
    }
  }

  .account__options {
    position: relative;

    margin-top: calc(1.5rem + 3px);

    &::after {
      content: '';
      position: absolute;
      top: calc(-0.75rem - 3px);
      left: 50%;
      transform: translateX(-50%);

      width: 50%;
      height: 3px;

      background-color: #292929;
    }
  }
`;
