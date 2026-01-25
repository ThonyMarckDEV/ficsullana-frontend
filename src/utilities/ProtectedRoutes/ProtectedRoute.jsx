import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from 'services/authService';
import LoadingScreen from 'components/Shared/LoadingScreen';

const ProtectedRoute = ({ element, requiredPermission }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await authService.verifySession();
        
        // 1. Obtención segura de datos
        const serverData = response.data || response;
        
        // Obtenemos el array de permisos (Asegurando que sea un array)
        const userPermisos = serverData.rol?.permisos || [];

        // 2. LÓGICA DE VALIDACIÓN ESTRICTA (PARA TODOS)
        if (requiredPermission) {
          // Si la ruta pide permiso, verificamos si está en la lista del usuario.
          // Esto aplica IGUAL para Superadmin, Admin, Asesor, etc.
          const hasPermission = userPermisos.includes(requiredPermission);
          
          if (!hasPermission) {
            console.warn(`Acceso denegado. Falta permiso: ${requiredPermission}`);
          }
          
          setIsAuthorized(hasPermission);
        } else {
          // Si la ruta es pública dentro del panel (ej: Home) y no pide permiso específico
          setIsAuthorized(true);
        }

      } catch (error) {
        console.error("Error de autorización o sesión inválida:", error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [requiredPermission]);

  if (isLoading) return <LoadingScreen />;

  if (!isAuthorized) {
    // Si no tiene el permiso, lo mandamos a la página de "No Autorizado"
    return <Navigate to="/401" state={{ from: location }} replace />;
  }

  return element;
};

export default ProtectedRoute;