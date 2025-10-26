import React from 'react';
import styled from 'styled-components';

const CustomHome = () => {
  return (
    <Container>
      <div>커스텀 홈화면 입니다~</div>
    </Container>
  );
};

export default CustomHome;

const Container = styled.div`
  background-image: url('/images/home.gif');
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  outline: none;
`;