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
//Modulos Productos
import AgregarProducto from 'ui/SuperAdministrador/productos/agregarProducto/AgregarProducto';
import ListarProductos from 'ui/SuperAdministrador/productos/listarProductos/ListarProductos';
import EditarProducto from 'ui/SuperAdministrador/productos/editarProductos/EditarProducto';



// UIS ADMIN
//Modulos Jefe Negocio
import AgregarJefeNegocio from 'ui/Administrador/jefe_negocios/agregarJefeNegocio/AgregarJefeNegocio';
import ListarJefesNegocio from 'ui/Administrador/jefe_negocios/listarJefesNegocio/ListarJefesNegocio';
import EditarJefeNegocio  from 'ui/Administrador/jefe_negocios/editarJefeNegocio/EditarJefeNegocio';




//UIS JEFE NEGOCIO
//Modulos Asesores
import AgregarAsesor from 'ui/JefeNegocio/asesores/agregarAsesor/AgregarAsesor';
import ListarAsesores from 'ui/JefeNegocio/asesores/listarAsesores/ListarAsesores';
import EditarAsesor from 'ui/JefeNegocio/asesores/editarAsesor/EditarAsesor';




//UIS ASESOR
//Modulos Clientes
import AgregarCliente from 'ui/Asesor/clientes/agregarCliente/AgregarCliente';
import ListarClientes from 'ui/Asesor/clientes/listarClientes/ListarClientes';
import EditarCliente from 'ui/Asesor/clientes/editarCliente/EditarCliente';
//Modulos Admisiones
import NuevaAdmision from 'ui/Asesor/admision/nuevaAdmision/NuevaAdmision';
import ListarAdmisiones from 'ui/Asesor/admision/listarAdmisiones/ListarAdmisiones';
import EditarAdmision from 'ui/Asesor/admision/editarAdmision/EditarAdmision';




// UIS USUARIO


// Utilities
import ProtectedRouteHome from 'utilities/ProtectedRoutes/ProtectedRouteHome';
import ProtectedRouteCliente from 'utilities/ProtectedRoutes/ProtectedRouteCliente';
import ProtectedRouteAdmin from 'utilities/ProtectedRoutes/ProtectedRouteAdmin';
import ProtectedRouteSuperAdmin from 'utilities/ProtectedRoutes/ProtectedRouteSuperAdmin';
import ProtectedRouteAsesor from 'utilities/ProtectedRoutes/ProtectedRouteAsesor';
import ProtectedRouteJefeNegocio from 'utilities/ProtectedRoutes/ProtectedRouteJefeNegocio';



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

        {/* RUTAS PRODUCTOS */}
          {/* Ruta Agregar Producto */}
          <Route path="agregar-producto" element={<AgregarProducto />} />
          {/* Ruta Listar Productos */}
          <Route path="listar-productos" element={<ListarProductos />} />
          {/* Ruta Editar Producto */}
          <Route path="editar-producto/:id" element={<EditarProducto />} />

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

        {/* RUTAS JEFE NEGOCIO */}
          {/* Ruta Agregar Jefe Negocio */}
          <Route path="agregar-jefe-negocio" element={<AgregarJefeNegocio />} />
          {/* Ruta Listar Jefe Negocio */}
          <Route path="listar-jefe-negocio" element={<ListarJefesNegocio />} />
          {/* Ruta Editar Jefe Negocio */}
          <Route path="editar-jefe-negocio/:id" element={<EditarJefeNegocio />} />

      </Route>


    {/* RUTAS JEFE NEGOCIO */}
      <Route
        path="/jefe-negocio"
        element={
          <ProtectedRouteJefeNegocio element={
            <SedeLayout>
              <SidebarLayout />
            </SedeLayout>
          } />
        }
      >
        {/* Ruta Home (cuando solo pones /jefe-negocio) */}
        <Route index element={<Home />} />

        {/* RUTAS ASESOR */}
          {/* Ruta Agregar Asesor */}
          <Route path="agregar-asesor" element={<AgregarAsesor />} />
          {/* Ruta Listar Asesor */}
          <Route path="listar-asesores" element={<ListarAsesores />} />
          {/* Ruta Editar Asesor */}
          <Route path="editar-asesor/:id" element={<EditarAsesor />} />

      </Route>


      {/* RUTAS ASESOR */}
      <Route
        path="/asesor"
        element={
          <ProtectedRouteAsesor element={
            <SedeLayout>
              <SidebarLayout />
            </SedeLayout>
          } />
        }
      >
        {/* Ruta Home (cuando solo pones /asesor) */}
        <Route index element={<Home />} />

        {/* RUTAS CLIENTE */}
          {/* Ruta Agregar Cliente */}
          <Route path="agregar-cliente" element={<AgregarCliente />} />
          {/* Ruta Listar Cliente */}
          <Route path="listar-clientes" element={<ListarClientes />} />
          {/* Ruta Editar Cliente */}
          <Route path="editar-cliente/:id" element={<EditarCliente />} />

        {/* RUTAS ADMISIONES */}
          {/* Ruta Nueva Admision */}
          <Route path="nueva-admision" element={<NuevaAdmision />} />
          {/* Ruta Listar Admisiones */}
          <Route path="listar-admisiones" element={<ListarAdmisiones />} />
          {/* Ruta Editar Admision */}
          <Route path="editar-admision/:id" element={<EditarAdmision />} />



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