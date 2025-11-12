import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { readGamesInProject } from "../../firebase/Games";
import { readQuestions } from "../../firebase/Questions";
import { readProject } from "../../firebase/Projects";
import styled from "styled-components";
import { gameData } from "../../gameData";
import Onboarding from "../../components/onboarding/Onboarding";
import Picker from "../../components/Picker";
import ReadyPage from "../random/ReadyPage";

const GameStart = () => {
  const [selectedGame, setSelectedGame] = useState(() => {
    const saved = sessionStorage.getItem("lastSelectedGameIndex");
    const parsed = saved !== null ? parseInt(saved, 10) : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [filteredGameData, setFilteredGameData] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const normalizeType = (t) => {
    if (t === "노래초성게임") return "노래초성퀴즈";
    if (t === "네글자게임") return "네글자퀴즈";
    if (t === "명대사 퀴즈") return "명대사퀴즈";
    return t;
  };
  // store or log the projectId for downstream pages/components if needed
  useEffect(() => {
    if (projectId) {
      console.log("GameStart projectId:", projectId);
      try {
        sessionStorage.setItem("currentProjectId", projectId);
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [projectId]);

  // 프로젝트에 연결된 games를 불러와서 gameType 목록을 얻고
  // 그에 맞는 gameData 항목들만 보여주도록 필터링합니다.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!projectId) return;
      try {
        const games = await readGamesInProject(projectId);
        // Filter out games that have zero questions
        const withCounts = await Promise.all(
          games.map(async (g) => {
            try {
              const qs = await readQuestions(g.id);
              const hasMeaningful = (qs || []).some((q) => {
                const qt = (q.questionText || "").trim();
                const an = (q.answer || "").trim();
                return qt.length > 0 || an.length > 0 || !!q.imgUrl;
              });
              return { game: g, hasData: hasMeaningful };
            } catch (e) {
              return { game: g, hasData: false };
            }
          })
        );
        // Keep only games with data
        const nonEmptyGames = withCounts.filter((x) => x.hasData).map((x) => x.game);
        // Sort to match project list index: by createdAt (seconds, then nanoseconds), then title, then id
        const sorted = [...nonEmptyGames].sort((a, b) => {
          const as = a.createdAt?.seconds ?? 0;
          const bs = b.createdAt?.seconds ?? 0;
          if (as !== bs) return as - bs;
          const an = a.createdAt?.nanoseconds ?? 0;
          const bn = b.createdAt?.nanoseconds ?? 0;
          if (an !== bn) return an - bn;
          const at = (a.title || a.id || '').localeCompare(b.title || b.id || '');
          if (at !== 0) return at;
          return (a.id || '').localeCompare(b.id || '');
        });

        // Expand into per-instance entries so same type games all appear
        const filtered = sorted
          .map((g) => {
            const t = normalizeType(g.gameType);
            const desc = gameData.find((d) => d.name === t);
            if (!desc) return null;
            return { ...desc, gameId: g.id };
          })
          .filter(Boolean);

        if (mounted) {
          setFilteredGameData(filtered);
          // selectedGame 인덱스가 범위를 벗어나면 0으로 리셋
          setSelectedGame((prev) =>
            filtered.length ? Math.min(prev, filtered.length - 1) : 0
          );
        }
      } catch (err) {
        console.error("프로젝트 게임 불러오기 실패:", err);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [projectId]);

  useEffect(() => {
    if (!projectId) {
      setProjectTitle("");
      return;
    }

    let cancelled = false;
    const loadProject = async () => {
      try {
        const project = await readProject(projectId);
        if (!cancelled) {
          setProjectTitle(project?.title || "");
        }
      } catch (err) {
        console.error("프로젝트 정보 불러오기 실패:", err);
        if (!cancelled) setProjectTitle("");
      }
    };

    loadProject();
    return () => {
      cancelled = true;
    };
  }, [projectId]);
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
      setSelectedGame((prev) =>
        prev <
        (filteredGameData.length
          ? filteredGameData.length - 1
          : gameData.length - 1)
          ? prev + 1
          : prev
      );
    } else if (e.key === "Enter") {
      sessionStorage.setItem("lastSelectedGameIndex", String(selectedGame));
      const target = (filteredGameData.length ? filteredGameData : gameData)[
        selectedGame
      ];
      if (target) {
        if (projectId && target.gameId) {
          const gameIdToUse = target.gameId;
          if (target.name === "노래초성퀴즈") navigate(`/custom/musictitle/${gameIdToUse}`);
          else navigate(`/custom${target.route}/${gameIdToUse}`);
        } else {
          const routeToNavigate = projectId
            ? `/custom${target.route}`
            : target.route;
          if (projectId && target.name === "노래초성퀴즈") {
            navigate(`/custom/musictitle`);
          } else {
            navigate(routeToNavigate);
          }
        }
      }
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
        {projectTitle && <ProjectTitle>{projectTitle}</ProjectTitle>}
      </Header>
      <Content>
        {filteredGameData.length ? (
          <>
            <Onboarding {...filteredGameData[selectedGame].onboarding} />
            <Picker
              data={filteredGameData}
              selectedIndex={selectedGame}
              onSelect={setSelectedGame}
              onConfirmSelected={() => {
                sessionStorage.setItem(
                  "lastSelectedGameIndex",
                  String(selectedGame)
                );
                const target = filteredGameData[selectedGame];
                if (target) {
                  if (projectId && target.gameId) {
                    const gameIdToUse = target.gameId;
                    if (target.name === "노래초성퀴즈") navigate(`/custom/musictitle/${gameIdToUse}`);
                    else navigate(`/custom${target.route}/${gameIdToUse}`);
                  } else {
                    const routeToNavigate = projectId
                      ? `/custom${target.route}`
                      : target.route;
                    if (projectId && target.name === "노래초성퀴즈") {
                      navigate(`/custom/musictitle`);
                    } else {
                      navigate(routeToNavigate);
                    }
                  }
                }
              }}
            />
          </>
        ) : (
          <div style={{ color: "#fff", fontSize: "20px" }}>
            이 프로젝트에 등록된 게임이 없습니다.
          </div>
        )}
      </Content>
    </Container>
  );
};

export default GameStart;

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
  align-items: center;
  gap: 3.3vw;
  padding: 5.6vh 0 0 0; /* match Flutter top spacing */
  margin-bottom: 3.2vh;
  margin-left: 8.5vw;
`;

const TitleImage = styled.img`
  width: 16vw;
  cursor: pointer;
`;

const ProjectTitle = styled.span`
  font-family: "DungGeunMo", sans-serif;
  font-size: 1.8vw;
  color: #fff;
  max-width: 24vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #ff62d3;
  font-size: 25px;
`;

const Content = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-left: 7.5vw;
  gap: 8vw;
`;
