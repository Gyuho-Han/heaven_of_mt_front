import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ProjectDetailPage from "./ProjectDetailPage";
import ProjectCardsPage from "./ProjectCardsPage";
import AddProjectPage from "./AddProjectPage";
import { useAuth } from "../../GoogleAuthManager";
import { readProjects } from "../../firebase/Projects";
import { createProject, updateProject, deleteProject } from "../../firebase/Projects";
import { readGamesInProject, readGame } from "../../firebase/Games";
import ProjectCreateModal from "../../components/ProjectCreateModal";

const CustomHome = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [games, setGames] = useState([]);
  const [showCards, setShowCards] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (!user) return;

    const readUserProjects = async () => {
      const list = await readProjects(user.uid);
      const sorted = sortProjects(list);
      setProjects(sorted);
    };

    readUserProjects();
  }, [user]);

  // Auto-select first project on initial load
  useEffect(() => {
    if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  // Show cards view if there is at least one project
  useEffect(() => {
    setShowCards(projects.length > 0);
  }, [projects]);

  const loadGamesFor = async (projectId) => {
    if (!projectId) {
      setGames([]);
      return;
    }
    const list = await readGamesInProject(projectId);
    const sorted = [...list].sort((a, b) => {
      const aTime = a.createdAt?.seconds ?? 0;
      const bTime = b.createdAt?.seconds ?? 0;
      if (aTime !== bTime) return aTime - bTime;
      return (a.title || a.id).localeCompare(b.title || b.id);
    });
    const hydrated = await Promise.all(
      sorted.map(async (g) => {
        const data = await readGame(g.id);
        return data || g;
      })
    );
    setGames(hydrated);
  };

  useEffect(() => {
    loadGamesFor(selectedProjectId);
  }, [selectedProjectId]);

  const createProjectModal = async (name) => {
    if (!user) return;
    await createProject({
      userId: user.uid,
      title: name,
    });
    const list = await readProjects(user.uid);
    const sorted = sortProjects(list);
    setProjects(sorted);
  };

  const renameProject = async (id, newTitle) => {
    await updateProject(id, { title: newTitle });
    if (user) {
      const list = await readProjects(user.uid);
      const sorted = sortProjects(list);
      setProjects(sorted);
    }
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    if (user) {
      const list = await readProjects(user.uid);
      const sorted = sortProjects(list);
      setProjects(sorted);
    }
  };

  const sortProjects = (arr) => {
    return [...(arr || [])].sort((a, b) => {
      const as = a.createdAt?.seconds ?? 0;
      const bs = b.createdAt?.seconds ?? 0;
      if (as !== bs) return as - bs; // older first, newest last
      const an = a.createdAt?.nanoseconds ?? 0;
      const bn = b.createdAt?.nanoseconds ?? 0;
      if (an !== bn) return an - bn;
      // fallback stable-ish by title then id
      const at = (a.title || '').localeCompare(b.title || '');
      if (at !== 0) return at;
      return (a.id || '').localeCompare(b.id || '');
    });
  };

  return (
    <Container>
      <Contents>
        <LeftCol>
          <AddProjectBtn onClick={() => setIsModalOpen(true)}>
            + 새로운 프로젝트
          </AddProjectBtn>
          <ProjectsListContainer onClick={() => setOpenMenuId(null)}>
            <ProjectListTitle onClick={() => setShowCards(true)}>프로젝트</ProjectListTitle>
            {projects.map((project) => (
              <ProjectList
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setShowCards(false);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const top = e.clientY - rect.top;
                  const left = e.clientX - rect.left;
                  setMenuPos({ top, left });
                  setOpenMenuId(project.id);
                }}
                $active={selectedProjectId === project.id}
              >
                {editingId === project.id ? (
                  <ListEditInput
                    autoFocus
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        const name = editingValue.trim();
                        if (name) await renameProject(project.id, name);
                        setEditingId(null);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <ListProjectName title={project.title}>{project.title}</ListProjectName>
                )}
                {openMenuId === project.id && (
                  <DropdownMenu $top={menuPos.top} $left={menuPos.left} onClick={(e) => e.stopPropagation()}>
                    <MenuItem
                      onClick={() => {
                        setEditingId(project.id);
                        setEditingValue(project.title || "");
                        setOpenMenuId(null);
                      }}
                    >
                      <MenuIcon src="/images/ChangeNameIcon.svg" alt="change-name" />
                      이름 변경
                    </MenuItem>
                    <MenuItem danger onClick={() => removeProject(project.id)}>
                      <MenuIcon src="/images/DeleteIcon.svg" alt="delete" />
                      삭제
                    </MenuItem>
                  </DropdownMenu>
                )}
              </ProjectList>
            ))}
          </ProjectsListContainer>
        </LeftCol>
        {showCards ? (
          <ProjectCardsPage
            projects={projects}
            onAddProject={() => setIsModalOpen(true)}
            onRename={renameProject}
            onDelete={removeProject}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setShowCards(false);
            }}
          />
        ) : (
          <ProjectDetailPage
            games={games}
            projectId={selectedProjectId}
            projectTitle={(projects.find(p => p.id === selectedProjectId) || {}).title}
            onGameCreated={async () => {
              await loadGamesFor(selectedProjectId);
            }}
          />
        )}
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

const ProjectList = styled.div`
  padding: 10px 25px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 5px;
  background: ${(p) => (p.$active ? 'rgba(255, 118, 225, 0.25)' : 'rgba(217, 217, 217, 0.15)')};
  color: #fff;
  width: 100%;
  min-height: 50px;
  margin-bottom: 10px;
  font-size: 18px;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
`;

const ListProjectName = styled.span`
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ListEditInput = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  border-radius: 3px;
  border: 1px solid #666;
  background: rgba(255, 255, 255, 0.95);
  color: #000;
  font-family: DungGeunMo;
  font-size: 16px;
  padding: 6px 8px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  padding: 6px;
  border-radius: 8px;
  background: #2a2b33;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  z-index: 10;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  font-family: DungGeunMo;
  font-size: 14px;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const MenuIcon = styled.img`
  width: 18px;
  height: 18px;
`;
