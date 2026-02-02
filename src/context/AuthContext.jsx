import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from 'services/authService';
import jwtUtils from 'utilities/Token/jwtUtils'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    // FUNCIÓN CENTRALIZADA DE PERMISOS
    const checkPermission = (requiredPermission, idRol = null) => {
        if (!user) return false;
        
        const rawPermisos = user.rol?.permisos || [];
        const permisosUsuario = rawPermisos.map(p => (typeof p === 'object' ? p.nombre : p));

        // Caso 1: Si hay un idRol (Rutas como listar/:idRol)
        if (idRol) {
            const targetRol = roles.find(r => String(r.id) === String(idRol));
            if (targetRol) {
                const specificPermission = `${requiredPermission}.${targetRol.nombre}`;
                return permisosUsuario.includes(specificPermission);
            }
        }

        // Caso 2: Si no hay idRol o para rutas generales (Wildcard)
        return permisosUsuario.some(p => 
            p === requiredPermission || p.startsWith(`${requiredPermission}.`)
        );
    };

    const refreshSession = async () => {
        const token = jwtUtils.getAccessTokenFromCookie();

        if (!token) {
            setUser(null);
            setRoles([]);
            setLoading(false);
            return; 
        }

        try {
            const response = await authService.verifySession();
            const serverData = response.data || response;
            
            setUser(serverData);
            setRoles(serverData.todos_los_roles || []);
            
        } catch (error) {
            console.warn("Error validando sesión (Token inválido o Servidor caído). Limpiando...", error);
            
            jwtUtils.removeTokensFromCookie();
            
            setUser(null);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        refreshSession(); 
    }, []);

    return (
        <AuthContext.Provider value={{ user, roles, loading, refreshSession , checkPermission }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);