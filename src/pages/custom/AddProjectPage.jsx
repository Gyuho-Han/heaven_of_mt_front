import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createProject } from "../../firebase/Projects";
import { useAuth } from '../../GoogleAuthManager';


const AddProjectPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { user } = useAuth();

  const createProjectModal = async () => {
    await createProject({
      userId: user.uid,
      title: projectName,
    });

    setProjectName("");
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

        {isModalOpen && (
          <ModalOverlay onClick={() => setIsModalOpen(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
              <ModalTitle>새로운 프로젝트 만들기</ModalTitle>
              <ModalLabel>프로젝트 이름</ModalLabel>
              <ModalInput
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="새로운 프로젝트 명"
              />
              <ModalActions>
                <CreateBtn
                  onClick={async () => {
                    // TODO: Hook up actual project creation logic
                    await createProjectModal();
                    setIsModalOpen(false);
                  }}
                >
                  만들기
                </CreateBtn>
              </ModalActions>
            </ModalBox>
          </ModalOverlay>
        )}
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalBox = styled.div`
  position: relative;
  width: 440px;
  height: 200px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  padding: 35px 28px 30px 28px;
  color: #000;
  border-radius: 5px;
  background: #F8F9FF;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #B4B7C2;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  &:hover { color: #D0D0D0; }
`;

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  margin: 4px 30px 30px 4px;
`;

const ModalLabel = styled.div`
  margin: 8px 0 15px 4px;
  color: #000;
  font-size: 16px;
  opacity: 0.75;
`;

const ModalInput = styled.input`
  width: 100%;
  height: 46px;
  box-sizing: border-box;
  font-family: DungGeunMo;
  padding: 12px 14px;
  background: #fff;
  color: #000;
  outline: none;
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #FF76E1;

    &::placeholder {
    color: #636161;
    font-family: DungGeunMo;
    font-size: 16px;
    }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
`;

const CreateBtn = styled.button`
  border: none;
  color: #000;
  padding: 11px 20px;
  margin-top: 15px;

  cursor: pointer;
  border-radius: 5px;
  background: #FF76E1;
  font-family: DungGeunMo;
  font-size: 16px;
`;
