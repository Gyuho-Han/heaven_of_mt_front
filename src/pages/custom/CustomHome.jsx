import React from "react";
import styled from "styled-components";
import ProjectDetailPage from "./ProjectDetailPage";
import ProjectCardsPage from "./ProjectCardsPage";
import AddProjectPage from "./AddProjectPage";

const CustomHome = () => {
  return (
    <Container>
      <Contents>
        <LeftCol>
          <AddProjectBtn>+ 새로운 프로젝트</AddProjectBtn>
          <ProjectsListContainer>
            <ProjectListTitle>프로젝트</ProjectListTitle>

            {/* use map to show all project of the user */}
            {/* <ProjectList>
              프로젝트 1
            </ProjectList>
            <ProjectList>
              프로젝트 2
            </ProjectList> */}
            {/* use map to show all project of the user */}
          </ProjectsListContainer>
        </LeftCol>
        <ProjectDetailPage />
        {/* <ProjectCardsPage/> */}
        {/* <AddProjectPage/> */}
      </Contents>
    </Container>
  );
};

export default CustomHome;

const Container = styled.div`
  background-image: url("/images/home.gif");
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  outline: none;
`;

const Contents = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

const LeftCol = styled.div`
  flex: 1;
  padding: 25px;
`;

const ProjectListTitle = styled.div`
  font-size: 16px;
  margin-bottom: 30px;
`;

const ProjectList = styled.div`
  padding: 12px 18px;
  border-radius: 5.55px;
  color: #fff;
  background: rgba(217, 217, 217, 0.3);
  height: 4.89vh;
  font-size: 20px;
  box-sizing: border-box;
  width: 100%;
  margin-top: 1.67vh;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const AddProjectBtn = styled.div`
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  background: rgba(217, 217, 217, 0.3);
  color: #fff;
  width: 100%;
  height: 5.56vh;
  margin-bottom: 50px;
  font-size: 20px;
  cursor: pointer;
  box-sizing: border-box;
`;
const ProjectsListContainer = styled.div`
  width: 100%;
  height: 75vh;
  color: #fff;
`;
