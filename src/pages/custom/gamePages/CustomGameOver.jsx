import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const CustomGameOver = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { gameName, gameId } = location.state || { gameName: '', gameId: null };

  const handlePlayAgain = () => {
    if (gameName) {
      const path = gameId ? `/custom/${gameName}/${gameId}` : `/custom/${gameName}`;
      navigate(path, { replace: true });
    }
  };

  const handleGoHome = () => {
    const projectId = sessionStorage.getItem('currentProjectId');
    if (projectId) {
      navigate(`/customhome/gamestart/${projectId}`);
    } else {
      navigate('/customhome');
    }
  };

  const isChurch = gameName && gameName.startsWith('church');

  return (
    <Container $isChurch={isChurch}>
      <Title>모든 문제를 완료했어요!</Title>
      <ButtonContainer>
        <Button
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handlePlayAgain}
        >
          {isHovering ? (
            <HoverButtonContainer>
              <img src="/images/gameover.png" alt="gameover" />
              <HoverButtonText>Play Again</HoverButtonText>
            </HoverButtonContainer>
          ) : (
            <ButtonText>Play Again</ButtonText>
          )}
        </Button>
        <Button
          onMouseEnter={() => setIsHovering2(true)}
          onMouseLeave={() => setIsHovering2(false)}
          onClick={handleGoHome}
        >
          {isHovering2 ? (
            <HoverButtonContainer>
              <img src="/images/gameover.png" alt="gameover" />
              <HoverButtonText>Go Home</HoverButtonText>
            </HoverButtonContainer>
          ) : (
            <ButtonText>Go Home</ButtonText>
          )}
        </Button>
      </ButtonContainer>
      <FeedbackLink
        href="https://walla.my/survey/onEFdA9teaAwJGTkveRz"
        target="_blank"
        rel="noopener noreferrer"
      >
        의견보내기
      </FeedbackLink>
    </Container>
  );
};

export default CustomGameOver;

const Container = styled.div`
  background-image: url('/images/feedback.gif');
  background-size: cover;
  
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Title = styled.h1`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 48px;
  font-weight: 400;
  margin-bottom: 18.8vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.div`
  width: 360px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 4.4vh;
`;

const ButtonText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 48px;
  font-weight: 400;
  height: 52px;
  margin: 0;
`;

const HoverButtonContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  right: 21px;
  img {
    width: 32px;
    height: 52px;
    margin-right: 10px;
  }
`;

const HoverButtonText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 48px;
  font-weight: 400;
  margin: 0;
  background-color: #ff62d3;
  padding-bottom: 5px;
`;

const FeedbackLink = styled.a`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 2.5vw;
  font-weight: 400;
  color: white;
  text-decoration: underline;
  position: absolute;
  bottom: 120px;
`;
