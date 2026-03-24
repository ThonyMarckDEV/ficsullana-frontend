// utilities/ProtectedRoutes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from 'context/AuthContext'; 
import LoadingScreen from 'components/Shared/LoadingScreen';

const ProtectedRoute = ({ element, requiredPermission }) => {
    const { loading, user, checkPermission } = useAuth();
    const { idRol } = useParams();
    const location = useLocation();

    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/" state={{ from: location }} replace />;

    if (requiredPermission) {
        const requiredPermissions = Array.isArray(requiredPermission)
            ? requiredPermission
            : [requiredPermission];
        const hasAccess = requiredPermissions.some((permission) => checkPermission(permission, idRol));

        if (!hasAccess) {
            console.warn(`ACCESSO DENEGADO: ${location.pathname}`);
            return <Navigate to="/401" replace />;
        }
    }

    return element;
};

export default ProtectedRoute;