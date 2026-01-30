import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from 'services/authService';
import jwtUtils from 'utilities/Token/jwtUtils'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshSession = async () => {
        const token = jwtUtils.getAccessTokenFromCookie();

        if (!token) {
            setUser(null);
            setRoles([]);
            setLoading(false);
            return; 
        }

        try {
            // Intentamos validar el token con el backend
            const response = await authService.verifySession();
            const serverData = response.data || response;
            
            setUser(serverData);
            setRoles(serverData.todos_los_roles || []);
            
        } catch (error) {
            console.warn("Error validando sesión (Token inválido o Servidor caído). Limpiando...", error);
            
            // Si falla la verificación (sea por 401 o porque el server no responde correctamente a /me),
            // DEBEMOS borrar la cookie local para evitar bucles infinitos.
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
        <AuthContext.Provider value={{ user, roles, loading, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);