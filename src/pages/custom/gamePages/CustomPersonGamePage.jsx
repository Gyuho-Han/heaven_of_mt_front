
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { personData } from '../../../gameData';
import ReadyPage from './CustomReadyPage';
import { readQuestions } from '../../../firebase/Questions';

const CustomPersonGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
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
        state: { gameName: 'person', gameId },
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
      [...personData]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10)
        .map((item, idx) => ({
          id: item.id || `fallback-person-${idx}`,
          imgUrl: item.name,
          answer: item.answer,
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
          .map((question, idx) => {
            const imageSource =
              (question.imgUrl && question.imgUrl.trim()) ||
              (question.questionText && question.questionText.trim()) ||
              '';
            return {
              id: question.id || `person-${idx}`,
              imgUrl: imageSource,
              answer: question.answer?.trim() || '',
            };
          })
          .filter((item) => item.imgUrl.length > 0);

        if (!formatted.length) throw new Error('커스텀 인물퀴즈 문제가 없습니다.');
        if (mounted) setCards(formatted);
      } catch (error) {
        console.error('커스텀 인물퀴즈 문제 불러오기 실패:', error);
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
    } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      setIsAnswered((prev) => !prev);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (currentCardIndex > 0) {
        setCurrentCardIndex((prev) => prev - 1);
        setIsAnswered(false);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex((prev) => prev + 1);
        setIsAnswered(false);
      } else {
        goToCustomGameOver();
      }
    }
  }, [currentCardIndex, cards.length, goToCustomGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Prefetch next 2 images to reduce wait between cards
  useEffect(() => {
    const toPrefetch = [currentCardIndex + 1, currentCardIndex + 2]
      .map((i) => cards[i])
      .filter((c) => c && (c.imgUrl || c.name));

    toPrefetch.forEach((c) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = c.imgUrl ? c.imgUrl : encodeURI(c.name);
    });
  }, [cards, currentCardIndex]);

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsAnswered(false);
    } else {
      goToCustomGameOver();
    }
  };

  const handlePrev = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      setIsAnswered(false);
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
          <Card
            src={cards[currentCardIndex].imgUrl || encodeURI(cards[currentCardIndex].name)}
            alt="person"
            decoding="async"
            fetchpriority="high"
          />
        </CardContainer>
        <NavButton onClick={handleNext} chevron="right">
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
      <AnswerContainer>
        {isAnswered ? (
          <AnswerText onClick={() => setIsAnswered(false)}>
            {cards[currentCardIndex].answer}
          </AnswerText>
        ) : (
          <AnswerButton onClick={() => setIsAnswered(true)}>
            정답보기
          </AnswerButton>
        )}
      </AnswerContainer>
    </Container>
  );
};

export default CustomPersonGamePage;

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
  height: 55vh;
  display: flex;
  padding: 6.1vh 0 0 0;
  align-items: center;
  justify-content: center;
`;

const Card = styled.img`
  height: 100%;
  object-fit: contain;
  display: block;
`;

const AnswerContainer = styled.div`
  height: 8.5vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5.1vh 0 0 0;
`;

const AnswerButton = styled.button`
  width: 19.5vw;
  height: 8.5vh;
  background-color: #ff62d3;
  border: none;
  border-radius: 12px;
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3vw;
  color: black;
  cursor: pointer;
`;

const AnswerText = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 5.6vw;
  color: #ff62d3;
  cursor: pointer;
`;
