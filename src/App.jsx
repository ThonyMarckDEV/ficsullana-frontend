//import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

//Contextos


//Componentes Globales
import { ToastContainer } from 'react-toastify';

// Layout
import SidebarLayout from 'layouts/SidebarLayout';
import SedeLayout from 'layouts/SedeLayout';

// UIS AUTH
import ErrorPage404 from 'components/ErrorPage404';
import ErrorPage401 from 'components/ErrorPage401';
import Login from 'ui/auth/Login/Login';

//UI HOME
import Home from 'ui/home/Home';

//UIS SUPERADMIN

//Modulos Sedes
import AgregarSede from 'ui/SuperAdministrador/sedes/agregarSede/AgregarSede';
import ListarSedes from 'ui/SuperAdministrador/sedes/listarSedes/ListarSedes';
import EditarSede from 'ui/SuperAdministrador/sedes/editarSede/EditarSede';


// UIS ADMIN

//Modulos Clientes
import AgregarCliente from 'ui/Administrador/clientes/agregarCliente/AgregarCliente';
import ListarClientes from 'ui/Administrador/clientes/listarClientes/ListarClientes';
import EditarCliente from 'ui/Administrador/clientes/editarCliente/EditarCliente';

// UIS USUARIO


// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRouteCliente from 'utilities/ProtectedRoutes/ProtectedRouteCliente';
import ProtectedRouteAdmin from 'utilities/ProtectedRoutes/ProtectedRouteAdmin';
import ProtectedRouteSuperAdmin from 'utilities/ProtectedRoutes/ProtectedRouteSuperAdmin';


function AppContent() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/"
        element={<ProtectedRouteHome element={<Login />} />}
      />


      {/* RUTAS SUPERADMIN */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRouteSuperAdmin element={
           <SedeLayout>
              <SidebarLayout />
           </SedeLayout>
          } />
        }
      >
        {/* Ruta Home (cuando solo pones /superadmin) */}
        <Route index element={<Home />} />

        {/* RUTAS SEDES */}
          {/* Ruta Agregar Sede */}
          <Route path="agregar-sede" element={<AgregarSede />} />
          {/* Ruta Listar Sede */}
          <Route path="listar-sedes" element={<ListarSedes />} />
          {/* Ruta Editar Sede */}
          <Route path="editar-sede/:id" element={<EditarSede />} />
      </Route>

      {/* RUTAS ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteAdmin element={
            <SedeLayout>
              <SidebarLayout />
            </SedeLayout>
          } />
        }
      >
        {/* Ruta Home (cuando solo pones /admin) */}
        <Route index element={<Home />} />

        {/* RUTAS CLIENTE */}
          {/* Ruta Agregar Cliente */}
          <Route path="agregar-cliente" element={<AgregarCliente />} />
          {/* Ruta Listar Cliente */}
          <Route path="listar-clientes" element={<ListarClientes />} />
          {/* Ruta Editar Cliente */}
          <Route path="editar-cliente/:id" element={<EditarCliente />} />

      </Route>



      {/* RUTAS CLIENTE */}
      <Route
        path="/cliente"
        element={
          <ProtectedRouteCliente element={<SidebarLayout />} />
        }
      >
        {/* Ruta Home (cuando solo pones /cliente) */}
        <Route index element={<Home />} />

        {/* Aquí agregas más módulos */}

      </Route>





      {/* Ruta de error */}
      <Route path="/*" element={<ErrorPage404 />} />
      <Route path="/401" element={<ErrorPage401 />} />
    </Routes>
  );
}


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  );
}

export default App;