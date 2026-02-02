// utilities/ProtectedRoutes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation, Outlet, useParams } from 'react-router-dom';
import { useAuth } from 'context/AuthContext'; 
import LoadingScreen from 'components/Shared/LoadingScreen';

const ProtectedRoute = ({ element, requiredPermission }) => {
    const { user, loading } = useAuth();
    const location = useLocation();
    const { idRol } = useParams();

    if (loading) return <LoadingScreen />;
    if (!user) return <Navigate to="/" state={{ from: location }} replace />;

    if (requiredPermission) {
        const rawPermisos = user.rol?.permisos || [];
        const permisosUsuario = rawPermisos.map(p => (typeof p === 'object' ? p.nombre : p));

        let finalPermission = requiredPermission;

        // Validamos si hay un idRol en la URL y si el usuario tiene la lista de roles
        if (idRol && user.todos_los_roles) {
            // Buscamos el nombre del rol usando el ID de la URL
            const rolEnUrl = user.todos_los_roles.find(r => r.id === parseInt(idRol));
            
            if (rolEnUrl) {
                // Ahora construimos el permiso real: "empleados.listar.cajero"
                finalPermission = `${requiredPermission}.${rolEnUrl.nombre}`;
            }
        }

        const hasPermission = permisosUsuario.includes(finalPermission);

        if (!hasPermission) {
            console.groupCollapsed(`⛔ ACCESO DENEGADO: ${location.pathname}`);
            console.warn(`Requería: "${finalPermission}"`);
            console.log(`Permisos actuales:`, permisosUsuario);
            console.groupEnd();
            
            return <Navigate to="/401" state={{ from: location }} replace />;
        }
    }

    return element ? element : <Outlet />;
};

export default ProtectedRoute;