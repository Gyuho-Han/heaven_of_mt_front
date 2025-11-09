import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });
  const addGameBtnRef = useRef(null);
  const pickerRef = useRef(null);
  const containerRef = useRef(null);

  const handleOpenPicker = () => {
    const el = addGameBtnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setPickerPos({ top: rect.top - containerRect.top, left: rect.left - containerRect.left });
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  return (
    <RightCol>
      <Header>
        <HeaderLeft>
          <TitleImage src="/images/title.png" alt="title" onClick={() => navigate('/')} />
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
            <AddGameBtn ref={addGameBtnRef} onClick={handleOpenPicker}>+</AddGameBtn>
          </GameListTopRow>
          <GameComponentList>
            {/* use map to show all project of the user */}
            <GameListComponent>
              <GameListIndex>1</GameListIndex>
              <GameListBadge>인물퀴즈</GameListBadge>
            </GameListComponent>
            <GameListComponent>
              <GameListIndex>2</GameListIndex>
              <GameListBadge>인물퀴즈</GameListBadge>
            </GameListComponent>
            {/* use map to show all project of the user */}
          </GameComponentList>
        </GameList>
        {showPicker && (
          <PickerContainer ref={pickerRef} $top={pickerPos.top} $left={pickerPos.left}>
            <PickerList>
              {[
                '네글자퀴즈',
                '노래초성게임',
                '단어텔레파시',
                '대표게임',
                '디스코',
                '명대사퀴즈',
                '액션초성게임',
                '인물퀴즈',
                '텔레스트레이션',
              ].map((name) => (
                <PickerButton key={name}>{name}</PickerButton>
              ))}
            </PickerList>
          </PickerContainer>
        )}
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
  background: #0E193E;
  box-shadow: 0 4px 4.8px 0 rgba(0, 0, 0, 0.17);
`;

const ProjectDetailContainer = styled.div`
  flex: 1;
  width: 100%;
  background: #1B1C23;
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
  background: #25262D;
  width: 16.67vw;
`;

const GameListTitle = styled.span`
  color: #fff;
  font-size: 18px;
`;

const AddGameBtn = styled.span`
  border-radius: 4px;
  background: #D3D3D3;
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
  color: #FF62D3;
  font-size: 20px;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.20);
  display: flex;
  width: 12.76vw;
  height: 5.00vh;
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
  background: rgba(39, 151, 255, 0.20);
  display: inline-flex;
  padding: 11px 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #2797FF;
  font-family: DungGeunMo;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
`;

const PlayBtn = styled.span`
  border-radius: 6px;
  background: #2797FF;
  display: inline-flex;
  padding: 11px 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #FFF;
  font-family: DungGeunMo;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
  background: #25262D;
  box-shadow: 0 4px 6px 2px rgba(0, 0, 0, 0.30);
  padding: 20px;
  box-sizing: border-box;
  z-index: 1000;
`;

const PickerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PickerButton = styled.button`
  border: none;
  border-radius: 6px;
  background: rgba(255, 203, 15, 0.20);
  color: #FFCB0F;
  font-size: 18px;
  padding: 10px 12px;
  text-align: center;
  cursor: pointer;
  outline: none;
  display: inline-block;
  white-space: nowrap;
`;

