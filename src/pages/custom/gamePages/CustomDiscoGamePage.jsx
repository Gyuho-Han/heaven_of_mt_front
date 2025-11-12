import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { discoData } from '../../../gameData';
import ReadyPage from './CustomReadyPage';
import { readQuestions } from '../../../firebase/Questions';

const DEFAULT_GAME_ID = 'BTE75TumbaNduaQEo4gG';

const CustomDiscoGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId: providedGameId } = useParams();
  const focusRef = useRef(null);
  const isPreview = !!(location.state && location.state.fromPreview);
  const goToCustomGameOver = useCallback(() => {
    const fromPreview = !!(location.state && location.state.fromPreview);
    if (fromPreview) {
      navigate(-1);
    } else {
      navigate('/custom/gameover', {
        state: { gameName: 'disco', gameId: providedGameId },
      });
    }
  }, [navigate, providedGameId, location.state]);

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
    const fetchQuestions = async () => {
      try {
        const effectiveGameId = providedGameId || DEFAULT_GAME_ID;
        if (!effectiveGameId) {
          throw new Error('No gameId provided for custom disco');
        }
        const questions = await readQuestions(effectiveGameId);
        if (!questions || questions.length === 0) {
          throw new Error('No custom disco questions found');
        }

        const formatted = questions
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
          .map((question, idx) => ({
            id: question.id || `${effectiveGameId}-${idx}`,
            questionText: question.questionText?.trim() || '',
            answer: question.answer?.trim() || '',
          }))
          .filter(
            (item) => item.questionText.length > 0 || item.answer.length > 0
          );

        if (formatted.length === 0) {
          throw new Error('Custom disco questions missing text');
        }

        setCards(formatted);
      } catch (error) {
        console.error(
          'Failed to load custom disco questions, falling back to defaults:',
          error
        );
        const fallback = [...discoData]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10)
          .map((item, idx) => ({
            id: `${item.name}-${idx}`,
            questionText: item.name,
            answer: item.name,
          }));

        setCards(fallback);
      }
    };

    fetchQuestions();
  }, [providedGameId]);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      navigate(-1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentCardIndex > 0) {
        setCurrentCardIndex((prev) => prev - 1);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
      } else {
        goToCustomGameOver();
      }
    }
  }, [currentCardIndex, cards.length, goToCustomGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      goToCustomGameOver();
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
    }
  };

  if (windowWidth < 1126 || windowHeight < 627) {
    return <ReadyPage />;
  }

  if (cards.length === 0) {
    return <div>Loading...</div>; // Or some other loading indicator
  }

  return (
    <Container tabIndex="0" ref={focusRef} $transparent={isPreview}>
      <Header>
        <HeaderLeft>
          <ExitButton onClick={() => navigate(-1)}>
            <img src="/images/Exit.png" alt="exit" />
          </ExitButton>
        </HeaderLeft>
        <Counter>
          {currentCardIndex + 1}/{cards.length}
        </Counter>
        <div style={{ width: '48px' }} />
      </Header>
      <Content>
        <NavButton onClick={handlePrev} disabled={currentCardIndex === 0} chevron="left">
          <img src="/images/icon_chevron_left_white.png" alt="prev" />
        </NavButton>
        <CardContainer>
          <Card>
            {cards[currentCardIndex].answer ||
              cards[currentCardIndex].questionText ||
              ''}
          </Card>
        </CardContainer>
        <NavButton onClick={handleNext} chevron="right">
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
    </Container>
  );
};

export default CustomDiscoGamePage;

const Container = styled.div`
  background-image: ${(p) => (p.$transparent ? 'none' : "url('/images/background_final.png')")};
  background-size: contain;
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
  padding: 7.5vh 0 0 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5vw;
  padding-left: 7.5vw;
  min-height: 3vw;
`;

const ExitButton = styled.button`
  width: 2.8vw;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  img {
    width: 3vw;
  }
`;

const QuestionText = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 1.6vw;
  color: #fff;
  max-width: 32vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Counter = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3.3vw;
  position: absolute;
  left: 50%; 
  transform: translateX(-50%);
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 50%; 
  transform: translateY(-50%);

  img {
    height: 9.3vh;
  }
    
  ${(props) => props.chevron === 'left' && `left: 8vw;`}
  ${(props) => props.chevron === 'right' && `right: 8vw;`}

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const CardContainer = styled.div`
  height: 24.2vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25.7vh 0 0 0;
`;

const Card = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 10.8vw;
  // font-size: 24.2vw;
  color: white;
`;
