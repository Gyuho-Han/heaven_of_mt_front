import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CustomHome = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Haeder>
        <AddProjectBtn>
          + 새로운 프로젝트
        </AddProjectBtn>
        <TitleImage
            src="/images/title.png"
            alt="title"
            onClick={() => navigate('/')}
          />
      </Haeder>
      <Contents>
        <ProjectsListContainer>
          ProjectsListContainer
        </ProjectsListContainer>
        <ProjectDetailContainer>
          ProjectsDetail
        </ProjectDetailContainer>
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

const Haeder = styled.div`
  padding: 30px;
  display: flex;
`

const AddProjectBtn = styled.div`
  padding 20px;
  background: gray;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Contents = styled.div`
  display: flex;
  gap: 30px;
  padding: 20px;
`

const ProjectsListContainer = styled.div`
  flex: 1;  
  width: 50%;
  background-color: gray;
  height: 70vh;
`

const ProjectDetailContainer = styled.div`
  flex: 9;
  background-color: blue;
  width: 100%;
`