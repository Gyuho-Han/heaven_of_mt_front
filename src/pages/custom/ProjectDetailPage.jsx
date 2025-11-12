import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../GoogleAuthManager";
import { createGame, deleteGame } from "../../firebase/Games";
import {
  createQuestion,
  uploadQuestionImage,
  readQuestions,
  updateQuestion,
  deleteQuestion,
} from "../../firebase/Questions";
import Textinput from "./gamePages/inputTypes/TextInput";
import ImageTextInput from "./gamePages/inputTypes/ImageTextInput";
import TextTextInput from "./gamePages/inputTypes/TextTextInput";
import FourLetterInput from "./gamePages/inputTypes/FourLetterInput";
import VerticalTextText from "./gamePages/inputTypes/VerticalTextText";
import AddFirstGamePage from "./AddFirstGamePage";
import { gameData } from "../../gameData";

const ProjectDetailPage = ({ games = [], projectId, projectTitle, onGameCreated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const addGameBtnRef = useRef(null);
  const pickerRef = useRef(null);
  const containerRef = useRef(null);
  const [inputsByGame, setInputsByGame] = useState({});
  const [imagesByGame, setImagesByGame] = useState({});
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameMenuOpenId, setGameMenuOpenId] = useState(null);
  const [gameMenuPos, setGameMenuPos] = useState({ top: 0, left: 0 });

  const handleOpenPicker = () => {
    if ((games?.length || 0) >= 5) return;
    const el = addGameBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setPickerPos({
        top: rect.top - containerRect.top,
        left: rect.left - containerRect.left,
      });
    } else {
      setPickerPos({ top: rect.top, left: rect.left });
    }
    setShowPicker(true);
  };

  useEffect(() => {
    if (!showPicker) return;
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        addGameBtnRef.current &&
        !addGameBtnRef.current.contains(e.target)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  const handlePlayClick = () => {
    if (!projectId) return;
    navigate(`/customhome/gamestart/${projectId}`);
  };

  const handlePreviewClick = () => {
    if (!hasMeaningfulForSelected) return;
    const game = selectedGame || games[0];
    if (!game) return;
    // Map selected type to route
    const normalizedName = selectedType;
    const desc = (gameData || []).find((d) => d.name === normalizedName);
    if (!desc) return;
    const base = normalizedName === "노래초성퀴즈" ? "/custom/musictitle" : `/custom${desc.route}`;
    const path = game.id ? `${base}/${game.id}` : base;
    navigate(path, { state: { backgroundLocation: location, fromPreview: true } });
  };

  // inputs 상태는 이 페이지에서 관리하고, 조작 함수는 하위 컴포넌트로 전달해 사용합니다.

  const defaultInputsForType = (type) => {
    if (type === "노래초성퀴즈") return [{ id: 1, title: "", artist: "" }];
    if (type === "대표게임") return [{ id: 1, description: "", mission: "" }];
    // 네글자, 텍스트형, 이미지형은 기본 value 하나로 시작
    return [{ id: 1, value: "" }];
  };

  const selectedGame = games.find((g) => g.id === selectedGameId) || games[0];
  const selectedTypeRaw = selectedGame?.gameType;
  const selectedType =
    selectedTypeRaw === "노래초성게임"
      ? "노래초성퀴즈"
      : selectedTypeRaw === "네글자게임"
      ? "네글자퀴즈"
      : selectedTypeRaw === "명대사 퀴즈"
      ? "명대사퀴즈"
      : selectedTypeRaw;
  const currentInputs = selectedGameId
    ? inputsByGame[selectedGameId] ?? defaultInputsForType(selectedType)
    : [];
  const currentImages = selectedGameId
    ? imagesByGame[selectedGameId] ?? {}
    : {};

  // Determine if selected game has at least one meaningful question
  const hasMeaningfulForSelected = (() => {
    const items = currentInputs || [];
    if (!items.length) return false;
    if (selectedType === "인물퀴즈") {
      return items.some((it) => {
        const img = currentImages?.[it.id];
        const hasImg = !!(img?.file || img?.previewUrl);
        const hasAns = !!String(it.value || "").trim();
        return hasImg || hasAns;
      });
    }
    if (selectedType === "명대사퀴즈" || selectedType === "명대사 퀴즈") {
      const withText = items.some((it) => !!String(it.value || "").trim());
      if (withText) return true;
      return Object.values(currentImages || {}).some((img) => !!(img?.file || img?.previewUrl));
    }
    if (selectedType === "노래초성퀴즈") {
      return items.some((it) => !!String(it.title || it.artist || "").trim());
    }
    if (selectedType === "대표게임") {
      return items.some((it) => !!String(it.description || it.mission || "").trim());
    }
    // other single-text types
    return items.some((it) => !!String(it.value || "").trim());
  })();

  const setInputsForSelected = (next) => {
    if (!selectedGameId) return;
    setInputsByGame((prev) => {
      const prevArr =
        prev[selectedGameId] ?? defaultInputsForType(selectedType);
      const nextArr = typeof next === "function" ? next(prevArr) : next;
      return { ...prev, [selectedGameId]: nextArr };
    });
  };

  const setImagesForSelected = (next) => {
    if (!selectedGameId) return;
    setImagesByGame((prev) => {
      const prevMap = prev[selectedGameId] ?? {};
      const nextMap = typeof next === "function" ? next(prevMap) : next;
      return { ...prev, [selectedGameId]: nextMap };
    });
  };

  // Load existing questions for selected game and map into inputs/images
  useEffect(() => {
    const load = async () => {
      if (!selectedGameId || !selectedType) return;
      const qs = await readQuestions(selectedGameId);
      const sorted = [...qs].sort(
        (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
      );
      if (sorted.length === 0) {
        setInputsByGame((prev) => ({
          ...prev,
          [selectedGameId]: defaultInputsForType(selectedType),
        }));
        setImagesByGame((prev) => ({ ...prev, [selectedGameId]: {} }));
        return;
      }
      // Map per type
      if (selectedType === "인물퀴즈") {
        // 인물퀴즈는 answer로 표시
        const inputs = sorted.map((q, i) => ({
          id: (q.orderIndex ?? i + 1),
          value: q.answer ?? "",
        }));
        const imgs = sorted.reduce((acc, q, i) => {
          const id = (q.orderIndex ?? i + 1);
          if (q.imgUrl) acc[id] = { file: undefined, previewUrl: q.imgUrl };
          return acc;
        }, {});
        setInputsByGame((prev) => ({ ...prev, [selectedGameId]: inputs }));
        setImagesByGame((prev) => ({ ...prev, [selectedGameId]: imgs }));
      } else if (
        selectedType === "명대사퀴즈" ||
        selectedType === "명대사 퀴즈"
      ) {
        // 명대사퀴즈는 answer를 사용해 표시
        const inputs = sorted.map((q, i) => ({
          id: (q.orderIndex ?? i + 1),
          value: q.answer ?? "",
        }));
        const imgs = sorted.reduce((acc, q, i) => {
          const id = (q.orderIndex ?? i + 1);
          if (q.imgUrl) acc[id] = { file: undefined, previewUrl: q.imgUrl };
          return acc;
        }, {});
        setInputsByGame((prev) => ({ ...prev, [selectedGameId]: inputs }));
        setImagesByGame((prev) => ({ ...prev, [selectedGameId]: imgs }));
      } else if (selectedType === "노래초성퀴즈") {
        const inputs = sorted.map((q, i) => ({
          id: q.orderIndex ?? i + 1,
          title: (q.questionText && q.questionText.trim() !== "") ? q.questionText : "",
          artist: (q.answer && q.answer.trim() !== "") ? q.answer : "",
        }));
        setInputsByGame((prev) => ({ ...prev, [selectedGameId]: inputs }));
      } else if (selectedType === "대표게임") {
        const inputs = sorted.map((q, i) => ({
          id: q.orderIndex ?? i + 1,
          description: (q.questionText && q.questionText.trim() !== "") ? q.questionText : "",
          mission: (q.answer && q.answer.trim() !== "") ? q.answer : "",
        }));
        setInputsByGame((prev) => ({ ...prev, [selectedGameId]: inputs }));
      } else {
        // 단일 텍스트 계열
        const inputs = sorted.map((q, i) => ({
          id: q.orderIndex ?? i + 1,
          value: (q.questionText && q.questionText.trim() !== "") ? q.questionText : "",
        }));
        setInputsByGame((prev) => ({ ...prev, [selectedGameId]: inputs }));
      }
    };
    load();
  }, [selectedGameId, selectedType]);

  const saveQuestionsForSelected = async () => {
    if (!selectedGameId) return;
    const items = currentInputs || [];
    const imgs = currentImages || {};
    const type = selectedType;

    // Load existing questions to update instead of always creating
    const existing = await readQuestions(selectedGameId);
    const byIndex = new Map(existing.map((q) => [q.orderIndex, q]));

    const seenOrderIndexes = new Set();
    for (const item of items) {
      let questionText = " ";
      let answer = " ";
      let imgUrl = null;
      const orderIndex = item.id ?? 0;
      seenOrderIndexes.add(orderIndex);

      if (type === "인물퀴즈") {
        // 인물퀴즈는 텍스트를 answer에 저장
        const file = imgs?.[item.id]?.file;
        if (file) {
          imgUrl = await uploadQuestionImage(file);
        } else {
          const prev = byIndex.get(orderIndex);
          if (prev?.imgUrl) imgUrl = prev.imgUrl;
        }
        questionText = " ";
        answer = (item.value && String(item.value).trim()) || " ";
      } else if (type === "명대사퀴즈" || type === "명대사 퀴즈") {
        // 명대사퀴즈는 텍스트를 answer에 저장
        const file = imgs?.[item.id]?.file;
        if (file) {
          imgUrl = await uploadQuestionImage(file);
          answer = (item.value && String(item.value).trim()) || " ";
          questionText = " ";
        } else {
          questionText = " ";
          answer = (item.value && String(item.value).trim()) || " ";
          const prev = byIndex.get(orderIndex);
          if (prev?.imgUrl) imgUrl = prev.imgUrl;
        }
      } else if (type === "노래초성퀴즈") {
        // 두 텍스트: 제목, 가수
        questionText = (item.title && String(item.title).trim()) || " ";
        answer = (item.artist && String(item.artist).trim()) || " ";
      } else if (type === "대표게임") {
        // 두 텍스트: 지문, 미션
        questionText =
          (item.description && String(item.description).trim()) || " ";
        answer = (item.mission && String(item.mission).trim()) || " ";
      } else {
        // 단일 텍스트 계열(네글자퀴즈, 단어텔레파시, 디스코, 액션초성게임, 텔레스트레이션)
        questionText = (item.value && String(item.value).trim()) || " ";
        answer = " ";
      }

      const payload = {
        gameId: selectedGameId,
        orderIndex,
        questionText,
        imgUrl,
        answer,
      };

      const existingDoc = byIndex.get(orderIndex);
      if (existingDoc) {
        await updateQuestion(existingDoc.id, payload);
      } else {
        await createQuestion(payload);
      }
    }

    // Delete questions that are no longer present in inputs
    const deletions = existing
      .filter((q) => !seenOrderIndexes.has(q.orderIndex))
      .map((q) => deleteQuestion(q.id));
    if (deletions.length) await Promise.all(deletions);
  };

  const handleCreateGame = async (gameType) => {
    if (!user || !projectId) return;
    const newId = await createGame({ gameType, projectId, userId: user.uid });
    setShowPicker(false);
    await onGameCreated?.();
    setSelectedGameId(newId);
  };

  // Keep selection valid as games change; default to first
  useEffect(() => {
    if (!games || games.length === 0) {
      setSelectedGameId(null);
      return;
    }
    setSelectedGameId((prev) => {
      if (prev && games.some((g) => g.id === prev)) return prev;
      return games[0].id;
    });
  }, [games]);

  return (
    <RightCol>
      <Header>
        <HeaderLeft>
          <TitleImage
            src="/images/title.png"
            alt="title"
            onClick={() => navigate("/")}
          />
          <ProjectName>{projectTitle || '프로젝트'}</ProjectName>
        </HeaderLeft>
        <HeaderRight>
          <PreviewBtn onClick={handlePreviewClick} $disabled={!hasMeaningfulForSelected} aria-disabled={!hasMeaningfulForSelected}>미리보기</PreviewBtn>
          <PlayBtn onClick={handlePlayClick}>게임하기</PlayBtn>
          <Profile />
        </HeaderRight>
      </Header>
      <ProjectDetailContainer ref={containerRef} onClick={() => setGameMenuOpenId(null)}>
        <GameList>
          <GameListTopRow>
            <GameListTitle>전체 게임</GameListTitle>
            {games.length < 5 && (
              <AddGameBtn ref={addGameBtnRef} onClick={handleOpenPicker}>
                +
              </AddGameBtn>
            )}
          </GameListTopRow>
          <GameComponentList>
            {games.map((g, idx) => (
              <GameListComponent
                key={g.id}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const top = e.clientY - rect.top;
                  const left = e.clientX - rect.left;
                  setGameMenuPos({ top, left });
                  setGameMenuOpenId(g.id);
                }}
              >
                <GameListIndex>{idx + 1}</GameListIndex>
                <GameListBadge
                  onClick={() => setSelectedGameId(g.id)}
                  $active={selectedGameId === g.id}
                >
                  {g.gameType || "게임"}
                </GameListBadge>
                {gameMenuOpenId === g.id && (
                  <GameDropdown $top={gameMenuPos.top} $left={gameMenuPos.left} onClick={(e) => e.stopPropagation()}>
                    <GameMenuItem
                      onClick={async () => {
                        await deleteGame(g.id);
                        setGameMenuOpenId(null);
                        await onGameCreated?.();
                      }}
                    >
                      <GameMenuIcon src="/images/DeleteIcon.svg" alt="delete" />
                      삭제
                    </GameMenuItem>
                  </GameDropdown>
                )}
              </GameListComponent>
            ))}
          </GameComponentList>
        </GameList>
        {showPicker && (
          <PickerContainer
            ref={pickerRef}
            $top={pickerPos.top}
            $left={pickerPos.left}
          >
            <PickerList>
              {[
                "네글자퀴즈",
                "노래초성퀴즈",
                "단어텔레파시",
                "대표게임",
                "디스코",
                "명대사퀴즈",
                "액션초성게임",
                "인물퀴즈",
                "텔레스트레이션",
              ].map((name) => (
                <PickerButton key={name} onClick={() => handleCreateGame(name)}>
                  {name}
                </PickerButton>
              ))}
            </PickerList>
          </PickerContainer>
        )}
        {/* 입력 폼 렌더링: 첫 게임이 있으면 해당 타입의 폼을 표시, 없으면 첫 게임 선택 화면 */}
        {games && games.length > 0 ? (
          <>
            {(() => {
              const type = selectedType;
              if (type === "네글자퀴즈")
                return (
                  <FourLetterInput
                    gameType={type}
                    inputs={currentInputs}
                    setInputs={setInputsForSelected}
                    onSave={saveQuestionsForSelected}
                  />
                );
              if (type === "노래초성퀴즈")
                return (
                  <TextTextInput
                    gameType={type}
                    inputs={currentInputs}
                    setInputs={setInputsForSelected}
                    onSave={saveQuestionsForSelected}
                  />
                );
              if (type === "대표게임")
                return (
                  <VerticalTextText
                    gameType={type}
                    inputs={currentInputs}
                    setInputs={setInputsForSelected}
                    onSave={saveQuestionsForSelected}
                  />
                );
              if (
                type === "인물퀴즈" ||
                type === "명대사퀴즈" ||
                type === "명대사 퀴즈"
              )
                return (
                  <ImageTextInput
                    gameType={type}
                    inputs={currentInputs}
                    setInputs={setInputsForSelected}
                    images={currentImages}
                    setImages={setImagesForSelected}
                    onSave={saveQuestionsForSelected}
                  />
                );
              if (
                type === "단어텔레파시" ||
                type === "디스코" ||
                type === "액션초성게임" ||
                type === "텔레스트레이션"
              )
                return (
                  <Textinput
                    gameType={type}
                    inputs={currentInputs}
                    setInputs={setInputsForSelected}
                    onSave={saveQuestionsForSelected}
                  />
                );
              return (
                <Textinput
                  gameType={type}
                  inputs={currentInputs}
                  setInputs={setInputsForSelected}
                  onSave={saveQuestionsForSelected}
                />
              );
            })()}
          </>
        ) : (
          <AddFirstGamePage onSelect={handleCreateGame} />
        )}
        {/* <ImageTextInput
          inputs={inputs}
          setInputs={setInputs}
          images={images}
          setImages={setImages}
        /> */}
      </ProjectDetailContainer>
    </RightCol>
  );
};

export default ProjectDetailPage;

const RightCol = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const TitleImage = styled.img`
  width: 16vw;
  cursor: pointer;
  margin-left: 2.78vw;
`;

const Header = styled.div`
  padding: 5.56vh 2.78vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0px;
  background: #0e193e;
  box-shadow: 0 4px 4.8px 0 rgba(0, 0, 0, 0.17);
`;

const ProjectName = styled.span`
  color: #ff62d3;
  font-family: DungGeunMo;
  font-size: 20px;
  margin-left: 30px;
  cursor: context-menu;
`;


const ProjectDetailContainer = styled.div`
  flex: 1;
  width: 100%;
  background: #1b1c23;
  min-height: 0;
  overflow: auto;
  display: flex;
  padding: 45px;
  position: relative;
`;

const GameComponentList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
`;

const GameListTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameList = styled.div`
  padding: 20px;
  border-radius: 10.82px;
  border: 1.082px solid #555;
  background: #25262d;
  width: 16.67vw;
`;

const GameListTitle = styled.span`
  color: #fff;
  font-size: 18px;
`;

const AddGameBtn = styled.span`
  border-radius: 4px;
  background: #d3d3d3;
  display: flex;
  width: 30px;
  height: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6.607px;
  flex-shrink: 0;
  cursor: pointer;
`;

const GameListComponent = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  position: relative;
`;

const GameListIndex = styled.span`
  color: #fff;
  width: 0.83vw;
  margin: 0 30px 0 10px;
  font-size: 22px;
`;

const GameListBadge = styled.span`
  color: ${(p) => (p.$active ? "#000" : "#ff62d3")};
  font-size: 20px;
  border-radius: 6px;
  background: ${(p) => (p.$active ? "#FF62D3" : "rgba(255, 98, 211, 0.2)")};
  display: flex;
  width: 12.76vw;
  height: 5vh;
  padding: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  cursor: pointer;
`;

const GameDropdown = styled.div`
  position: absolute;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  padding: 6px;
  border-radius: 8px;
  background: #2a2b33;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  z-index: 25;
`;

const GameMenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-family: DungGeunMo;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const GameMenuIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const HeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
`;

const HeaderRight = styled.span`
  display: flex;
  align-items: center;
  gap: 35px;
`;


const PreviewBtn = styled.span`
  border-radius: 6px;
  background: rgba(39, 151, 255, 0.2);
  display: inline-flex;
  padding: 11px 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #2797ff;
  font-family: DungGeunMo;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.4 : 1)};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
`;

const PlayBtn = styled.span`
  border-radius: 6px;
  background: #2797ff;
  display: inline-flex;
  padding: 11px 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-family: DungGeunMo;
  font-size: 18px;
  cursor: pointer;
`;

const Profile = styled.span`
  border-radius: 100px;
  background-color: #fff;
  width: 50px;
  height: 50px;
  font-size: 30px;
  cursor: pointer;
`;

const PickerContainer = styled.div`
  position: absolute;
  top: ${(p) => p.$top + 30}px;
  left: ${(p) => p.$left + 30}px;
  border-radius: 12px;
  border: 1px solid #555;
  background: #25262d;
  box-shadow: 0 4px 6px 2px rgba(0, 0, 0, 0.3);
  padding: 20px;
  box-sizing: border-box;
  z-index: 1000;
`;

const PickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
`;

const PickerButton = styled.button`
  border: none;
  border-radius: 6px;
  background: rgba(255, 203, 15, 0.2);
  color: #ffcb0f;
  font-size: 16px;
  font-family: DungGeunMo;
  padding: 10px 12px;
  text-align: center;
  cursor: pointer;
  outline: none;
  display: inline-block;
  white-space: nowrap;
`;
