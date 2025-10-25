import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReadyPage from './ReadyPage';

const SelectModePage = () => {
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


    if (windowWidth < 1126 || windowHeight < 627) {
        return <ReadyPage />;
    }

    return (
        <Container ref={focusRef}>
            <Header>
                <TitleImage
                    src="/images/title.png"
                    alt="title"
                    onClick={() => navigate('/')}
                />
            </Header>
            <Content>
                <SelectCard onClick={() => navigate('/home')}>
                    <p>RANDOM</p>
                </SelectCard>
                <SelectCard>
                    <p>CUSTOM</p>
                </SelectCard>
            </Content>
        </Container>
    );
};

export default SelectModePage;

const Container = styled.div`
  background-image: url('/images/background_final.png');
  background-size: cover;
  background-position: center top -120px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  outline: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5.6vh 0 0 0; /* match Flutter top spacing */
  margin-bottom: 3.2vh;
`;

const TitleImage = styled.img`
  width: 16vw;
  cursor: pointer;
  margin-left: 8.5vw;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: 7.5vw;
  gap: 8vw;
`;

const SelectCard = styled.div`
  width: 30vw; 
  height: 50vh; 
  background: white;
  border: 1px solid white;
  border-radius: 16px;
`;