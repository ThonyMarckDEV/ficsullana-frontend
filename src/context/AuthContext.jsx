import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import authService from 'services/authService';
import jwtUtils from 'utilities/Token/jwtUtils'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    const userPermissions = useMemo(() => (
        (user?.rol?.permisos || []).map((permission) => (
            typeof permission === 'object' ? permission.nombre : permission
        ))
    ), [user]);

    // FUNCION CENTRALIZADA DE PERMISOS
    const checkPermission = useCallback((requiredPermission, idRol = null) => {
        if (!user) return false;

        if (idRol) {
            const targetRol = roles.find((role) => String(role.id) === String(idRol));
            if (targetRol) {
                const specificPermission = `${requiredPermission}.${targetRol.nombre}`;
                return userPermissions.includes(specificPermission);
            }
        }

        return userPermissions.some((permission) => (
            permission === requiredPermission || permission.startsWith(`${requiredPermission}.`)
        ));
    }, [roles, user, userPermissions]);

    const refreshSession = useCallback(async () => {
        setLoading(true);
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
            console.warn('Error validando sesión (Token inválido o Servidor caído). Limpiando...', error);

            jwtUtils.removeTokensFromCookie();

            setUser(null);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshSession();
    }, [refreshSession]);

    const contextValue = useMemo(() => ({
        user,
        roles,
        loading,
        refreshSession,
        checkPermission,
    }), [checkPermission, loading, refreshSession, roles, user]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
