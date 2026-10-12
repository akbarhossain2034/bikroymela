import React from 'react';
import { AuthView } from './AuthView';
import { useApp } from '../context/AppContext';

interface AuthModalProps {
  isFullPage?: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { setActiveModal } = useApp();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
      <AuthView onBackToHome={onClose ? onClose : () => setActiveModal(null)} />
    </div>
  );
};
