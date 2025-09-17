import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { churchDiscoData } from '../gameData';
import ReadyPage from './ReadyPage';

const ChurchDiscoGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
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

    const shuffled = [...churchDiscoData].sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 10));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') navigate(-1);
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentCardIndex > 0) setCurrentCardIndex((p) => p - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentCardIndex < cards.length - 1) setCurrentCardIndex((p) => p + 1);
      else navigate('/gameover', { state: { gameName: 'churchDisco' } });
    }
  }, [currentCardIndex, cards.length, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (windowWidth < 1126 || windowHeight < 627) return <ReadyPage />;
  if (cards.length === 0) return <div>Loading...</div>;

  return (
    <Container tabIndex="0" ref={focusRef}>
      <Header>
        <ExitButton onClick={() => navigate(-1)}>
          <img src="/images/Exit.png" alt="exit" />
        </ExitButton>
        <Counter>
          {currentCardIndex + 1}/{cards.length}
        </Counter>
        <div style={{ width: '48px' }} />
      </Header>
      <Content>
        <NavButton onClick={() => currentCardIndex > 0 && setCurrentCardIndex((p) => p - 1)} disabled={currentCardIndex === 0}>
          <img src="/images/icon_chevron_left_white.png" alt="prev" />
        </NavButton>
        <CardContainer>
          <Card>{cards[currentCardIndex].name}</Card>
        </CardContainer>
        <NavButton onClick={() => currentCardIndex < cards.length - 1 ? setCurrentCardIndex((p) => p + 1) : navigate('/gameover', { state: { gameName: 'churchDisco' } })}>
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
    </Container>
  );
};

export default ChurchDiscoGamePage;

const Container = styled.div`
  background-image: url('/images/background_church.png');
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  outline: none;
  color: white;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7.1vh 7.5vw 0 7.5vw;
`;

const ExitButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  img { width: 3vw; }
`;

const Counter = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3.3vw;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  img { width: 7vw; }
  &:disabled { cursor: default; opacity: 0.5; }
`;

const CardContainer = styled.div`
  width: 63vw;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
`;

const Card = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 10.8vw;
  color: white;
`;
