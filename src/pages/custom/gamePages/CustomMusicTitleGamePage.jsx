import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { music1990Data, music2000Data, music2010Data, music2020Data } from '../../../gameData';
import ReadyPage from './CustomReadyPage';
import { readQuestions } from '../../../firebase/Questions';

const CustomMusicTitleGamePage = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const focusRef = useRef(null);
  const location = useLocation();
  const { generation } = location.state || { generation: '' };
  const { gameId } = useParams();
  const goToCustomGameOver = useCallback(() => {
    navigate('/custom/gameover', {
      state: { gameName: 'musictitle', gameId },
    });
  }, [navigate, gameId]);

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

    const pickGenerationData = () => {
      if (generation === 1) return music1990Data;
      if (generation === 2) return music2000Data;
      if (generation === 3) return music2010Data;
      if (generation === 4) return music2020Data;
      return music1990Data;
    };

    const buildFallbackCards = () =>
      [...pickGenerationData()]
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

    const loadQuestions = async () => {
      if (!gameId) {
        if (mounted) setCards(buildFallbackCards());
        return;
      }

      try {
        const questions = await readQuestions(gameId);
        const formatted = questions
          .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
          .map((q, idx) => ({
            id: q.id || `music-${idx}`,
            title: q.questionText?.trim() || '',
            artist: q.answer?.trim() || '',
          }))
          .filter((item) => (item.title?.length || 0) > 0 || (item.artist?.length || 0) > 0);

        if (!formatted.length) throw new Error('커스텀 노래초성 문제가 없습니다.');
        if (mounted) setCards(formatted);
      } catch (error) {
        console.error('커스텀 노래초성 문제 불러오기 실패:', error);
        if (mounted) setCards(buildFallbackCards());
      }
    };

    loadQuestions();
    return () => {
      mounted = false;
    };
  }, [gameId, generation]);

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
    // Custom cards (title/artist present): show 초성 of both as "제목 - 가수"
    if (Object.prototype.hasOwnProperty.call(card, 'title') || Object.prototype.hasOwnProperty.call(card, 'artist')) {
      const t = card.title || '';
      const a = card.artist || '';
      const left = toChosung(t);
      const right = toChosung(a);
      // Always include delimiter to match requested format
      return `${left} - ${right}`.trim();
    }
    // Fallback cards (from presets): use provided consonant string in name if available
    if (card.name) return card.name;
    // Or derive from full answer
    return toChosung(card.answer || '');
  };

  const getAnswerText = (card) => {
    if (!card) return '';
    if (Object.prototype.hasOwnProperty.call(card, 'title') || Object.prototype.hasOwnProperty.call(card, 'artist')) {
      const t = card.title || '';
      const a = card.artist || '';
      return `${t} - ${a}`.trim();
    }
    return card.answer || '';
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
        <NavButton onClick={handlePrev} disabled={currentCardIndex === 0} chevron="left">
          <img src="/images/icon_chevron_left_white.png" alt="prev" />
        </NavButton>
        <CardContainer>
          <Card isAnswered={isAnswered}>
            {isAnswered
              ? getAnswerText(cards[currentCardIndex])
              : getQuestionText(cards[currentCardIndex])}
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

export default CustomMusicTitleGamePage;

const Container = styled.div`
  background-image: url('/images/background_final.png');
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
  width: 63vw;
  height: 12.9vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 29.9vh 0 0 0;
`;

const Card = styled.div`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 6.5vw;
  color: ${(props) => (props.isAnswered ? '#ff62d3' : 'white')};
  white-space: pre-wrap;
  text-align: center;
`;

const AnswerButton = styled.button`
  width: 19.5vw;
  height: 8.5vh;
  background-color: ${(props) => (props.isAnswered ? 'white' : '#ff62d3')};
  border: none;
  border-radius: 12px;
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3vw;
  color: black;
  cursor: pointer;
  margin-top: 22.4vh;
`;
