// 네글자퀴즈

import React from "react";
import styled from "styled-components";

const FourLetterInput = ({ inputs, setInputs }) => {
  return (
    <FirstGamePageContainer>
      <Title>첫번째 게임을 선택해주세요</Title>
      <Columns>
        <LeftCol>
          <GameTypeBadge>노래초성게임</GameTypeBadge>
          <GameTypeBadge>단어텔레파시</GameTypeBadge>
          <GameTypeBadge>대표게임</GameTypeBadge>
          <GameTypeBadge>디스코</GameTypeBadge>
        </LeftCol>
        <RightCol>
          <GameTypeBadge>명대사퀴즈</GameTypeBadge>
          <GameTypeBadge>액션초성게임</GameTypeBadge>
          <GameTypeBadge>인물퀴즈</GameTypeBadge>
          <GameTypeBadge>텔레스트레이션</GameTypeBadge>
        </RightCol>
      </Columns>
    </FirstGamePageContainer>
  );
};

export default FourLetterInput;

const FirstGamePageContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const Title = styled.div`
  color: #f8f9ff;
  font-size: 24px;
  padding: 30px 0;
`;

const Columns = styled.div`
  display: flex;
  width: 100%;
`;

const LeftCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RightCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GameTypeBadge = styled.span`
  color: #ff62d3;
  font-size: 22px;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.2);
  display: flex;
  width: 13vw;
  height: 5vh;
  padding: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  margin: 15px;
`;
