import React from 'react';
import styled from 'styled-components';

const ReadyPage = () => {
  return (<Container />);
};

export default ReadyPage;


const Container = styled.div`
  background-image: url('/images/ready.png'), url('/images/home.gif');
  background-size: contain, cover;
  width: 100vw;
  height: 100vh;
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
`;