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
        // Aseguramos array y extraemos strings si vienen objetos
        const rawPermisos = user.rol?.permisos || [];
        const permisosUsuario = rawPermisos.map(p => (typeof p === 'object' ? p.nombre : p));

        // Lógica Wildcard (Coincidencia exacta O prefijo con punto)
        const hasPermission = permisosUsuario.some(permiso => 
            permiso === requiredPermission || 
            permiso.startsWith(`${requiredPermission}.`)
        );

        if (!hasPermission) {
            // --- DEBUG: AVISO EN CONSOLA ANTES DE REDIRIGIR ---
            console.groupCollapsed(`⛔ ACCESO DENEGADO: ${location.pathname}`);
            console.warn(`❌ Permiso Requerido: "${requiredPermission}" (o derivado como "${requiredPermission}.xyz")`);
            console.groupEnd();
            // --------------------------------------------------

            // Redirigimos INMEDIATAMENTE.
            return <Navigate to="/401" state={{ from: location }} replace />;
        }
    }

    return element ? element : <Outlet />;
};

export default ProtectedRoute;