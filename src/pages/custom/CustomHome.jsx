import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProjectDetailPage from "./ProjectDetailPage";
import ProjectCardsPage from "./ProjectCardsPage";
import AddProjectPage from "./AddProjectPage";
import { useAuth } from "../../GoogleAuthManager";
import { readProjects } from "../../firebase/Projects";
import { createProject } from "../../firebase/Projects";
import ProjectCreateModal from "../../components/ProjectCreateModal";

const CustomHome = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const readUserProjects = async () => {
      const list = await readProjects(user.uid);
      setProjects(list);
    };

    readUserProjects();
  }, [user]);

  const createProjectModal = async (name) => {
    if (!user) return;
    await createProject({
      userId: user.uid,
      title: name,
    });
    const list = await readProjects(user.uid);
    setProjects(list);
  };

  return (
    <Container>
      <Contents>
        <LeftCol>
          <AddProjectBtn onClick={() => setIsModalOpen(true)}>
            + 새로운 프로젝트
          </AddProjectBtn>
          <ProjectsListContainer>
            <ProjectListTitle>프로젝트</ProjectListTitle>
            {projects.map((project) => (
              <ProjectList key={project.id}>{project.title}</ProjectList>
            ))}
          </ProjectsListContainer>
        </LeftCol>
        <ProjectDetailPage />
        {/* <ProjectCardsPage /> */}
        {/* <AddProjectPage /> */}

        <ProjectCreateModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (name) => {
            await createProjectModal(name);
            setIsModalOpen(false);
          }}
        />
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
  font-size: 17px;
  margin-bottom: 30px;
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

const ProjectList = styled.div`
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 5px;
  background: rgba(217, 217, 217, 0.15);
  color: #fff;
  width: 100%;
  min-height: 50px;
  margin-bottom: 10px;
  font-size: 18px;
  box-sizing: border-box;
`;
