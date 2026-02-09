import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import LoadingScreen from 'components/Shared/LoadingScreen';

const ProtectedRouteLogin = ({ element }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

export default ProtectedRouteLogin;