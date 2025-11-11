import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createProject } from "../../firebase/Projects";
import { useAuth } from '../../GoogleAuthManager';
import ProjectCreateModal from '../../components/ProjectCreateModal';


const AddProjectPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const createProjectModal = async (name) => {
    await createProject({
      userId: user.uid,
      title: name,
    });
  };

  // This page shows an empty-state (no projects) UI.

  return (
    <RightCol>
      <Container>
        <Header>
          <HeaderLeft>
            <TitleImage src="/images/title.png" alt="title" onClick={() => navigate('/')} />
          </HeaderLeft>
          <HeaderRight>
            <PreviewBtn>미리보기</PreviewBtn>
            <PlayBtn>게임하기</PlayBtn>
            <Profile />
          </HeaderRight>
        </Header>
        <ProjectDetailContainer>
          <EmptyState>
            <EmptyMessage>프로젝트가 없습니다.</EmptyMessage>
            <CreateProjectButton onClick={() => setIsModalOpen(true)}>+ 프로젝트 만들기</CreateProjectButton>
          </EmptyState>
        </ProjectDetailContainer>

        <ProjectCreateModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={async (name) => {
            await createProjectModal(name);
            setIsModalOpen(false);
          }}
        />
      </Container>
    </RightCol>
  );
};

export default AddProjectPage;

const RightCol = styled.div`
  flex: 5;
  display: flex;
  flex-direction: column;
  min-height: 0;
  font-family: DungGeunMo;
`;

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
  margin-left: 2.78vw;
`;

const Header = styled.div`
  padding: 5.56vh 2.78vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 0px;
  background: #0E193E;
  box-shadow: 0 4px 4.8px 0 rgba(0, 0, 0, 0.17);
`;

const ProjectDetailContainer = styled.div`
  flex: 1;
  width: 100%;
  background: #1B1C23;
  min-height: 0;
  overflow: auto;
  display: flex;
  padding: 45px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyMessage = styled.div`
  color: #F2F4F6;
  font-family: DungGeunMo;
  font-size: 20px;
  margin-bottom: 10px;
`;

const CreateProjectButton = styled.button`
  border: none;
  border-radius: 5px;
  background: #FF62D3;
  padding: 10px 16px;
  cursor: pointer;
  width: 15.97vw;

  color: #000;
  font-family: DungGeunMo;
  font-size: 22px;
`;

const HeaderLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderRight = styled.span`
  display: flex;
  align-items: center;
  gap: 35px;
`;

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
`;

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
`;

const Profile = styled.span`
  border-radius: 100px;
  background-color: #fff;
  width: 50px;
  height: 50px;
  font-size: 30px;
  cursor: pointer;
`;

// Removed game list and picker styles for the empty state UI
