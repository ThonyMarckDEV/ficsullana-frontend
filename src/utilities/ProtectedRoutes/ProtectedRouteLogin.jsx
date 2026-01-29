import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtUtils from 'utilities/Token/jwtUtils';

const ProtectedRouteLogin = ({ element }) => {
  // Solo verificamos si el token existe
  const access_token = jwtUtils.getAccessTokenFromCookie();
  
  if (access_token) {
    // Si hay token, lo mandamos al home de una
    return <Navigate to="/home" replace />;
  }

  // Si no hay nada, que vea el login tranquilo
  return element;
};

export default ProtectedRouteLogin;