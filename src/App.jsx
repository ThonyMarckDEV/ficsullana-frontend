import React, { lazy, Suspense } from 'react';
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

// Utilities
import ProtectedRouteLogin from 'utilities/ProtectedRoutes/ProtectedRouteLogin';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';

// UI lazy-loaded por ruta
const ErrorPage404 = lazy(() => import('components/ErrorPage404'));
const ErrorPage401 = lazy(() => import('components/ErrorPage401'));
const Login = lazy(() => import('pages/auth/Login/Login'));
const Home = lazy(() => import('pages/home/Home'));

// Modulos Sedes
const AgregarSede = lazy(() => import('pages/sedes/Store'));
const ListarSedes = lazy(() => import('pages/sedes/Index'));
const EditarSede = lazy(() => import('pages/sedes/Update'));

// Modulos Areas
const AgregarArea = lazy(() => import('pages/areas/Store'));
const ListarAreas = lazy(() => import('pages/areas/Index'));
const EditarArea = lazy(() => import('pages/areas/Udpate'));

// Modulos Entidades Financieras
const AgregarEntidadFinanciera = lazy(() => import('pages/entidadesFinancieras/Store'));
const ListarEntidadesFinancieras = lazy(() => import('pages/entidadesFinancieras/Index'));
const EditarEntidadFinanciera = lazy(() => import('pages/entidadesFinancieras/Update'));

// Modulos Productos
const AgregarProducto = lazy(() => import('pages/productos/Store'));
const ListarProductos = lazy(() => import('pages/productos/Index'));
const EditarProducto = lazy(() => import('pages/productos/Update'));

// Modulo Empleados
const ListarEmpleados = lazy(() => import('pages/empleados/Index'));
const AgregarEmpleado = lazy(() => import('pages/empleados/Store'));
const EditarEmpleado = lazy(() => import('pages/empleados/Update'));

// Modulos Clientes
const AgregarCliente = lazy(() => import('pages/clientes/Store'));
const EditarCliente = lazy(() => import('pages/clientes/Update'));
const ListarCliente = lazy(() => import('pages/clientes/Index'));

// Modulos Admisiones
const NuevaAdmision = lazy(() => import('pages/admision/Store'));
const ListarAdmisiones = lazy(() => import('pages/admision/Index'));
const EditarAdmision = lazy(() => import('pages/admision/Update'));

// Modulos Roles
const NuevoRol = lazy(() => import('pages/roles/Store'));
const ListarRoles = lazy(() => import('pages/roles/Index'));
const EditarRol = lazy(() => import('pages/roles/Update'));

/* --- CONTENIDO PRINCIPAL --- */

function AppContent() {
    const FullLayout = ({ children }) => (
        <SedeLayout>
            <SidebarLayout>{children || <Outlet />}</SidebarLayout>
        </SedeLayout>
    );

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {/* --- RUTAS PÚBLICAS --- */}
                <Route path="/" element={<ProtectedRouteLogin element={<Login />} />} />

                {/* --- DASHBOARD --- */}
                <Route path="/home" element={<ProtectedRoute element={<FullLayout><Home /></FullLayout>} />} />

                {/* --- MÓDULO: SEDES --- */}
                <Route path="/sedes" element={<FullLayout />}>
                    <Route path="agregar" element={<ProtectedRoute requiredPermission="sedes.crear" element={<AgregarSede />} />} />
                    <Route path="listar" element={<ProtectedRoute requiredPermission="sedes.listar" element={<ListarSedes />} />} />
                    <Route path="editar/:id" element={<ProtectedRoute requiredPermission="sedes.editar" element={<EditarSede />} />} />
                </Route>

                {/* --- MÓDULO: ÁREAS --- */}
                <Route path="/areas" element={<FullLayout />}>
                    <Route path="agregar" element={<ProtectedRoute requiredPermission="areas.crear" element={<AgregarArea />} />} />
                    <Route path="listar" element={<ProtectedRoute requiredPermission="areas.listar" element={<ListarAreas />} />} />
                    <Route path="editar/:id" element={<ProtectedRoute requiredPermission="areas.editar" element={<EditarArea />} />} />
                </Route>

                {/* --- MÓDULO: ENTIDADES FINANCIERAS --- */}
                <Route path="/entidades-financieras" element={<FullLayout />}>
                    <Route path="agregar" element={<ProtectedRoute requiredPermission="entidades_financieras.crear" element={<AgregarEntidadFinanciera />} />} />
                    <Route path="listar" element={<ProtectedRoute requiredPermission="entidades_financieras.listar" element={<ListarEntidadesFinancieras />} />} />
                    <Route path="editar/:id" element={<ProtectedRoute requiredPermission="entidades_financieras.editar" element={<EditarEntidadFinanciera />} />} />
                </Route>

                {/* --- MÓDULO: PRODUCTOS --- */}
                <Route path="/productos" element={<FullLayout />}>
                    <Route path="agregar" element={<ProtectedRoute requiredPermission="productos.crear" element={<AgregarProducto />} />} />
                    <Route path="listar" element={<ProtectedRoute requiredPermission="productos.listar" element={<ListarProductos />} />} />
                    <Route path="editar/:id" element={<ProtectedRoute requiredPermission="productos.editar" element={<EditarProducto />} />} />
                </Route>

                {/* --- MÓDULO: PERSONAL (DINÁMICO) --- */}
                <Route path="/personal" element={<FullLayout />}>
                    <Route index element={<Navigate to="/401" replace />} />
                    <Route
                        path="listar/:idRol"
                        element={<ProtectedRoute requiredPermission="empleados.listar" element={<ListarEmpleados />} />}
                    />
                    <Route
                        path="agregar/:idRol"
                        element={<ProtectedRoute requiredPermission="empleados.crear" element={<AgregarEmpleado />} />}
                    />
                    <Route
                        path="editar/:id"
                        element={<ProtectedRoute requiredPermission="empleados.editar" element={<EditarEmpleado backPath="/home" />} />}
                    />
                </Route>

                {/* --- MÓDULO: CLIENTES --- */}
                <Route path="/clientes" element={<FullLayout />}>
                    <Route path="agregar" element={<ProtectedRoute requiredPermission="clientes.crear" element={<AgregarCliente />} />} />
                    <Route path="listar" element={<ProtectedRoute requiredPermission="clientes.listar" element={<ListarCliente />} />} />
                    <Route path="editar/:id" element={<ProtectedRoute requiredPermission="clientes.editar" element={<EditarCliente />} />} />
                </Route>

                {/* --- MÓDULO: ADMISIONES --- */}
                <Route path="/gestion" element={<FullLayout />}>
                    <Route path="nueva-admision" element={<ProtectedRoute requiredPermission="admisiones.crear" element={<NuevaAdmision />} />} />
                    <Route path="listar-admisiones" element={<ProtectedRoute requiredPermission="admisiones.listar" element={<ListarAdmisiones />} />} />
                    <Route path="editar-admision/:id" element={<ProtectedRoute requiredPermission="admisiones.editar" element={<EditarAdmision />} />} />
                </Route>

                {/* --- MÓDULO: ROLES --- */}
                <Route path="/roles" element={<FullLayout />}>
                    <Route path="agregar" element={<ProtectedRoute requiredPermission="roles.crear" element={<NuevoRol />} />} />
                    <Route path="listar" element={<ProtectedRoute requiredPermission="roles.listar" element={<ListarRoles />} />} />
                    <Route path="editar/:id" element={<ProtectedRoute requiredPermission="roles.editar" element={<EditarRol />} />} />
                </Route>

                <Route path="/401" element={<ErrorPage401 />} />
                <Route path="/*" element={<ErrorPage404 />} />
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
