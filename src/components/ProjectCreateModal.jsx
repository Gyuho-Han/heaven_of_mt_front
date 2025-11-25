import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Reusable modal for creating a new project
// Props:
// - open: boolean (controls visibility)
// - onClose: function () => void
// - onCreate: async function (name: string) => void
const ProjectCreateModal = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName('');
      setError(false);
    }
  }, [open]);

  if (!open) return null;

  const handleCreate = async () => {
    if (submitting) return; // guard against double submit
    const trimmed = name.trim();
    if (!trimmed) {
      setError(true);
      return;
    }
    try {
      setSubmitting(true);
      await onCreate?.(trimmed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>새로운 프로젝트 만들기</ModalTitle>
        <ModalLabel>프로젝트 이름</ModalLabel>
        <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
          <ModalInput
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error && e.target.value.trim()) setError(false);
            }}
            placeholder="새로운 프로젝트 명"
            $error={error}
          />
          <ModalActions>
            <CreateBtn type="submit" disabled={submitting}>
              만들기
            </CreateBtn>
          </ModalActions>
        </form>
      </ModalBox>
    </ModalOverlay>
  );
};

export default ProjectCreateModal;

// Styles replicated from AddProjectPage to match exactly
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
  border: 1px solid ${props => (props.$error ? '#FF3B30' : '#FF76E1')};

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
