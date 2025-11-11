// 인물퀴즈, 명대사 퀴즈

import React from "react";
import styled from "styled-components";

const ImageTextInput = ({ inputs, setInputs, images = {}, setImages }) => {
  const handleAddInput = () => {
    setInputs((prev) => [...prev, { id: prev.length + 1, value: "" }]);
  };

  const handleInputChange = (id, newValue) => {
    setInputs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const handleImageChange = (id, file) => {
    if (!setImages) return;
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImages((prev) => ({
      ...(prev || {}),
      [id]: { file, previewUrl },
    }));
  };
  return (
    <InputContainer>
      <InputTopRow>
        <GameTypeBadge>인물퀴즈</GameTypeBadge>
        <InfoIcon>i</InfoIcon>
        <EditBtn>편집</EditBtn>
      </InputTopRow>
      <InputTitles>
        <InputTitle>사진</InputTitle>
        <InputTitle>정답</InputTitle>
      </InputTitles>
      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item) => (
            <InputBox key={item.id}>
              <InputIndex>{item.id}</InputIndex>
              <ImageInputWrapper htmlFor={`image-file-${item.id}`}>
                {images?.[item.id]?.file ? (
                  <FileName title={images[item.id].file.name}>
                    {images[item.id].file.name}
                  </FileName>
                ) : (
                  <PlaceholderText>사진을 넣어주세요</PlaceholderText>
                )}
              </ImageInputWrapper>
              <HiddenFileInput
                id={`image-file-${item.id}`}
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleImageChange(item.id, e.target.files?.[0])
                }
              />
              <Input
                placeholder="해당 정답을 입력해주세요"
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
  width: 100%;
  padding: 5px;
  display: flex;
  align-items: center;
  gap: 50px;
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
  flex: 1;
  height: 3.33vh;
  min-height: 30px;
  padding-left: 25px;

  border-radius: 3px;
  border: 1px solid #d9d9d9;
  background: rgba(255, 255, 255, 0.8);

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;
  margin-right: 40px;

  &::placeholder {
    color: #636161;
    text-align: center;
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
