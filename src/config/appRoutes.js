import { lazy } from 'react';

const ErrorPage404 = lazy(() => import('components/ErrorPage404'));
const ErrorPage401 = lazy(() => import('components/ErrorPage401'));
const Login = lazy(() => import('pages/auth/Login/Login'));
const Home = lazy(() => import('pages/home/Home'));

const AgregarSede = lazy(() => import('pages/sedes/Store'));
const ListarSedes = lazy(() => import('pages/sedes/Index'));
const EditarSede = lazy(() => import('pages/sedes/Update'));

const AgregarArea = lazy(() => import('pages/areas/Store'));
const ListarAreas = lazy(() => import('pages/areas/Index'));
const EditarArea = lazy(() => import('pages/areas/Udpate'));

const AgregarActividadNoSensible = lazy(() => import('pages/actividadesNoSensibles/Store'));
const ListarActividadesNoSensibles = lazy(() => import('pages/actividadesNoSensibles/Index'));
const EditarActividadNoSensible = lazy(() => import('pages/actividadesNoSensibles/Update'));

const AgregarEntidadFinanciera = lazy(() => import('pages/entidadesFinancieras/Store'));
const ListarEntidadesFinancieras = lazy(() => import('pages/entidadesFinancieras/Index'));
const EditarEntidadFinanciera = lazy(() => import('pages/entidadesFinancieras/Update'));

const AgregarProducto = lazy(() => import('pages/productos/Store'));
const ListarProductos = lazy(() => import('pages/productos/Index'));
const EditarProducto = lazy(() => import('pages/productos/Update'));

const AgregarNivelDiscrecionalidad = lazy(() => import('pages/nivelesDiscrecionalidad/Store'));
const ListarNivelesDiscrecionalidad = lazy(() => import('pages/nivelesDiscrecionalidad/Index'));
const EditarNivelDiscrecionalidad = lazy(() => import('pages/nivelesDiscrecionalidad/Update'));

const ListarEmpleados = lazy(() => import('pages/empleados/Index'));
const AgregarEmpleado = lazy(() => import('pages/empleados/Store'));
const EditarEmpleado = lazy(() => import('pages/empleados/Update'));

const AgregarCliente = lazy(() => import('pages/clientes/Store'));
const EditarCliente = lazy(() => import('pages/clientes/Update'));
const ListarCliente = lazy(() => import('pages/clientes/Index'));

const NuevaAdmision = lazy(() => import('pages/admision/routes/Store'));
const ListarAdmisiones = lazy(() => import('pages/admision/routes/Index'));
const EditarAdmision = lazy(() => import('pages/admision/routes/Update'));

const ListarEvaluacionConsumo = lazy(() => import('pages/evaluacion/consumo/routes/Index'));
const AgregarEvaluacionConsumo = lazy(() => import('pages/evaluacion/consumo/routes/Store'));
const EditarEvaluacionConsumo = lazy(() => import('pages/evaluacion/consumo/routes/Update'));
const ConfiguracionEvaluacionConsumo = lazy(() => import('pages/evaluacion/consumo/routes/Configuracion'));

const NuevoRol = lazy(() => import('pages/roles/Store'));
const ListarRoles = lazy(() => import('pages/roles/Index'));
const EditarRol = lazy(() => import('pages/roles/Update'));

export const publicRoutes = [
  { path: '/', Component: Login, type: 'login' },
];

export const protectedStandaloneRoutes = [
  { path: '/home', Component: Home },
];

export const protectedRouteGroups = [
  {
    path: '/sedes',
    routes: [
      { path: 'agregar', permission: 'sedes.crear', Component: AgregarSede },
      { path: 'listar', permission: 'sedes.listar', Component: ListarSedes },
      { path: 'editar/:id', permission: 'sedes.editar', Component: EditarSede },
    ],
  },
  {
    path: '/areas',
    routes: [
      { path: 'agregar', permission: 'areas.crear', Component: AgregarArea },
      { path: 'listar', permission: 'areas.listar', Component: ListarAreas },
      { path: 'editar/:id', permission: 'areas.editar', Component: EditarArea },
    ],
  },
  {
    path: '/actividades-no-sensibles',
    routes: [
      { path: 'agregar', permission: 'actividades_no_sensibles.crear', Component: AgregarActividadNoSensible },
      { path: 'listar', permission: 'actividades_no_sensibles.listar', Component: ListarActividadesNoSensibles },
      { path: 'editar/:id', permission: 'actividades_no_sensibles.editar', Component: EditarActividadNoSensible },
    ],
  },
  {
    path: '/entidades-financieras',
    routes: [
      { path: 'agregar', permission: 'entidades_financieras.crear', Component: AgregarEntidadFinanciera },
      { path: 'listar', permission: 'entidades_financieras.listar', Component: ListarEntidadesFinancieras },
      { path: 'editar/:id', permission: 'entidades_financieras.editar', Component: EditarEntidadFinanciera },
    ],
  },
  {
    path: '/productos',
    routes: [
      { path: 'agregar', permission: 'productos.crear', Component: AgregarProducto },
      { path: 'listar', permission: 'productos.listar', Component: ListarProductos },
      { path: 'editar/:id', permission: 'productos.editar', Component: EditarProducto },
    ],
  },
  {
    path: '/niveles-discrecionalidad',
    routes: [
      { path: 'agregar', permission: 'niveles_discrecionalidad.crear', Component: AgregarNivelDiscrecionalidad },
      { path: 'listar', permission: 'niveles_discrecionalidad.listar', Component: ListarNivelesDiscrecionalidad },
      { path: 'editar/:id', permission: 'niveles_discrecionalidad.editar', Component: EditarNivelDiscrecionalidad },
    ],
  },
  {
    path: '/personal',
    hasIndexRedirect: true,
    routes: [
      { path: 'listar/:idRol', permission: 'empleados.listar', Component: ListarEmpleados },
      { path: 'agregar/:idRol', permission: 'empleados.crear', Component: AgregarEmpleado },
      { path: 'editar/:id', permission: 'empleados.editar', Component: EditarEmpleado, componentProps: { backPath: '/home' } },
    ],
  },
  {
    path: '/clientes',
    routes: [
      { path: 'agregar', permission: 'clientes.crear', Component: AgregarCliente },
      { path: 'listar', permission: 'clientes.listar', Component: ListarCliente },
      { path: 'editar/:id', permission: 'clientes.editar', Component: EditarCliente },
    ],
  },
  {
    path: '/gestion',
    routes: [
      { path: 'nueva-admision', permission: 'admisiones.crear', Component: NuevaAdmision },
      { path: 'listar-admisiones', permission: 'admisiones.listar', Component: ListarAdmisiones },
      { path: 'editar-admision/:id', permission: 'admisiones.editar', Component: EditarAdmision },
    ],
  },
  {
    path: '/evaluacion/consumo',
    routes: [
      { path: 'listar', permission: 'evaluaciones_consumo.listar', Component: ListarEvaluacionConsumo },
      { path: 'agregar', permission: 'evaluaciones_consumo.crear', Component: AgregarEvaluacionConsumo },
      {
        path: 'editar/:id',
        permission: [
          'evaluaciones_consumo.editar',
          'evaluaciones_consumo.aprobar',
          'evaluaciones_consumo.rechazar',
        ],
        Component: EditarEvaluacionConsumo,
      },
      { path: 'configuracion', permission: 'evaluacion_vecessueldo.configurar', Component: ConfiguracionEvaluacionConsumo },
    ],
  },
  {
    path: '/roles',
    routes: [
      { path: 'agregar', permission: 'roles.crear', Component: NuevoRol },
      { path: 'listar', permission: 'roles.listar', Component: ListarRoles },
      { path: 'editar/:id', permission: 'roles.editar', Component: EditarRol },
    ],
  },
];

export const fallbackRoutes = [
  { path: '/401', Component: ErrorPage401 },
  { path: '/*', Component: ErrorPage404 },
];
