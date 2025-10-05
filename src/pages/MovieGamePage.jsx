import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { movieData } from '../gameData';
import ReadyPage from './ReadyPage';

const MovieGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
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

    // Shuffle and pick 10 cards
    const shuffled = [...movieData].sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 10));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        navigate('/gameover', { state: { gameName: 'movie' } });
      }
    }
  }, [currentCardIndex, cards.length, navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      setIsAnswered(false);
    } else {
      navigate('/gameover', { state: { gameName: 'movie' } });
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
        <NavButton onClick={handlePrev} disabled={currentCardIndex === 0} chevron="left">
          <img src="/images/icon_chevron_left_white.png" alt="prev" />
        </NavButton>
        <CardContainer>
          <Card>
            {isAnswered ? (
              <AnswerText>{cards[currentCardIndex].answer}</AnswerText>
            ) : (
              <CardImage src={cards[currentCardIndex].name} alt="movie scene" />
            )}
          </Card>
        </CardContainer>
        <NavButton onClick={handleNext} chevron="right">
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
      <AnswerButton onClick={() => setIsAnswered((prev) => !prev)} isAnswered={isAnswered}>
        {isAnswered ? '문제보기' : '정답보기'}
      </AnswerButton>
    </Container>
  );
};

export default MovieGamePage;

const Container = styled.div`
  background-image: url('/images/background_final.png');
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
  flex-grow: 1;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;

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
  width: 70vw;
  height: 67vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  overflow: hidden;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
`;

const AnswerText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 6vw;
  color: #ff62d3;
  white-space: pre-wrap;
  text-align: center;
`;

const AnswerButton = styled.button`
  width: 17.3vw;
  height: 8.5vh;
  background-color: ${(props) => (props.isAnswered ? 'white' : '#ff62d3')};
  border: none;
  border-radius: 12px;
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3vw;
  color: black;
  cursor: pointer;
  margin-bottom: 3.8vh;
`;
