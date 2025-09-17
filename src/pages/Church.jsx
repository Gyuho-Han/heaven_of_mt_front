import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Onboarding from '../components/onboarding/Onboarding';
import Picker from '../components/Picker';
import { churchGameData } from '../gameData';
import ReadyPage from './ReadyPage';

const Church = () => {
  const [selectedGame, setSelectedGame] = useState(0);
  const [isHovering1, setIsHovering1] = useState(false);
  const [isHovering2, setIsHovering2] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const focusRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') setSelectedGame((p) => (p > 0 ? p - 1 : p));
    else if (e.key === 'ArrowDown')
      setSelectedGame((p) => (p < churchGameData.length - 1 ? p + 1 : p));
    else if (e.key === 'Enter') navigate(churchGameData[selectedGame].route);
    else if (e.key === 'Escape') navigate('/');
  };

  if (windowWidth < 1126 || windowHeight < 627) return <ReadyPage />;

  return (
    <Container tabIndex="0" ref={focusRef} onKeyDown={handleKeyDown}>
      <Header>
        <TitleImage src="/images/title.png" alt="title" onClick={() => navigate('/')} />
        <HeaderButtons>
          <HeaderButton
            onMouseEnter={() => setIsHovering1(true)}
            onMouseLeave={() => setIsHovering1(false)}
            $isHovering={isHovering1}
            onClick={() => navigate('/home')}
          >
            엠티게임천국 바로가기
          </HeaderButton>
          <HeaderLink
            onMouseEnter={() => setIsHovering2(true)}
            onMouseLeave={() => setIsHovering2(false)}
            $isHovering={isHovering2}
            href="https://hguhimin.notion.site/db18a79dd2bd45208f55b1ca515647b8"
            target="_blank"
            rel="noopener noreferrer"
          >
            팀 소개
          </HeaderLink>
        </HeaderButtons>
      </Header>
      <Body>
        <Onboarding {...churchGameData[selectedGame].onboarding} />
        <Picker
          data={churchGameData}
          selectedIndex={selectedGame}
          onSelect={setSelectedGame}
        />
      </Body>
    </Container>
  );
};

export default Church;

const Container = styled.div`
  background-image: url('/images/background_church.png');
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

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderButton = styled.div`
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.$isHovering ? '#FF46AD' : '#FF008E')},
    ${(props) => (props.$isHovering ? '#FFF07F' : '#FFEB50')}
  );
  color: black;
  font-size: 1.25vw;
  cursor: pointer;
  margin-right: 1.5vw;
`;

const HeaderLink = styled.a`
  padding: 10px 12px;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.$isHovering ? '#FF46AD' : '#FF008E')},
    ${(props) => (props.$isHovering ? '#FFF07F' : '#FFEB50')}
  );
  color: black;
  font-size: 1.25vw;
  cursor: pointer;
  text-decoration: none;
`;

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 7.5vw;
`;
