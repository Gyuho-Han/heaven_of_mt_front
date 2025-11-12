import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { choiData } from '../../../gameData';
import ReadyPage from './CustomReadyPage';
import { readQuestions } from '../../../firebase/Questions';

const CustomChoiGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const location = useLocation();
  const { gameId } = useParams();
  const focusRef = useRef(null);
  const isPreview = !!(location.state && location.state.fromPreview);
  const goToCustomGameOver = useCallback(() => {
    const fromPreview = !!(location.state && location.state.fromPreview);
    if (fromPreview) {
      navigate(-1);
    } else {
      navigate('/custom/gameover', {
        state: { gameName: 'choi', gameId },
      });
    }
  }, [navigate, gameId, location.state]);

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
    let mounted = true;

    const buildFallbackCards = () =>
      [...choiData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map((item, idx) => ({
          id: item.id || `fallback-choi-${idx}`,
          name: item.name,
        }));

    const loadQuestions = async () => {
      if (!gameId) {
        if (mounted) setCards(buildFallbackCards());
        return;
      }

      try {
        const questions = await readQuestions(gameId);
        const formatted = questions
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
          .map((question, idx) => ({
            id: question.id || `choi-${idx}`,
            name: question.questionText?.trim() || question.answer?.trim() || '',
          }))
          .filter((item) => item.name.length > 0);

        if (!formatted.length) throw new Error('커스텀 액션초성 문제가 없습니다.');
        if (mounted) setCards(formatted);
      } catch (error) {
        console.error('커스텀 액션초성 문제 불러오기 실패:', error);
        if (mounted) setCards(buildFallbackCards());
      }
    };

    loadQuestions();
    return () => {
      mounted = false;
    };
  }, [gameId]);

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
        <ExitButton onClick={() => navigate(-1)}>
          <img src="/images/Exit.png" alt="exit" />
        </ExitButton>
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
          <Card>{cards[currentCardIndex].name}</Card>
        </CardContainer>
        <NavButton onClick={handleNext} chevron="right">
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
    </Container>
  );
};

export default CustomChoiGamePage;

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

const ExitButton = styled.button`
  width: 2.8vw;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 0 0 7.5vw ;
  img {
    width: 3vw;
  }
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
  width: 34.7vw;
  height: 24.2vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 25.7vh 0 0 0;
`;

const Card = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 10.8vw;
  color: white;
`;
