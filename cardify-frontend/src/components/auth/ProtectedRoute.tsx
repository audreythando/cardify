import React from 'react';
import LoginPage from '../../pages/LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onLogin: () => void;
  onGoToRegister: () => void;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onLogin,
  onGoToRegister,
}) => {
  const token = localStorage.getItem('cardify_token');

  if (!token) {
    return (
      <LoginPage
        onLogin={onLogin}
        onGoToRegister={onGoToRegister}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;