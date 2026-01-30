import React, { useState, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Bars3Icon, 
    ChevronDownIcon, 
    ArrowRightOnRectangleIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline'; 
import { logout } from 'js/logout';
import logoImg from 'assets/img/Logo_FICSULLANA.png'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { Building2, House, ListChecksIcon, UserCog } from 'lucide-react';
import SidebarSkeleton from './Skeletons/SidebarSkeleton';

// IMPORTAR EL CONTEXTO
import { useAuth } from 'context/AuthContext';

const Sidebar = () => {
    const { user, roles, loading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    const location = useLocation();

    // Extraemos permisos y roles del contexto
    const userPermisos = user?.rol?.permisos || [];

    const allowedMenu = useMemo(() => {
        if (loading) return [];

        const config = [
            { section: 'Home', icon: House, link: '/home' },
            {
                section: 'Sedes',
                icon: Building2,
                subs: [
                    { name: 'Agregar Sede', link: '/sedes/agregar', permission: 'sedes.crear' },
                    { name: 'Listar Sedes', link: '/sedes/listar', permission: 'sedes.listar' },
                ]
            },
            {
                section: 'Productos',
                icon: ListChecksIcon,
                subs: [
                    { name: 'Agregar Producto', link: '/productos/agregar', permission: 'productos.crear' },
                    { name: 'Listar Productos', link: '/productos/listar', permission: 'productos.listar' },
                ]
            },
            {
                section: 'Personal',
                icon: UserCog,
                // Usamos los roles del contexto (ya cargados)
                subs: (roles || []).map(rol => ({
                    name: rol.nombre.replace(/_/g, ' ').toUpperCase(),
                    link: `/personal/listar/${rol.id}`,
                    permission: 'usuarios.listar'
                }))
            },
            {
                section: 'Clientes',
                icon: IdentificationIcon,
                subs: [
                    { name: 'Agregar Cliente', link: '/clientes/agregar', permission: 'usuarios.crear' },
                    { name: 'Listar Clientes', link: '/clientes/listar', permission: 'usuarios.listar' },
                ]
            },
            {
                section: 'Admisiones',
                icon: ClipboardDocumentListIcon,
                subs: [
                    { name: 'Nueva Admisión', link: '/gestion/nueva-admision', permission: 'admisiones.crear' },
                    { name: 'Listar Admisiones', link: '/gestion/listar-admisiones', permission: 'admisiones.listar' },
                ]
            },
            {
                section: 'Roles',
                icon: UserGroupIcon,
                subs: [
                    { name: 'Nuevo Rol', link: '/roles/agregar', permission: 'roles.crear' },
                    { name: 'Listar Roles', link: '/roles/listar', permission: 'roles.listar' },
                ]
            },
        ];

        return config.map(item => {
            if (item.subs) {
                const visibleSubs = item.subs.filter(sub => 
                    userPermisos.includes(sub.permission)
                );
                if (visibleSubs.length > 0) return { ...item, subs: visibleSubs };
                return null;
            }
            if (!item.permission || userPermisos.includes(item.permission)) return item;
            return null;
        }).filter(Boolean);

    }, [userPermisos, loading, roles]);

    const isExpanded = isOpen || isHovered;

    if (loading) return <SidebarSkeleton />;

    return (
        <>
            <button className="md:hidden fixed top-4 left-4 z-50 p-2 bg-fic-red text-white rounded-lg shadow-lg" onClick={() => setIsOpen(!isOpen)}>
                <Bars3Icon className="h-6 w-6" />
            </button>

            {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`fixed left-0 top-0 h-screen bg-fic-red shadow-2xl z-40 transition-all duration-300 flex flex-col border-r border-white/10 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} md:translate-x-0 ${isHovered ? 'md:w-64' : 'md:w-20'}`}
            >
                <div className={`bg-white transition-all duration-300 flex items-center justify-center flex-shrink-0 relative z-10 overflow-hidden ${isExpanded ? 'h-32' : 'h-24'}`}>
                    <img src={logoImg} alt="Logo" className={`transition-all duration-300 object-contain p-2 ${isExpanded ? 'w-48' : 'w-16'}`} />
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 [&::-webkit-scrollbar]:hidden">
                    {allowedMenu.map((item, index) => {
                        const IconComponent = item.icon || DocumentTextIcon;
                        const isSubOpen = openSection === item.section;
                        const isActive = item.link ? location.pathname === item.link : item.subs?.some(s => location.pathname === s.link);

                        return (
                            <div key={index}>
                                {item.subs ? (
                                    <>
                                        <button
                                            onClick={() => setOpenSection(isSubOpen ? null : item.section)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <IconComponent className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                                                <span className={`whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.section}</span>
                                            </div>
                                            {isExpanded && <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSubOpen ? 'rotate-180' : ''}`}/>}
                                        </button>
                                        <div className={`overflow-hidden transition-all duration-300 ${isSubOpen && isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                            <ul className="ml-4 pl-4 border-l-2 border-white/30 space-y-1">
                                                {item.subs.map((sub, idx) => (
                                                    <li key={idx}>
                                                        <Link
                                                            to={sub.link}
                                                            onClick={() => setIsOpen(false)}
                                                            className={`block py-2 px-3 rounded-lg text-sm transition-all ${location.pathname === sub.link ? 'text-fic-yellow font-bold bg-white/10' : 'text-gray-100 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            {sub.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <IconComponent className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                                        <span className={`whitespace-nowrap transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>{item.section}</span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-3 border-t border-white/20 bg-fic-red">
                    <button onClick={() => setShowConfirm(true)} className={`w-full flex items-center gap-4 p-3 rounded-xl text-white hover:bg-red-800 transition-colors ${!isExpanded ? 'justify-center' : ''}`}>
                        <ArrowRightOnRectangleIcon className="h-6 w-6 min-w-[24px]" />
                        {isExpanded && <span className="font-bold">Cerrar Sesión</span>}
                    </button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal message="¿Cerrar sesión?" onConfirm={() => { logout(); setShowConfirm(false); }} onCancel={() => setShowConfirm(false)} />
            )}
        </>
    );
};

export default Sidebar;