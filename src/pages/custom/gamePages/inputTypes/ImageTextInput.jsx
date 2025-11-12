// 인물퀴즈, 명대사 퀴즈

import React, { useRef, useState } from "react";
import styled from "styled-components";

const ImageTextInput = ({
  inputs,
  setInputs,
  images = {},
  setImages,
  onSave,
  gameType,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [missing, setMissing] = useState({}); // { [id]: true } when image required but missing
  const [textErrors, setTextErrors] = useState({}); // { [id]: true } when answer text missing
  const inputRefs = useRef({}); // { [id]: { file: ref, text: ref } }
  const getNameFromUrl = (url = "") => {
    try {
      const noQuery = url.split('?')[0];
      const parts = noQuery.split('/');
      const raw = parts[parts.length - 1] || '';
      return decodeURIComponent(raw);
    } catch (e) {
      return '이미지';
    }
  };
  const setFileRef = (id) => (el) => {
    if (!inputRefs.current[id]) inputRefs.current[id] = {};
    inputRefs.current[id].file = el;
  };

  const setTextRef = (id) => (el) => {
    if (!inputRefs.current[id]) inputRefs.current[id] = {};
    inputRefs.current[id].text = el;
  };

  const handleAddInput = () => {
    // Require existing rows to have both image and non-empty text
    const imgMissing = {};
    const txtMissing = {};
    let firstInvalid = null;
    for (const item of inputs) {
      const img = images?.[item.id];
      const hasImage = !!(img?.file || img?.previewUrl);
      const txt = (item.value || '').trim();
      if (!hasImage) {
        imgMissing[item.id] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, kind: 'file' };
      }
      if (!txt) {
        txtMissing[item.id] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, kind: 'text' };
      }
    }
    setMissing(imgMissing);
    setTextErrors(txtMissing);
    if (firstInvalid) {
        const ref = inputRefs.current[firstInvalid.id]?.[firstInvalid.kind];
        if (ref) {
          if (firstInvalid.kind === 'file' && typeof ref.click === 'function') ref.click();
          else if (typeof ref.focus === 'function') ref.focus();
        }
        return;
    }
    setInputs((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  const handleInputChange = (id, newValue) => {
    setInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
    // clear text error on valid input
    if ((newValue || '').trim().length > 0) {
      setTextErrors((prev) => {
        if (!prev[id]) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleImageChange = (id, file) => {
    if (!setImages) return;
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImages((prev) => ({
      ...(prev || {}),
      [id]: { file, previewUrl },
    }));
    // clear missing flag once user selects an image
    setMissing((m) => ({ ...m, [id]: false }));
  };

  const handleSave = () => {
    // Validate: every row must have an image and non-empty text
    const imgMissing = {};
    const txtMissing = {};
    let firstInvalid = null;
    for (const item of inputs) {
      const img = images?.[item.id];
      const hasImage = !!(img?.file || img?.previewUrl);
      const txt = (item.value || '').trim();
      if (!hasImage) {
        imgMissing[item.id] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, kind: 'file' };
      }
      if (!txt) {
        txtMissing[item.id] = true;
        if (!firstInvalid) firstInvalid = { id: item.id, kind: 'text' };
      }
    }
    setMissing(imgMissing);
    setTextErrors(txtMissing);
    if (firstInvalid) {
      const ref = inputRefs.current[firstInvalid.id]?.[firstInvalid.kind];
      if (ref) {
        if (firstInvalid.kind === 'file' && typeof ref.click === 'function') ref.click();
        else if (typeof ref.focus === 'function') ref.focus();
      }
      return;
    }
    onSave?.();
  };

  // 편집 모드에서는 삭제만 허용

  const handleDelete = (idx) => {
    const prev = inputs;
    const next = prev.filter((_, i) => i !== idx);
    const reindexed = next.map((item, i) => ({ ...item, id: i + 1 }));
    setInputs(reindexed);
    if (setImages) {
      setImages((prevImages) => {
        const newImages = {};
        next.forEach((item, i) => {
          const oldId = item.id; // old id before reindex
          const newId = i + 1;
          if (prevImages?.[oldId]) newImages[newId] = prevImages[oldId];
        });
        return newImages;
      });
    }
  };
  return (
    <InputContainer>
      <InputTopRow>
        <GameTypeBadge>{gameType || '인물퀴즈'}</GameTypeBadge>
        <InfoIcon>i</InfoIcon>
        <EditBtn onClick={() => setIsEditing((v) => !v)}>
          {isEditing ? "완료" : "편집"}
        </EditBtn>
      </InputTopRow>
      <InputTitles>
        <InputTitle>사진</InputTitle>
        <InputTitle>정답</InputTitle>
      </InputTitles>
      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item, idx) => (
            <Row key={item.id}>
              <InputBox>
                <InputIndex>{item.id}</InputIndex>
                <ImageInputWrapper
                  htmlFor={`image-file-${item.id}`}
                  $error={!!missing[item.id]}
                >
                  {(() => {
                    const img = images?.[item.id];
                    if (img?.file) {
                      return (
                        <FileName title={img.file.name}>{img.file.name}</FileName>
                      );
                    }
                    if (img?.previewUrl) {
                      const name = getNameFromUrl(img.previewUrl);
                      return <FileName title={name}>{name}</FileName>;
                    }
                    return <PlaceholderText>사진을 넣어주세요</PlaceholderText>;
                  })()}
                </ImageInputWrapper>
                <HiddenFileInput
                  id={`image-file-${item.id}`}
                  type="file"
                  accept="image/*"
                  ref={setFileRef(item.id)}
                  onChange={(e) =>
                    handleImageChange(item.id, e.target.files?.[0])
                  }
                />
                <Input
                  placeholder="해당 정답을 입력해주세요"
                  value={item.value ?? ''}
                  $error={!!textErrors[item.id]}
                  ref={setTextRef(item.id)}
                  onChange={(e) => handleInputChange(item.id, e.target.value)}
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
      <SaveBtn onClick={handleSave}>저장</SaveBtn>
    </InputContainer>
  );
};

export default ImageTextInput;

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

const InputBoxesContainer = styled.div`
  padding-right: 40px;
`;

const InputBox = styled.div`
  flex: 1;
  padding: 5px;
  display: grid;
  grid-template-columns: 30px 1fr 1fr; /* index | image | answer */
  align-items: center;
  column-gap: 40px;
  border-radius: 3px;
  background: rgba(238, 238, 238, 0.2);
  min-width: 0;
`;

const InputIndex = styled.div`
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 24px;
  width: 52px;
  text-align: center;
`;

const Input = styled.input`
  width: 90%;
  height: 3.33vh;
  min-height: 30px;

  border-radius: 3px;
  border: 2px solid ${(p) => (p.$error ? '#ff3b30' : '#d9d9d9')};
  background: rgba(255, 255, 255, 0.8);

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;
  margin-right: 0;
  min-width: 0; /* allow truncation when space tight */
  max-width: 100%;

  &::placeholder {
    color: #636161;
    text-align: center;
    font-family: DungGeunMo;
    font-size: 18px;
  }

  &:focus {
    border: 3px solid ${(p) => (p.$error ? '#ff3b30' : 'gray')};
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

const ImageInputWrapper = styled.label`
  flex: 1; /* match text input width (50/50 split) */
  height: 33px; /* match text input height */
  border-radius: 3px; /* match text input radius */
  background: rgba(160, 160, 160, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #25262d;
  font-family: DungGeunMo;
  font-size: 18px; /* match text input font size */
  cursor: pointer;
  overflow: hidden;
  border: ${(p) => (p.$error ? "2px solid #FF3B30" : "1px solid transparent")};
  min-width: 0;
  width: 93%;
  box-sizing: border-box;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PlaceholderText = styled.span`
  color: #25262d;
  opacity: 1; /* mimic placeholder visibility */
`;

const FileName = styled.span`
  color: #25262d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
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
  min-width: 0;
`;
