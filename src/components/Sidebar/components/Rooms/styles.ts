import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 14rem;
  max-width: 14rem;
  height: 100vh;

  background-color: #222222;

  .rooms__header {
    display: flex;
    align-items: center;
    position: relative;
    min-height: calc(5rem + 3px);
    max-height: calc(5rem + 3px);

    font-size: 1.5rem;

    margin-bottom: 0.75rem;
    padding: 0 0.75rem;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);

      width: calc(100% - 1.5rem);
      height: 3px;

      background-color: #292929;
    }
  }

  .rooms__search {
    display: flex;
    width: 100%;

    padding: 0 0.75rem;

    label {
      display: flex;
      width: 100%;

      color: #777;

      background-color: #292929;
      padding: 0.5rem 0.75rem;
      border-radius: 0.25rem;
    }

    input {
      width: 100%;

      font-size: 0.75rem;
      color: #ddd;

      background-color: transparent;
      margin-right: 0.25rem;
      border: none;
      outline: none;
    }

    input::placeholder {
      color: #777;
    }
  }

  .rooms__inner {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: scroll;

    margin: 0.75rem 0;
    padding: 0 0.75rem;

    /* width */
    ::-webkit-scrollbar {
      width: 0.5rem;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background: #222222;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #333;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #373737;
    }
  }

  .rooms__room {
    display: flex;
    align-items: center;

    color: #fff;
  }

  .rooms__room + .rooms__room {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #292929;
  }

  .room__image {
    display: flex;
    width: 3rem;
    height: 3rem;
    min-height: 3rem;
    max-height: 3rem;

    font-size: 0.75rem;

    background-color: #353535;
    border-radius: 100%;
  }

  .room__name {
    font-size: 0.75rem;

    margin-left: 0.5rem;
  }
`;
