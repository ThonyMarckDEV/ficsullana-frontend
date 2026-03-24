import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';
import LoadingScreen from 'components/Shared/LoadingScreen';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';
import SedeLayout from 'layouts/SedeLayout';
import {
    fallbackRoutes,
    protectedRouteGroups,
    protectedStandaloneRoutes,
    publicRoutes,
} from 'config/appRoutes';

// Utilities
import ProtectedRouteLogin from 'utilities/ProtectedRoutes/ProtectedRouteLogin';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';

/* --- CONTENIDO PRINCIPAL --- */

const FullLayout = ({ children }) => (
    <SedeLayout>
        <SidebarLayout>{children || <Outlet />}</SidebarLayout>
    </SedeLayout>
);

const renderProtectedElement = ({ Component, permission, componentProps = {} }) => (
    <ProtectedRoute
        requiredPermission={permission}
        element={<Component {...componentProps} />}
    />
);

function AppContent() {
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {publicRoutes.map(({ path, Component, type }) => (
                    <Route
                        key={path}
                        path={path}
                        element={
                            type === 'login'
                                ? <ProtectedRouteLogin element={<Component />} />
                                : <Component />
                        }
                    />
                ))}

                {protectedStandaloneRoutes.map(({ path, Component }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<ProtectedRoute element={<FullLayout><Component /></FullLayout>} />}
                    />
                ))}

                {protectedRouteGroups.map(({ path, routes, hasIndexRedirect }) => (
                    <Route key={path} path={path} element={<FullLayout />}>
                        {hasIndexRedirect ? <Route index element={<Navigate to="/401" replace />} /> : null}
                        {routes.map((route) => (
                            <Route
                                key={`${path}-${route.path}`}
                                path={route.path}
                                element={renderProtectedElement(route)}
                            />
                        ))}
                    </Route>
                ))}

                {fallbackRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))}
            </Routes>
        </Suspense>
    );
}

function App() {
    return (
        <Router>
            {/* AGREGADO AUTHPROVIDER AQUI PARA SOLUCIONAR EL ERROR */}
            <AuthProvider>
                <div className="min-h-screen bg-white">
                    <AppContent />
                    <ToastContainer position="top-right" autoClose={3000} />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;