
import React from 'react';
import styled from 'styled-components';

const Onboarding = ({ image, recommendedPeople, difficulty, instructions }) => {
  return (
    <Container>
      <TopRow>
        <Image src={image} alt="onboarding" />
        <Meta>
          <SpacerSmall />
          <MetaBlock>
            <Title>권장인원:</Title>
            <MetaGapSmall />
            <Value>{recommendedPeople}</Value>
          </MetaBlock>
          <MetaGapLarge />
          <MetaBlock>
            <Title>난이도:</Title>
            <MetaGapSmall />
            <Value>{difficulty}</Value>
          </MetaBlock>
        </Meta>
      </TopRow>
      <InstructionsContainer>
        {instructions.map((instruction, index) => (
          <Instruction key={index}>
            <InstructionIndex>{instruction.index}</InstructionIndex>
            <InstructionText>{instruction.text}</InstructionText>
          </Instruction>
        ))}
      </InstructionsContainer>
    </Container>
  );
};

export default Onboarding;

const Container = styled.div`
  width: 43vw;
  height: 80.6vh;
  background-image: url('/images/back_image.png');
  background-size: 100% 100%;
  background-position: center;
  padding-top: 4.3vh;
  padding-left: 2.8vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  border-radius: 16px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2.734vw; /* 35/1280 of width */
`;

const Image = styled.img`
  width: 22.2vw;
  height: 22.2vh;
  border-radius: 16px;
  object-fit: fill;
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpacerSmall = styled.div`
  height: 1.9vh;
`;

const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaGapSmall = styled.div`
  height: 1vh;
`;

const MetaGapLarge = styled.div`
  height: 3.7vh;
`;

const Title = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  color: white;
  font-size: 1.6vw;
  font-weight: 400;
  margin: 0;
`;

const Value = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  color: white;
  font-size: 1.6vw;
  font-weight: 400;
  margin: 0;
  margin-top: 1vh;
`;

const InstructionsContainer = styled.div`
  margin-top: 2.99vh;
  overflow: auto;
  padding-right: 2vw;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Instruction = styled.div`
  display: flex;
  margin-bottom: 1.5vh;
`;

const InstructionIndex = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  color: white;
  font-size: 1.59vw;
  font-weight: 400;
  margin: 0;
  margin-right: 10px;
  margin-top: 11px;
`;

const InstructionText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  color: white;
  font-size: 1.59vw;
  font-weight: 400;
  margin: 0;
  white-space: pre-wrap;
  margin-top: 7px;
  line-height: 1.4;
`;
