import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { churchCaptainData } from '../gameData';
import ReadyPage from './ReadyPage';

const ChurchCaptainGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
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

    const shuffled = [...churchCaptainData].sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 10));

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => { focusRef.current?.focus(); }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') navigate(-1);
    else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') { e.preventDefault(); setIsRevealed((p) => !p); }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentCardIndex > 0) { setCurrentCardIndex((p) => p - 1); setIsRevealed(false); }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentCardIndex < cards.length - 1) { setCurrentCardIndex((p) => p + 1); setIsRevealed(false); }
      else navigate('/gameover', { state: { gameName: 'churchCaptain' } });
    }
  }, [currentCardIndex, cards.length, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (windowWidth < 1126 || windowHeight < 627) return <ReadyPage />;
  if (cards.length === 0) return <div>Loading...</div>;

  const prompt = isRevealed ? cards[currentCardIndex].answer : '버튼을 눌러서\n문제를 확인해보세요!';

  return (
    <Container tabIndex="0" ref={focusRef}>
      <Header>
        <ExitButton onClick={() => navigate(-1)}>
          <img src="/images/Exit.png" alt="exit" />
        </ExitButton>
        <Counter>{currentCardIndex + 1}/{cards.length}</Counter>
        <div style={{ width: '48px' }} />
      </Header>
      <Content>
        <NavButton onClick={() => currentCardIndex > 0 && (setCurrentCardIndex((p) => p - 1), setIsRevealed(false))} disabled={currentCardIndex === 0}>
          <img src="/images/icon_chevron_left_white.png" alt="prev" />
        </NavButton>
        <CardContainer>
          <Card>{prompt}</Card>
        </CardContainer>
        <NavButton onClick={() => currentCardIndex < cards.length - 1 ? (setCurrentCardIndex((p) => p + 1), setIsRevealed(false)) : navigate('/gameover', { state: { gameName: 'churchCaptain' } })}>
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
      <AnswerButton onClick={() => setIsRevealed((p) => !p)} $isRevealed={isRevealed}>
        {isRevealed ? '가리기' : '문제보기'}
      </AnswerButton>
    </Container>
  );
};

export default ChurchCaptainGamePage;

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
  width: 70vw;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
`;

const Card = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 4.5vw;
  color: white;
  white-space: pre-wrap;
  text-align: center;
`;

const AnswerButton = styled.button`
  width: 17.3vw;
  height: 8.5vh;
  background-color: ${(props) => (props.$isRevealed ? 'white' : '#FFF27F')};
  border: none;
  border-radius: 12px;
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3vw;
  color: black;
  cursor: pointer;
  margin-bottom: 10vh;
`;
