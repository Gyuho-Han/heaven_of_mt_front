// 노래초성게임

import React, { useState } from "react";
import styled from "styled-components";

const TextTextInput = ({ inputs, setInputs, onSave, gameType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const handleAddInput = () => {
    setInputs((prev) => [
      ...prev,
      { id: prev.length + 1, title: "", artist: "" },
    ]);
  };

  const handleInputChange = (id, field, newValue) => {
    setInputs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const handleDelete = (idx) => {
    setInputs((prev) =>
      prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, id: i + 1 }))
    );
  };
  return (
    <InputContainer>
      <InputTopRow>
        <GameTypeBadge>{gameType || '노래초성게임'}</GameTypeBadge>
        <InfoIcon>i</InfoIcon>
        <EditBtn onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? "완료" : "편집"}
        </EditBtn>
      </InputTopRow>
      <InputTitles>
        <InputTitle>제목</InputTitle>
        <InputTitle>가수</InputTitle>
      </InputTitles>
      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item, idx) => (
            <Row key={item.id}>
              <InputBox>
                <InputIndex>{item.id}</InputIndex>
                <Input
                  placeholder="노래 제목을 입력해주세요"
                  value={item.title || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "title", e.target.value)
                  }
                />
                <Input2
                  placeholder="노래 가수를 입력해주세요"
                  value={item.artist || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "artist", e.target.value)
                  }
                />
              </InputBox>
              {isEditing && (
                <DeleteIcon
                  src="/images/deleteBtn.svg"
                  alt="delete"
                  onClick={() => handleDelete(idx)}
                />
              )}
            </Row>
          ))}
        </InputBoxesContainer>
        {(inputs?.length ?? 0) < 20 && (
          <AddInputBoxBtn onClick={handleAddInput}>+</AddInputBoxBtn>
        )}
      </InputBoxesScrollArea>
      <SaveBtn onClick={onSave}>저장</SaveBtn>
    </InputContainer>
  );
};

export default TextTextInput;

const InputContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const InputBoxesContainer = styled.div`
  padding-right: 40px;
`;

const InputBox = styled.div`
  background-color: red;
  flex: 1;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 3px;
  background: rgba(238, 238, 238, 0.2);
  gap: 60px;
`;

const InputIndex = styled.div`
  color: #fff;
  margin-left: 13px;
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 24px;
`;

const Input = styled.input`
  flex: 1;
  border-radius: 3px;
  background: rgba(160, 160, 160, 0.7);
  height: 30px;

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;
  margin-right: 10px;

  &::placeholder {
    color: #25262d;
    font-family: DungGeunMo;
    font-size: 18px;
    text-align: center;
  }

  &:focus {
    border: 3px solid gray;
    outline: none;
  }
`;

const DeleteIcon = styled.img`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  cursor: pointer;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
`;

const Input2 = styled.input`
  flex: 1;
  height: 3.33vh;
  min-height: 30px;

  border-radius: 3px;
  border: 1px solid #d9d9d9;
  background: rgba(255, 255, 255, 0.8);

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;
  margin-right: 40px;

  &::placeholder {
    color: #25262d;
    font-family: DungGeunMo;
    font-size: 18px;
    text-align: center;
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
  width: 11vw;
  height: 5vh;
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

const InputTitles = styled.div`
  display: flex;
  width: 97%;
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
