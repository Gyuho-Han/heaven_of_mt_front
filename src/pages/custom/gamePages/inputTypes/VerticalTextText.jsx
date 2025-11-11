// 대표게임

import React from "react";
import styled from "styled-components";

const VerticalTextText = ({ inputs, setInputs }) => {
  const handleAddInput = () => {
    setInputs((prev) => [
      ...prev,
      { id: prev.length + 1, description: "", mission: "" },
    ]);
  };

  const handleInputChange = (id, field, newValue) => {
    setInputs((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };
  return (
    <InputContainer>
      <InputTopRow>
        <GameTypeBadge>대표게임</GameTypeBadge>
        <InfoIcon>i</InfoIcon>
        <EditBtn>편집</EditBtn>
      </InputTopRow>
      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item) => (
            <InputBox key={item.id}>
              <InputIndex>{item.id}</InputIndex>
              <InputsColumn>
                <Input
                  placeholder="지문을 입력해주세요"
                  value={item.description || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "description", e.target.value)
                  }
                />
                <Input
                  placeholder="미션을 입력해주세요"
                  value={item.mission || ""}
                  onChange={(e) =>
                    handleInputChange(item.id, "mission", e.target.value)
                  }
                  className="bottominput"
                />
              </InputsColumn>
            </InputBox>
          ))}
        </InputBoxesContainer>
        <AddInputBoxBtn onClick={handleAddInput}>+</AddInputBoxBtn>
      </InputBoxesScrollArea>
      <SaveBtn>저장</SaveBtn>
    </InputContainer>
  );
};

export default VerticalTextText;

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
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 35px;
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
  width: 100%;
  border-radius: 3px;
  background: rgba(160, 160, 160, 0.7);
  height: 42px;
  min-height: 36px;
  box-sizing: border-box;
  padding: 6px 30px;

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

  &.bottominput {
    background-color: white;

    &::placeholder {
      color: #636161;
    }
  }
`;

const InputsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
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
  margin-top: 20px;
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
