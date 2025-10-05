import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { music1990Data, music2000Data, music2010Data, music2020Data } from '../gameData';
import ReadyPage from './ReadyPage';

const MusicTitleGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const focusRef = useRef(null);
  const location = useLocation();
  const { generation } = location.state || { generation: '' };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    let data = [];
    if (generation === 1) {
      data = music1990Data;
    } else if (generation === 2) {
      data = music2000Data;
    } else if (generation === 3) {
      data = music2010Data;
    } else if (generation === 4) {
      data = music2020Data;
    }

    const shuffled = [...data].sort(() => 0.5 - Math.random());
    setCards(shuffled.slice(0, 10));

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generation]);

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
        navigate('/gameover', { state: { gameName: 'musictitle' } });
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
      navigate('/gameover', { state: { gameName: 'musictitle' } });
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

  // Convert a Hangul string to its initial-consonant (초성) representation
  const toChosung = (text) => {
    const CHO = [
      'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ',
      'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ',
      'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
    ];

    return Array.from(text || '').map((ch) => {
      const code = ch.charCodeAt(0);
      // Precomposed Hangul syllables (AC00-D7A3)
      if (code >= 0xac00 && code <= 0xd7a3) {
        const idx = Math.floor((code - 0xac00) / 588);
        return CHO[idx];
      }
      // Keep non-Hangul as-is (spaces, hyphens, punctuation, latin, numbers, line breaks)
      return ch;
    }).join('');
  };

  const getQuestionText = (card) => {
    if (!card) return '';
    // If provided name differs from answer, respect curated name.
    if (card.name && card.answer && card.name !== card.answer) return card.name;
    // Otherwise, derive from answer to avoid identical question/answer.
    return toChosung(card.answer || '');
  };

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
        <NavButton onClick={handlePrev} disabled={currentCardIndex === 0}>
          <img src="/images/icon_chevron_left_white.png" alt="prev" />
        </NavButton>
        <CardContainer>
          <Card>
            {isAnswered
              ? cards[currentCardIndex].answer
              : getQuestionText(cards[currentCardIndex])}
          </Card>
        </CardContainer>
        <NavButton onClick={handleNext}>
          <img src="/images/icon_chevron_right.png" alt="next" />
        </NavButton>
      </Content>
      <AnswerButton onClick={() => setIsAnswered((prev) => !prev)} isAnswered={isAnswered}>
        {isAnswered ? '문제보기' : '정답보기'}
      </AnswerButton>
    </Container>
  );
};

export default MusicTitleGamePage;

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
  padding: 0;
  img {
    width: 5vw;
  }
  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

const CardContainer = styled.div`
  width: 63vw;
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 20px;
`;

const Card = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 6.5vw;
  color: white;
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
  margin-bottom: 13.2vh;
`;
