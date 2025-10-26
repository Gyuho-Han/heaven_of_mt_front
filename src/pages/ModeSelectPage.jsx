import React from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function ModeSelectPage() {
    const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <TitleImage
          src="/images/title.png"
          alt="title"
          onClick={() => navigate('/')} />
      </Header>
      <SelectTitleRow>
        <SelectTitleIcon src="/images/left_mode_select.svg"/> 
        <SelectModeTitle>Select Mode</SelectModeTitle>
        <SelectTitleIcon src="/images/right_mode_select.svg"/>
      </SelectTitleRow>
      
      <ButtonsRow>
        <PageBtnArea onClick={() => navigate('/random_home')}>
          <PageBtnIcon
            src="/images/randomPageImageDice.svg"
            alt="RandomPageIcon"
          />
          <BtnTitle>Random</BtnTitle>
          <ModeDesc>This mode is random mode</ModeDesc>
        </PageBtnArea>

        <PageBtnArea onClick={() => navigate('/random_home')}>
          <PageBtnIcon
            src="/images/customPageImage.svg"
            alt="customPageIcon"
          />
          <BtnTitle>Custom</BtnTitle>
          <ModeDesc>This mode is custom mode</ModeDesc>
        </PageBtnArea>
      </ButtonsRow>
      
    </Container>
  )
}

export default ModeSelectPage

const Container = styled.div`
  background-image: url('/images/home.gif');
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  outline: none;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5.6vh 0 0 0;
  margin-bottom: 3.2vh;
`;

const TitleImage = styled.img`
  width: 13.5vw;
  height: 5vh;
  margin-left: 9.5vw;
  position: absolute;
  top: 6vh;
  cursor: pointer;
`;

const PageBtnArea = styled.div`
  width: clamp(220px, 28vw, 450px);
  height: clamp(240px, 28vw, 420px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: clamp(12px, 2vw, 24px);
  border-radius: 19.354px;
  border: 0.968px solid rgba(166, 166, 166, 0.50);
  background: linear-gradient(0deg, rgba(242, 244, 246, 0.75) 0%, rgba(242, 244, 246, 0.75) 100%),
              linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%);
  backdrop-filter: blur(1.935393214225769px);
  color: #000;
  cursor: pointer;

  &:hover {
    background: linear-gradient(0deg, rgba(255, 98, 211, 0.65) 0%, rgba(255, 98, 211, 0.65) 100%),
                linear-gradient(180deg, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%);
    color: #FFF;
  }
`;

const PageBtnIcon = styled.img`
  width: 50%;
  height: auto;
  max-height: 50%;
  object-fit: contain;
  display: block;
  cursor: pointer;
  margin-bottom: clamp(8px, 1.5vw, 16px);
`;

const BtnTitle = styled.div`
  font-family: DungGeunMo;
  font-size: clamp(20px, 3.8vw, 62px);
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 3.72px;
  text-align: center;
`;

const ButtonsRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(40px, 5vw, 70px);
  width: 100%;
  box-sizing: border-box;
  padding: 0 clamp(12px, 3vw, 40px);
  margin-bottom: 30px;
`;
const SelectTitleRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: clamp(30px, 4vw, 50px);
  width: 100%;
  box-sizing: border-box;
  font-size: clamp(38px, 4.7vw, 75px);
  line-height: 1;
  margin-bottom: clamp(40px, 8vh, 100px);
`;

const ModeDesc = styled.div`
  font-family: DungGeunMo;
  font-size: 31.502px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const SelectModeTitle = styled.span`
  font-family: DungGeunMo;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  text-transform: capitalize;
  display: inline-flex;
  align-items: center;

  background: linear-gradient(0deg, #FF00B8 -5.07%, #FFC8F0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SelectTitleIcon = styled.img`
  height: 0.5em;
  width: auto;
  flex-shrink: 0;
`;
