import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CustomHome = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Contents>
        <LeftCol>
          <AddProjectBtn>
            + 새로운 프로젝트
          </AddProjectBtn>
          <ProjectsListContainer>
            프로젝트
          </ProjectsListContainer>
        </LeftCol>
        <RightCol>
          <Header>
            <HeaderLeft>
              <TitleImage
                  src="/images/title.png"
                  alt="title"
                  onClick={() => navigate('/')}
                />
              </HeaderLeft>
              <HeaderRight>
                <PreviewBtn>
                  미리보기
                </PreviewBtn>
                <PlayBtn>
                  게임하기
                </PlayBtn>
                <Profile />
              </HeaderRight>
          </Header>
          <ProjectDetailContainer>
            
          </ProjectDetailContainer>
        </RightCol>
      </Contents>
    </Container>
  );
};

export default CustomHome;

const Container = styled.div`
  background-image: url('/images/home.gif');
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  outline: none;
`;

const TitleImage = styled.img`
  width: 16vw;
  cursor: pointer;
  margin-left: 3.5vw;
`;

const LeftCol = styled.div`
  flex: 1;
  padding: 20px;
`

const RightCol = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  min-height: 0; /* allow children to size within available height */
`

const Header = styled.div`
  padding: 50px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0px;
  background: #0E193E;
  box-shadow: 0 4px 4.8px 0 rgba(0, 0, 0, 0.17);
`

const HeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
`

const HeaderRight = styled.span`
  display: flex;
  align-items: center;
  gap: 35px;
`

const AddProjectBtn = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: rgba(217, 217, 217, 0.3);
  color: #fff;
  width: calc(100% - 20px);
  height: 40px;
  margin-bottom: 50px;
  font-size: 20px;
  cursor: pointer;
`

const PreviewBtn = styled.span`
  border-radius: 6px;
  background: rgba(39, 151, 255, 0.20);
  display: inline-flex;
  padding: 11px 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #2797FF;
  font-family: DungGeunMo;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
`

const PlayBtn = styled.span`
  border-radius: 6px;
  background: #2797FF;
  display: inline-flex;
  padding: 11px 12px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #FFF;
  font-family: DungGeunMo;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
`


const Profile = styled.span`
  border-radius: 100px;
  background-color: #fff;
  width: 50px;
  height: 50px;
  font-size: 30px;
  cursor: pointer;
`

const Contents = styled.div`
  display: flex;
  flex: 1; /* fill Container's height */
  min-height: 0;
`

const ProjectsListContainer = styled.div`
  width: 100%;
  height: 75vh;
  color: #fff;
`

const ProjectDetailContainer = styled.div`
  flex: 1; /* take remaining height under Header */
  background-color: blue;
  width: 100%;
  background: #1B1C23;
  min-height: 0;
  overflow: auto;
`
