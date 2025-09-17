import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReadyPage from './ReadyPage';

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(-1);
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
    if (e.key === 'Escape') {
      navigate(-1);
    }
  };

  const handleClick = (category) => {
    navigate('/musictitle', { state: { generation: category } });
  };

  if (windowWidth < 1126 || windowHeight < 627) {
    return <ReadyPage />;
  }

  return (
    <Container onKeyDown={handleKeyDown} tabIndex="0" ref={focusRef}>
      <Header>
        <TitleImage src="/images/title.png" alt="title" onClick={() => navigate(-1)} />
      </Header>
      <Content>
        <CategoryRow>
          <CategoryButton
            onMouseEnter={() => setSelectedCategory(1)}
            onMouseLeave={() => setSelectedCategory(-1)}
            onClick={() => handleClick(1)}
          >
            <CategoryImg src={selectedCategory === 1 ? '/images/category2.png' : '/images/category.png'} alt="1990s" />
            <CategoryText>1990년대</CategoryText>
          </CategoryButton>
          <CategoryButton
            onMouseEnter={() => setSelectedCategory(2)}
            onMouseLeave={() => setSelectedCategory(-1)}
            onClick={() => handleClick(2)}
          >
            <CategoryImg src={selectedCategory === 2 ? '/images/category2.png' : '/images/category.png'} alt="2000s" />
            <CategoryText>2000년대</CategoryText>
          </CategoryButton>
          <CategoryButton
            onMouseEnter={() => setSelectedCategory(3)}
            onMouseLeave={() => setSelectedCategory(-1)}
            onClick={() => handleClick(3)}
          >
            <CategoryImg src={selectedCategory === 3 ? '/images/category2.png' : '/images/category.png'} alt="2010s" />
            <CategoryText>2010년대</CategoryText>
          </CategoryButton>
          <CategoryButton
            onMouseEnter={() => setSelectedCategory(4)}
            onMouseLeave={() => setSelectedCategory(-1)}
            onClick={() => handleClick(4)}
          >
            <CategoryImg src={selectedCategory === 4 ? '/images/category2.png' : '/images/category.png'} alt="2020s" />
            <CategoryText>2020년대</CategoryText>
          </CategoryButton>
        </CategoryRow>
      </Content>
    </Container>
  );
};

export default CategoryPage;

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
  justify-content: flex-start;
  padding: 5.6vh 8.4vw 0 8.4vw;
`;

const TitleImage = styled.img`
  width: 15vw;
  height: 3.8vh;
  cursor: pointer;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
`;

const CategoryRow = styled.div`
  display: flex;
  margin-left: 8.5vw;
`;

const CategoryButton = styled.div`
  position: relative;
  width: 19vw;
  height: 56vh;
  margin-right: 2.4vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CategoryImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
`;

const CategoryText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3.1vw;
  font-weight: 400;
  color: white;
  position: relative;
  z-index: 1;
`;
