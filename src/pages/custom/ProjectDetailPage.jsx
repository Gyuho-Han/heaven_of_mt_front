import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const addGameBtnRef = useRef(null);
  const pickerRef = useRef(null);
  const containerRef = useRef(null);
  const [inputs, setInputs] = useState([{ id: 1, value: "" }]);

  const handleOpenPicker = () => {
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

  const handleAddInput = () => {
    setInputs((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  // 입력값 업데이트
  const handleInputChange = (id, newValue) => {
    setInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  return (
    <RightCol>
      <Header>
        <HeaderLeft>
          <TitleImage
            src="/images/title.png"
            alt="title"
            onClick={() => navigate("/")}
          />
        </HeaderLeft>
        <HeaderRight>
          <PreviewBtn>미리보기</PreviewBtn>
          <PlayBtn>게임하기</PlayBtn>
          <Profile />
        </HeaderRight>
      </Header>
      <ProjectDetailContainer ref={containerRef}>
        <GameList>
          <GameListTopRow>
            <GameListTitle>전체 게임</GameListTitle>
            <AddGameBtn ref={addGameBtnRef} onClick={handleOpenPicker}>
              +
            </AddGameBtn>
          </GameListTopRow>
          <GameComponentList>
            {/* use map to show all project of the user */}
            <GameListComponent>
              <GameListIndex>1</GameListIndex>
              <GameListBadge>텔레스트레이션</GameListBadge>
            </GameListComponent>
            <GameListComponent>
              <GameListIndex>2</GameListIndex>
              <GameListBadge>인물퀴즈</GameListBadge>
            </GameListComponent>
            {/* use map to show all project of the user */}
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
                "노래초성게임",
                "단어텔레파시",
                "대표게임",
                "디스코",
                "명대사퀴즈",
                "액션초성게임",
                "인물퀴즈",
                "텔레스트레이션",
              ].map((name) => (
                <PickerButton key={name}>{name}</PickerButton>
              ))}
            </PickerList>
          </PickerContainer>
        )}
        <InputContainer>
          <InputTopRow>
            <GameTypeBadge>텔레스트레이션</GameTypeBadge>
            <InfoIcon>i</InfoIcon>
            <EditBtn>편집</EditBtn>
          </InputTopRow>
          <InputTitles>
            <InputTitle>파일</InputTitle>
            <InputTitle>정답</InputTitle>
          </InputTitles>
          <InputBoxesScrollArea>
            <InputBoxesContainer>
              {inputs.map((item) => (
                <InputBox key={item.id}>
                  <InputIndex>{item.id}</InputIndex>
                  <Input
                    placeholder="단어를 입력해주세요"
                    value={item.value}
                    onChange={(e) => handleInputChange(item.id, e.target.value)}
                  />
                </InputBox>
              ))}
            </InputBoxesContainer>
            <AddInputBoxBtn onClick={handleAddInput}>+</AddInputBoxBtn>
          </InputBoxesScrollArea>
          <SaveBtn>저장</SaveBtn>
        </InputContainer>
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
`;

const GameListIndex = styled.span`
  color: #fff;
  width: 0.83vw;
  margin: 0 30px 0 10px;
  font-size: 22px;
`;

const GameListBadge = styled.span`
  color: #ff62d3;
  font-size: 20px;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.2);
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

const HeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
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
  cursor: pointer;
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

const InputTopRow = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const GameTypeBadge = styled.span`
  color: #ff62d3;
  font-size: 22px;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.2);
  display: flex;
  width: 14vw;
  height: 7vh;
  padding: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const InfoIcon = styled.span`
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 15.961px;
  border-radius: 19.153px;
  background: #858587;
  display: flex;
  width: 13px;
  height: 13px;
  padding: 4.873px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-left: 20px;
`;

const EditBtn = styled.span`
  color: #858587;
  font-family: DungGeunMo;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 150px;

  &:hover {
    text-decoration: underline;
  }
`;

const InputContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const InputTitles = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
`;

const InputTitle = styled.span`
  color: #fff;
  font-family: DungGeunMo;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  display: flex;
  margin: 0 auto;
`;

const InputBoxesContainer = styled.div`
  padding-right: 40px;
`;

const InputBox = styled.div`
  background-color: red;
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  background: rgba(238, 238, 238, 0.2);
  margin-top: 15px;
`;

const InputIndex = styled.div`
  color: #fff;
  margin-left: 13px;
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 24px;
`;

const Input = styled.input`
  width: 88%;
  border-radius: 3px;
  background: rgba(160, 160, 160, 0.7);
  height: 30px;
  padding-left: 25px;

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;

  &::placeholder {
    color: #25262d;
    font-family: DungGeunMo;
    font-size: 18px;
  }

  &:focus {
    border: 3px solid gray;
    outline: none;
  }
`;

const AddInputBoxBtn = styled.div`
  border-radius: 4px;
  background: #d3d3d3;
  display: flex;
  width: 26px;
  height: 26px;
  padding: 6.106px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6.106px;
  flex-shrink: 0;
  color: #000;
  font-family: DungGeunMo;
  font-size: 25px;
  cursor: pointer;
  margin: 40px auto 0 auto;
`;

const SaveBtn = styled.div`
  align-self: center;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.3);
  width: 95%;
  height: 40px;
  color: #ff62d3;
  font-family: DungGeunMo;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 8px;
  margin-right: 35px;

  &:hover {
    background: rgba(255, 98, 211, 0.45);
  }
`;

const InputBoxesScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 8px; /* small breathing room above SaveBtn */
`;
