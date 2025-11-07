import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AddProjectPage = () => {
  const navigate = useNavigate();
  const projects = [
    { id: 1, name: '프로젝트 A' },
    { id: 2, name: '프로젝트 B' },
    { id: 3, name: '프로젝트 C' },
    { id: 4, name: '프로젝트 D' },
    { id: 5, name: '프로젝트 E' },
    { id: 6, name: '프로젝트 F' },
    { id: 7, name: '프로젝트 G' },
  ];
  const [openMenuId, setOpenMenuId] = useState(null);

  return (
    <RightCol>
        <Container>
        <Header>
            <HeaderLeft>
            <TitleImage src="/images/title.png" alt="title" onClick={() => navigate('/')} />
            </HeaderLeft>
            <HeaderRight>
             <Profile />
            </HeaderRight>
        </Header>
        <ProjectDetailContainer onClick={() => setOpenMenuId(null)}>
          <CardGrid>
            <AddCard onClick={() => navigate('/custom/add')}>
              <AddIcon>
                <Plus>+</Plus>
              </AddIcon>
            </AddCard>
            {projects.map((p) => (
              <ProjectCard key={p.id}>
                <CardContent>
                  <ProjectName title={p.name}>{p.name}</ProjectName>
                  <EllipsisWrapper>
                    <EllipsisButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((prev) => (prev === p.id ? null : p.id));
                      }}
                    >
                      ...
                    </EllipsisButton>
                    {openMenuId === p.id && (
                      <DropdownMenu onClick={(e) => e.stopPropagation()}>
                        <MenuItem onClick={() => alert('이름 변경')}>
                          <MenuIcon src="/images/ChangeNameIcon.svg" alt="change-name" />
                          이름 변경
                        </MenuItem>
                        <MenuItem danger onClick={() => alert('삭제')}>
                          <MenuIcon src="/images/DeleteIcon.svg" alt="delete" />
                          삭제
                        </MenuItem>
                      </DropdownMenu>
                    )}
                  </EllipsisWrapper>
                </CardContent>
                <CardFooter />
              </ProjectCard>
            ))}
          </CardGrid>
        </ProjectDetailContainer>

        
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
  padding: 60px 0;
  position: relative;
  justify-content: center;
  align-items: flex-start;
`;

// Cards grid and card styles (confined to ProjectDetailContainer)
const CardGrid = styled.div`
  display: grid;
  /* Use responsive columns that grow without overlapping cards */
  grid-template-columns: repeat(auto-fill, minmax(224px, 1fr));
  gap: 2.44vh 1.53vw;
  width: 100%;
  box-sizing: border-box;
  padding: 0 2.78vw; /* keep some horizontal breathing room */
`;

const CardBase = styled.div`
  width: 100%;
  height: 13.43vh;
  flex-shrink: 0;
  border-radius: 5px;
  background: #25262D;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: visible;
`;

const AddCard = styled(CardBase)`
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const AddIcon = styled.div`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background: rgba(255, 118, 225, 0.65);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Plus = styled.span`
  color: #FFF;
  font-family: DungGeunMo;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ProjectCard = styled(CardBase)`
  cursor: pointer;
`;

const CardContent = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 18px;
  box-sizing: border-box;
`;

const ProjectName = styled.span`
  color: #FFF;
  font-family: DungGeunMo;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 8px;
  flex: 1 1 auto;
  min-width: 0; /* allow ellipsis in flex */
`;

const EllipsisWrapper = styled.div`
  position: relative;
  bottom: 8px;
  left: 8px;
  flex: 0 0 auto;
`;

const EllipsisButton = styled.button`
  all: unset;
  cursor: pointer;
  color: #FFF;
  font-family: DungGeunMo;
  font-size: 15px;
  letter-spacing: -1.2px;
  padding: 2px 6px;
  border-radius: 4px;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% - 8px);
  right: 0;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 6px;
  border-radius: 8px;
  background: #2A2B33;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
  z-index: 10;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FFF; /* 삭제 텍스트도 하얀색으로 */
  font-family: DungGeunMo;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;

const MenuIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const CardFooter = styled.div`
  height: 5.22vh;
  width: 100%;
  flex-shrink: 0;
  border-radius: 0 0 5px 5px;
  background: rgba(255, 118, 225, 0.65);
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

const Profile = styled.span`
  border-radius: 100px;
  background-color: #fff;
  width: 50px;
  height: 50px;
  font-size: 30px;
  cursor: pointer;
`;
