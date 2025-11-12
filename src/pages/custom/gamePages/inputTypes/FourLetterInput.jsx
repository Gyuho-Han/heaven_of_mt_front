// 네글자퀴즈

import React, { useRef, useState } from "react";
import styled from "styled-components";

const FourLetterInput = ({ inputs, setInputs, onSave, gameType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({}); // { [id]: true }
  const inputRefs = useRef({});

  const handleAddInput = () => {
    // validate existing rows: require exactly 2 chars (after trim) before adding
    const nextErrors = {};
    let firstInvalid = null;
    for (const item of inputs) {
      const v = (item.value || '').trim();
      if (v.length !== 2) {
        nextErrors[item.id] = true;
        if (!firstInvalid) firstInvalid = item.id;
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (firstInvalid && inputRefs.current[firstInvalid]) {
        inputRefs.current[firstInvalid].focus?.();
      }
      return;
    }
    setInputs((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  const handleValueChange = (id, rawValue) => {
    const limited = (rawValue || "").slice(0, 2);
    setInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: limited } : item))
    );
    const trimmedLen = (limited || '').trim().length;
    setErrors((prev) => {
      const next = { ...prev };
      if (trimmedLen === 2) {
        if (next[id]) delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  const handleDelete = (idx) => {
    setInputs((prev) => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, id: i + 1 })));
  };
  return (
    <InputContainer>
      <InputTopRow>
        <GameTypeBadge>{gameType || '네글자퀴즈'}</GameTypeBadge>
        <InfoIcon>i</InfoIcon>
        <EditBtn onClick={() => setIsEditing((v) => !v)}>{isEditing ? '완료' : '편집'}</EditBtn>
      </InputTopRow>

      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item, idx) => (
            <Row key={item.id}>
              <InputBox>
                <InputIndex>{item.id}</InputIndex>
                <Input
                  maxLength={2}
                  value={item.value || ""}
                  $error={!!errors[item.id]}
                  ref={(el) => (inputRefs.current[item.id] = el)}
                  onChange={(e) => handleValueChange(item.id, e.target.value)}
                />
                <EmptySquare />
                <EmptySquare />
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
      <SaveBtn onClick={() => {
        const nextErrors = {};
        let firstInvalid = null;
        for (const item of inputs) {
          const v = (item.value || '').trim();
          if (v.length !== 2) {
            nextErrors[item.id] = true;
            if (!firstInvalid) firstInvalid = item.id;
          }
        }
        if (Object.keys(nextErrors).length > 0) {
          setErrors(nextErrors);
          if (firstInvalid && inputRefs.current[firstInvalid]) {
            inputRefs.current[firstInvalid].focus?.();
          }
          return;
        }
        onSave?.();
      }}>저장</SaveBtn>
    </InputContainer>
  );
};

export default FourLetterInput;

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
  justify-content: flex-start;
  align-items: center;
  border-radius: 3px;
  background: rgba(238, 238, 238, 0.2);
  gap: 10px;
`;

const InputIndex = styled.div`
  color: #fff;
  margin-left: 13px;
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 24px;
`;

const Input = styled.input`
  width: 60px;
  height: 3.33vh;
  min-height: 30px;
  margin-left: 30px;
  text-align: center;

  font-family: DungGeunMo;
  font-size: 19px;
  color: #fff;

  background: transparent;
  border: none;
  border-bottom: ${(p) => (p.$error ? '2px solid #ff3b30' : '1px solid #fff')};
  border-radius: 0;
  padding: 2px 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-family: DungGeunMo;
    font-size: 18px;
    text-align: center;
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid ${(p) => (p.$error ? '#ff3b30' : '#fff')};
  }
`;

const EmptySquare = styled.div`
  height: 3.33vh;
  min-height: 30px;
  width: 3.33vh;
  min-width: 30px;

  border-radius: 3px;
  border: 1px solid rgba(160, 160, 160, 0.7);
  background: rgba(160, 160, 160, 0.7);
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
`

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
