import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { gameData } from "../../gameData";
import Onboarding from "../../components/onboarding/Onboarding";
import Picker from "../../components/Picker";
import ReadyPage from "./ReadyPage";

const RandomHome = () => {
  const [selectedGame, setSelectedGame] = useState(() => {
    const saved = sessionStorage.getItem("lastSelectedGameIndex");
    const parsed = saved !== null ? parseInt(saved, 10) : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const [isHovering2, setIsHovering2] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const focusRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      setSelectedGame((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "ArrowDown") {
      setSelectedGame((prev) => (prev < gameData.length - 1 ? prev + 1 : prev));
    } else if (e.key === "Enter") {
      sessionStorage.setItem("lastSelectedGameIndex", String(selectedGame));
      navigate(gameData[selectedGame].route);
    }
  };

  if (windowWidth < 1126 || windowHeight < 627) {
    return <ReadyPage />;
  }

  return (
    <Container onKeyDown={handleKeyDown} tabIndex="0" ref={focusRef}>
      <Header>
        <TitleImage
          src="/images/title.png"
          alt="title"
          onClick={() => navigate("/")}
        />
        <ButtonContainer>
          <TeamButton
            onMouseEnter={() => setIsHovering2(true)}
            onMouseLeave={() => setIsHovering2(false)}
            $isHovering={isHovering2}
            href="https://hguhimin.notion.site/2be16539629580a6bcf6cc31735cc491"
            target="_blank"
            rel="noopener noreferrer"
          >
            팀 소개
          </TeamButton>
        </ButtonContainer>
      </Header>
      <Content>
        <Onboarding {...gameData[selectedGame].onboarding} />
        <Picker
          data={gameData}
          selectedIndex={selectedGame}
          onSelect={setSelectedGame}
          onConfirmSelected={() => {
            sessionStorage.setItem(
              "lastSelectedGameIndex",
              String(selectedGame)
            );
            navigate(gameData[selectedGame].route);
          }}
        />
      </Content>
    </Container>
  );
};

export default RandomHome;

const Container = styled.div`
  background-image: url("/images/background_final.png");
  background-size: cover;
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

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 7.5vw;
`;

const TeamButton = styled.a`
  padding: 14px 12px;
  border-radius: 8px;
  background: linear-gradient(
    to bottom,
    ${(props) => (props.$isHovering ? "#FF48AE" : "#FF008E")},
    ${(props) => (props.$isHovering ? "#FFF5A9" : "#FFEB50")}
  );
  color: black;
  font-size: 1.25vw;
  cursor: pointer;
  text-decoration: none;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 7.5vw;
  gap: 8vw;
`;
