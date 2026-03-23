import {
  ClipboardDocumentListIcon,
  IdentificationIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Building2, House, ListChecksIcon, UserCog } from 'lucide-react';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

export const hasSidebarPermission = (userPermissions, requiredPermission) => (
  userPermissions.some((permission) => (
    permission === requiredPermission || permission.startsWith(`${requiredPermission}.`)
  ))
);

const getRoleDisplayName = (roleName = '') => {
  const normalized = String(roleName).replace(/_/g, ' ').toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const buildDynamicRoleSections = (roles = []) => (
  roles.map((role) => {
    const roleSlug = String(role.nombre || '').toLowerCase();

    return {
      section: getRoleDisplayName(role.nombre),
      icon: UserCog,
      subs: [
        {
          name: 'Agregar Nuevo',
          link: `/personal/agregar/${role.id}`,
          permission: `empleados.crear.${roleSlug}`,
        },
        {
          name: 'Listar Todos',
          link: `/personal/listar/${role.id}`,
          permission: `empleados.listar.${roleSlug}`,
        },
      ],
    };
  })
);

export const buildSidebarMenuConfig = (roles = []) => ([
  { section: 'Home', icon: House, link: '/home' },
  {
    section: 'Sedes',
    icon: Building2,
    subs: [
      { name: 'Agregar Sede', link: '/sedes/agregar', permission: 'sedes.crear' },
      { name: 'Listar Sedes', link: '/sedes/listar', permission: 'sedes.listar' },
    ],
  },
  {
    section: 'Areas',
    icon: Squares2X2Icon,
    subs: [
      { name: 'Agregar Area', link: '/areas/agregar', permission: 'areas.crear' },
      { name: 'Listar Areas', link: '/areas/listar', permission: 'areas.listar' },
    ],
  },
  {
    section: 'Act. No Sensibles',
    icon: RectangleStackIcon,
    subs: [
      { name: 'Agregar Actividad', link: '/actividades-no-sensibles/agregar', permission: 'actividades_no_sensibles.crear' },
      { name: 'Listar Actividades', link: '/actividades-no-sensibles/listar', permission: 'actividades_no_sensibles.listar' },
    ],
  },
  {
    section: 'Entidades Financieras',
    icon: BuildingLibraryIcon,
    subs: [
      { name: 'Agregar Entidad', link: '/entidades-financieras/agregar', permission: 'entidades_financieras.crear' },
      { name: 'Listar Entidades', link: '/entidades-financieras/listar', permission: 'entidades_financieras.listar' },
    ],
  },
  {
    section: 'Productos',
    icon: ListChecksIcon,
    subs: [
      { name: 'Agregar Producto', link: '/productos/agregar', permission: 'productos.crear' },
      { name: 'Listar Productos', link: '/productos/listar', permission: 'productos.listar' },
    ],
  },
  {
    section: 'Niveles Discrecionalidad',
    icon: ShieldCheckIcon,
    subs: [
      { name: 'Agregar Nivel', link: '/niveles-discrecionalidad/agregar', permission: 'niveles_discrecionalidad.crear' },
      { name: 'Listar Niveles', link: '/niveles-discrecionalidad/listar', permission: 'niveles_discrecionalidad.listar' },
    ],
  },
  ...buildDynamicRoleSections(roles),
  {
    section: 'Clientes',
    icon: IdentificationIcon,
    subs: [
      { name: 'Agregar Cliente', link: '/clientes/agregar', permission: 'clientes.crear' },
      { name: 'Listar Clientes', link: '/clientes/listar', permission: 'clientes.listar' },
    ],
  },
  {
    section: 'Admisiones',
    icon: ClipboardDocumentListIcon,
    subs: [
      { name: 'Nueva Admision', link: '/gestion/nueva-admision', permission: 'admisiones.crear' },
      { name: 'Listar Admisiones', link: '/gestion/listar-admisiones', permission: 'admisiones.listar' },
    ],
  },
  {
    section: 'Evaluacion Consumo',
    icon: ClipboardDocumentListIcon,
    subs: [
      { name: 'Nueva Evaluacion', link: '/evaluacion/consumo/agregar', permission: 'evaluaciones_consumo.crear' },
      { name: 'Listar Evaluaciones', link: '/evaluacion/consumo/listar', permission: 'evaluaciones_consumo.listar' },
      { name: 'Configuracion', link: '/evaluacion/consumo/configuracion', permission: 'evaluacion_vecessueldo.configurar' },
    ],
  },
  {
    section: 'Configuracion Roles',
    icon: UserGroupIcon,
    subs: [
      { name: 'Nuevo Rol', link: '/roles/agregar', permission: 'roles.crear' },
      { name: 'Listar Roles', link: '/roles/listar', permission: 'roles.listar' },
    ],
  },
]);

export const filterSidebarMenuByPermissions = (config, userPermissions) => (
  config
    .map((item) => {
      if (!item.subs) {
        if (!item.permission) {
          return item;
        }

        return hasSidebarPermission(userPermissions, item.permission) ? item : null;
      }

      const visibleSubs = item.subs.filter((sub) => hasSidebarPermission(userPermissions, sub.permission));
      return visibleSubs.length > 0 ? { ...item, subs: visibleSubs } : null;
    })
    .filter(Boolean)
);
