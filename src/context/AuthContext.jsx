import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from 'services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshSession = async () => {
        try {
            const response = await authService.verifySession();
            const serverData = response.data || response;
            setUser(serverData);
            setRoles(serverData.todos_los_roles || []);
        } catch (error) {
            setUser(null);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { refreshSession(); }, []);

    return (
        <AuthContext.Provider value={{ user, roles, loading, refreshSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);