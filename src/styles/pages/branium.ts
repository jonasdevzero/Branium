import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;

  color: ${({ theme }) => theme.textColor};

  background-color: ${({ theme }) => theme.backgroundColorLight};
`;
