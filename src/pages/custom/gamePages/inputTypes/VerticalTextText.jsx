// 대표게임

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const VerticalTextText = ({ inputs, setInputs, onSave, gameType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef({});
  const [showInfo, setShowInfo] = useState(false);

  const handleAddInput = () => {
    // Require both fields for every existing row before adding new one
    const nextErrors = {};
    let firstInvalid = null;
    for (const item of inputs) {
      const d = (item.description || '').trim();
      const m = (item.mission || '').trim();
      if (!d) {
        nextErrors[`${item.id}.description`] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, field: 'description' };
      }
      if (!m) {
        nextErrors[`${item.id}.mission`] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, field: 'mission' };
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (firstInvalid && inputRefs.current[firstInvalid.id]?.[firstInvalid.field]) {
        inputRefs.current[firstInvalid.id][firstInvalid.field].focus();
      }
      return;
    }

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
    // Clear error for this field when user types something
    setErrors((prev) => {
      const key = `${id}.${field}`;
      if (prev[key] && String(newValue).trim().length > 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return prev;
    });
  };

  const handleDelete = (idx) => {
    setInputs((prev) => prev.filter((_, i) => i !== idx).map((it, i) => ({ ...it, id: i + 1 })));
  };
  const containerRef = useRef(null);

  const adjustAllTextareaHeights = () => {
    if (!containerRef.current) return;
    const textareas = containerRef.current.querySelectorAll('textarea');
    textareas.forEach((ta) => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    });
  };

  useEffect(() => {
    // On mount and whenever inputs change (e.g., after navigation),
    // sync textarea heights to their content.
    adjustAllTextareaHeights();
    // Also adjust after a tick in case fonts/layout apply later
    const id = requestAnimationFrame(adjustAllTextareaHeights);
    return () => cancelAnimationFrame(id);
  }, [inputs]);

  const setRef = (id, field) => (el) => {
    if (!inputRefs.current[id]) inputRefs.current[id] = {};
    inputRefs.current[id][field] = el;
  };

  const handleSave = async () => {
    const nextErrors = {};
    let firstInvalid = null;
    for (const item of inputs) {
      const d = (item.description || '').trim();
      const m = (item.mission || '').trim();
      if (!d) {
        nextErrors[`${item.id}.description`] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, field: 'description' };
      }
      if (!m) {
        nextErrors[`${item.id}.mission`] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, field: 'mission' };
      }
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      if (firstInvalid && inputRefs.current[firstInvalid.id]?.[firstInvalid.field]) {
        inputRefs.current[firstInvalid.id][firstInvalid.field].focus();
      }
      return;
    }
    await onSave?.();
  };

  return (
    <InputContainer ref={containerRef}>
      <InputTopRow>
        <GameTypeBadge>{gameType || '대표게임'}</GameTypeBadge>
        <InfoWrapper
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <InfoIcon>i</InfoIcon>
          {showInfo && (
            <HoverImageContainer>
              <HoverImage src="/images/hover_vertical.png" alt="info" />
            </HoverImageContainer>
          )}
        </InfoWrapper>        <EditBtn onClick={() => setIsEditing((v) => !v)}>{isEditing ? '완료' : '편집'}</EditBtn>
      </InputTopRow>
      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item, idx) => (
            <Row key={item.id}>
              <InputBox>
                <InputIndex>{item.id}</InputIndex>
                <InputsColumn>
                  <Input
                    as="textarea"
                    placeholder="지문을 입력해주세요"
                    value={item.description || ""}
                    $error={!!errors[`${item.id}.description`]}
                    ref={setRef(item.id, 'description')}
                    onChange={(e) => {
                      // auto-grow height
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                      handleInputChange(item.id, "description", e.target.value);
                    }}
                    rows={1}
                  />
                  <Input
                    as="textarea"
                    placeholder="미션을 입력해주세요"
                    value={item.mission || ""}
                    $error={!!errors[`${item.id}.mission`]}
                    ref={setRef(item.id, 'mission')}
                    onChange={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                      handleInputChange(item.id, "mission", e.target.value);
                    }}
                    className="bottominput"
                    rows={1}
                  />
                </InputsColumn>
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
      <SaveBtn onClick={handleSave}>저장</SaveBtn>
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
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 35px;
  border-radius: 3px;
  background: rgba(238, 238, 238, 0.2);
`;

const InputIndex = styled.div`
  color: #fff;
  margin-left: 13px;
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 24px;
`;

const Input = styled.textarea`
  width: 100%;
  border-radius: 3px;
  background: rgba(160, 160, 160, 0.7);
  min-height: 42px;
  box-sizing: border-box;
  padding: 10px 16px;
  line-height: 1.4;
  overflow: hidden;
  resize: none;
  border: 2px solid ${(p) => (p.$error ? '#ff3b30' : 'transparent')};

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;

  &::placeholder {
    color: #25262d;
    font-family: DungGeunMo;
    font-size: 18px;
  }

  &:focus {
    border: 3px solid ${(p) => (p.$error ? '#ff3b30' : 'gray')};
    outline: none;
  }

  &.bottominput {
    background-color: white;

    &::placeholder {
      color: #636161;
    }
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
`

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
  width: 11vw;
  height: 5vh;
  padding: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const InfoWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 20px;
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
  cursor: pointer;
  &:hover {
    background: #a0a0a0;
  }
`;

const HoverImageContainer = styled.div`
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-10%);
  padding: 4px;
  z-index: 9999;
`;

const HoverImage = styled.img`
  width: 37.57vw;
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
