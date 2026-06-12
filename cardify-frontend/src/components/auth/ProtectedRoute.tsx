import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const token = localStorage.getItem('cardify_token');

  if (!token) {
    window.location.href = '/';
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;