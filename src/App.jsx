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
import Login from 'ui/auth/Login/Login';

// UI HOME
import Home from 'ui/home/Home';

// Modulos Sedes
import AgregarSede from 'ui/sedes/agregarSede/AgregarSede';
import ListarSedes from 'ui/sedes/listarSedes/ListarSedes';
import EditarSede from 'ui/sedes/editarSede/EditarSede';

// Modulos Productos
import AgregarProducto from 'ui/productos/agregarProducto/AgregarProducto';
import ListarProductos from 'ui/productos/listarProductos/ListarProductos';
import EditarProducto from 'ui/productos/editarProductos/EditarProducto';

// --- MÓDULO UNIFICADO DE USUARIOS ---
import ListarUsuarios from 'ui/usuarios/listarUsuarios/ListarUsuarios';
import AgregarUsuario from 'ui/usuarios/agregarUsuarios/AgregarUsuarios';
import EditarUsuario from 'ui/usuarios/editarUsuarios/EditarUsuarios';

// Modulos Clientes
import AgregarCliente from 'ui/clientes/agregarCliente/AgregarCliente';
import EditarCliente from 'ui/clientes/editarCliente/EditarCliente';

// Modulos Admisiones
import NuevaAdmision from 'ui/admision/nuevaAdmision/NuevaAdmision';
import ListarAdmisiones from 'ui/admision/listarAdmisiones/ListarAdmisiones';
import EditarAdmision from 'ui/admision/editarAdmision/EditarAdmision';

// Modulos Roles
import NuevoRol from 'ui/roles/agregarRol/AgregarRol';
import ListarRoles from 'ui/roles/listarRoles/ListarRoles';
import EditarRol from 'ui/roles/editarRoles/EditarRol';

// Utilities
import ProtectedRouteLogin from 'utilities/ProtectedRoutes/ProtectedRouteLogin';
import ProtectedRoute from 'utilities/ProtectedRoutes/ProtectedRoute';
import ListarCliente from 'ui/clientes/listarClientes/ListarClientes';

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
                    element={<ProtectedRoute requiredPermission="usuarios.listar" element={<ListarUsuarios />} />} 
                />
                <Route 
                    path="agregar/:idRol" 
                    element={<ProtectedRoute requiredPermission="usuarios.crear" element={<AgregarUsuario />} />} 
                />
                <Route 
                    path="editar-usuario/:id" 
                    element={<ProtectedRoute requiredPermission="usuarios.editar" element={<EditarUsuario backPath="/home" />} />} 
                />
            </Route>

            {/* --- MÓDULO: CLIENTES --- */}
            <Route path="/clientes" element={<FullLayout />}>
                <Route path="agregar" element={<ProtectedRoute requiredPermission="usuarios.crear.cliente" element={<AgregarCliente />} />} />
                <Route path="listar" element={<ProtectedRoute requiredPermission="usuarios.listar.cliente" element={<ListarCliente />} /> } />
                <Route path="editar/:id" element={<ProtectedRoute requiredPermission="usuarios.editar.cliente" element={<EditarCliente />} />} />
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