import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialised;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    touch-action: manipulation;
    scroll-behavior: smooth;
  }

  body, input, textarea, button, label {
    font-family: 'Inter', sans-serif;
    font-weight: normal;
    font-style: normal;
    font-size: 1rem;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', sans-serif;
  }

  button {
    background-color: transparent;
    cursor: pointer;
    border: 0;
  }

  ::-moz-selection {
    color: #FFF;
    background: #7DDE99;
  }

  ::selection {
    color: #FFF;
    background: #7DDE99;
  }
`;
