
import React from 'react';
import styled from 'styled-components';

const Onboarding = ({ image, recommendedPeople, difficulty, instructions }) => {
  return (
    <Container>
      <Image src={image} alt="onboarding" />
      <InfoContainer>
        <Info>
          <Title>권장인원:</Title>
          <Value>{recommendedPeople}</Value>
        </Info>
        <Info>
          <Title>난이도:</Title>
          <Value>{difficulty}</Value>
        </Info>
      </InfoContainer>
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
  background-size: fill;
  padding: 4.3vh 2.8vw;
  display: flex;
  flex-direction: column;
`;

const Image = styled.img`
  width: 22.2vw;
  height: 22.2vh;
  border-radius: 16px;
  object-fit: cover;
`;

const InfoContainer = styled.div`
  display: flex;
  margin-top: 1.9vh;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 35px;
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
`;

const InstructionText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  color: white;
  font-size: 1.59vw;
  font-weight: 400;
  margin: 0;
  white-space: pre-wrap;
`;
