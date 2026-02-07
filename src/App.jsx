import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet , Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

// Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';
import SedeLayout from 'layouts/SedeLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'pages/auth/Login/Login';

// UI HOME
import Home from 'pages/home/Home';

// Modulos Sedes
import AgregarSede from 'pages/sedes/Store';
import ListarSedes from 'pages/sedes/Index';
import EditarSede from 'pages/sedes/Update';

// Modulos Areas
import AgregarArea from 'pages/areas/Store';
import ListarAreas from 'pages/areas/Index';
import EditarArea from 'pages/areas/Udpate';

// Modulos Entidades Financieras
import AgregarEntidadFinanciera from 'pages/entidadesFinancieras/Store';
import ListarEntidadesFinancieras from 'pages/entidadesFinancieras/Index';
import EditarEntidadFinanciera from 'pages/entidadesFinancieras/Update';

// Modulos Productos
import AgregarProducto from 'pages/productos/Store';
import ListarProductos from 'pages/productos/Index';
import EditarProducto from 'pages/productos/Update';

// --- MÓDULO EMPLEADOS ---
import ListarEmpleados from 'pages/empleados/Index';
import AgregarEmpleado from 'pages/empleados/Store';
import EditarEmpleado from 'pages/empleados/Update';

// Modulos Clientes
import AgregarCliente from 'pages/clientes/Store';
import EditarCliente from 'pages/clientes/Update';
import ListarCliente from 'pages/clientes/Index';

// Modulos Admisiones
import NuevaAdmision from 'pages/admision/Store';
import ListarAdmisiones from 'pages/admision/Index';
import EditarAdmision from 'pages/admision/Update';

// Modulos Roles
import NuevoRol from 'pages/roles/Store';
import ListarRoles from 'pages/roles/Index';
import EditarRol from 'pages/roles/Update';

// Utilities
import ProtectedRouteLogin from 'utilities/ProtectedRoutes/ProtectedRouteLogin';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';


/* --- CONTENIDO PRINCIPAL --- */

function AppContent() {
    const FullLayout = ({ children }) => (
        <SedeLayout>
            <SidebarLayout>{children || <Outlet />}</SidebarLayout>
        </SedeLayout>
    );

    return (
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
               <Route index element={<Navigate to="401" replace />} /> 
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
                <Route path="listar" element={<ProtectedRoute requiredPermission="clientes.listar" element={<ListarCliente />} /> } />
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