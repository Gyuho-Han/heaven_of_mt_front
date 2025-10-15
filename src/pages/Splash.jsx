import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ReadyPage from './ReadyPage';

const Splash = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const focusRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    focusRef.current?.focus();
    const timer = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      navigate('/home');
    }
  };

  const handleGameStart = () => {
    navigate('/home');
  };

  if (windowWidth < 1126) {
    return <ReadyPage />;
  }

  return (
    <Container onKeyDown={handleKeyPress} tabIndex="0" ref={focusRef}>
      <Content>
        <TopSpacer />
        <TitleImage src="/images/title.png" alt="title" />
        <BottomSpacer />
        <ButtonContainer>
          <AnimatedImage
            src="/images/splash_left.png"
            alt="left"
            $visible={isVisible}
          />
          <GameStartButton onClick={handleGameStart} $visible={isVisible}>
            Game Start
          </GameStartButton>
          <AnimatedImage
            src="/images/splash_right.png"
            alt="right"
            $visible={isVisible}
          />
        </ButtonContainer>
      </Content>
    </Container>
  );
};

export default Splash;

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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopSpacer = styled.div`
  height: 18vh;
`;

const TitleImage = styled.img`
  width: 65vw;
  height: 20vh;
`;

const BottomSpacer = styled.div`
  height: 35vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const blinkAnimation = keyframes`
  50% {
    opacity: 0.1;
  }
`;

const AnimatedImage = styled.img`
  width: 22px;
  height: 38.5px;
  opacity: ${(props) => (props.$visible ? 1 : 0.1)};
  transition: opacity 1s;
`;

const GameStartButton = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-weight: 400;
  font-size: 5.6vw;
  color: white;
  cursor: pointer;
  margin: 0 2.6vw;
  background: linear-gradient(to bottom, #fee100, #ff008e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: ${(props) => (props.$visible ? 1 : 0.1)};
  transition: opacity 1s;
`;
