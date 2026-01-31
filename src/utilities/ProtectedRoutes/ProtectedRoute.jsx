// utilities/ProtectedRoutes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from 'context/AuthContext'; 
import LoadingScreen from 'components/Shared/LoadingScreen';

const ProtectedRoute = ({ element, requiredPermission }) => {
    // Consumimos el estado global.
    const { user, loading } = useAuth();
    const location = useLocation();

    // Loading inicial (Contexto cargando)
    if (loading) return <LoadingScreen />;

    // No logueado
    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // VALIDACIÓN DE PERMISOS (Instantánea)
    if (requiredPermission) {
        const rawPermisos = user.rol?.permisos || [];
        const permisosUsuario = rawPermisos.map(p => (typeof p === 'object' ? p.nombre : p));

        // .includes() solo devuelve true si el string es IDÉNTICO
        const hasPermission = permisosUsuario.includes(requiredPermission);

        if (!hasPermission) {
            console.warn(`🛑 Bloqueado: Falta el permiso exacto "${requiredPermission}"`);
            return <Navigate to="/401" state={{ from: location }} replace />;
        }
    }

    return element ? element : <Outlet />;
};

export default ProtectedRoute;