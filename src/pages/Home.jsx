import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { gameData } from '../gameData';
import Onboarding from '../components/onboarding/Onboarding';
import Picker from '../components/Picker';
import ReadyPage from './ReadyPage';

const Home = () => {
  const [selectedGame, setSelectedGame] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const focusRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      setSelectedGame((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'ArrowDown') {
      setSelectedGame((prev) => (prev < gameData.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'Enter') {
      navigate(gameData[selectedGame].route);
    }
  };

  if (windowWidth < 1126 || windowHeight < 627) {
    return <ReadyPage />;
  }

  return (
    <Container onKeyDown={handleKeyDown} tabIndex="0" ref={focusRef}>
      <Header>
        <TitleImage
          src="/images/title.png"
          alt="title"
          onClick={() => navigate('/')}
        />
        <ButtonContainer>
          <ChurchButton
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            $isHovering={isHovering}
            onClick={() => navigate('/church')}
          >
            <img src="/images/beta.png" alt="beta" />
            교회 버전 바로가기
          </ChurchButton>
          <TeamButton
            onMouseEnter={() => setIsHovering2(true)}
            onMouseLeave={() => setIsHovering2(false)}
            $isHovering={isHovering2}
            href="https://hguhimin.notion.site/db18a79dd2bd45208f55b1ca515647b8"
            target="_blank"
            rel="noopener noreferrer"
          >
            팀 소개
          </TeamButton>
        </ButtonContainer>
      </Header>
      <Content>
        <Onboarding {...gameData[selectedGame].onboarding} />
        <Picker
          data={gameData}
          selectedIndex={selectedGame}
          onSelect={setSelectedGame}
        />
      </Content>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  background-image: url('/images/background_final.png');
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  outline: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5.6vh 7.5vw 3.2vh 7.5vw;
`;

const TitleImage = styled.img`
  width: 17.9vw;
  height: 4.7vh;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ChurchButton = styled.div`
  position: relative;
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.$isHovering ? '#2AFF73' : '#01DF4C')},
    ${(props) => (props.$isHovering ? '#FFF4A0' : '#FFEB50')}
  );
  color: black;
  font-size: 1.25vw;
  cursor: pointer;
  margin-right: 1.5vw;

  img {
    position: absolute;
    top: -20px;
    left: -35px;
    width: 74px;
    height: 40px;
  }
`;

const TeamButton = styled.a`
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.$isHovering ? '#FF48AE' : '#FF008E')},
    ${(props) => (props.$isHovering ? '#FFF5A9' : '#FFEB50')}
  );
  color: black;
  font-size: 1.25vw;
  cursor: pointer;
  text-decoration: none;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7.5vw;
`;
