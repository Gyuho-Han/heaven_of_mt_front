import React from 'react';
import styled from 'styled-components';

// Generic confirmation modal
// Props:
// - open: boolean
// - message: string | ReactNode
// - onCancel: () => void
// - onConfirm: () => void
// - cancelText?: string (default: '취소')
// - confirmText?: string (default: '삭제')
const ConfirmModal = ({ open, message, onCancel, onConfirm, cancelText = '취소', confirmText = '삭제' }) => {
  if (!open) return null;

  return (
    <ModalOverlay onClick={onCancel}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton type="button" onClick={onCancel}>×</CloseButton>
        <ModalMessage>
          {message}
        </ModalMessage>
        <ModalActions>
          <CancelBtn type="button" onClick={onCancel}>{cancelText}</CancelBtn>
          <DeleteBtn type="button" onClick={onConfirm}>{confirmText}</DeleteBtn>
        </ModalActions>
      </ModalBox>
    </ModalOverlay>
  );
};

export default ConfirmModal;

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
  width: 418.722px;
  height: 239px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  padding: 28px;
  color: #000;
  border-radius: 6px;
  border: 1px solid #555;
  background: #F2F4F6;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-sizing: border-box;
`;

const ModalMessage = styled.div`
  color: #000;
  font-size: 18px;
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: auto;
`;

const BaseBtn = styled.button`
  border: none;
  width: 177.431px;
  height: 45px;
  cursor: pointer;
  border-radius: 6px;
  font-family: DungGeunMo;
  font-size: 16px;
`;

const CancelBtn = styled(BaseBtn)`
  background: rgba(163, 163, 163, 0.50);
  color: #000;
`;

const DeleteBtn = styled(BaseBtn)`
  background: #FF62D3;
  color: #000;
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
  color: #1E1E1E;
  font-family: DungGeunMo;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
`;
