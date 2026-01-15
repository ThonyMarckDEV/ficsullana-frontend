import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Bars3Icon, 
    ChevronDownIcon, 
    ArrowRightOnRectangleIcon,
    UsersIcon,
    BanknotesIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'; 
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';
import logoImg from 'assets/img/Logo_FICSULLANA.png'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { Building2, House, ListChecksIcon } from 'lucide-react';

// --- CONFIGURACIÓN DE MENÚS ---
const menus = {
    superadmin: [
        { section: 'Home', icon: House, link: '/superadmin' },
        {
            section: 'Sedes',
            icon: Building2,
            subs: [
                { name: 'Agregar Sede', link: '/superadmin/agregar-sede' },
                { name: 'Listar Sedes', link: '/superadmin/listar-sedes' },
            ]
        },
        {
            section: 'Productos',
            icon: ListChecksIcon,
            subs: [
                { name: 'Agregar Producto', link: '/superadmin/agregar-producto' },
                { name: 'Listar Productos', link: '/superadmin/listar-productos' },
            ]
        },
    ],
    admin: [
        { section: 'Home', icon: House, link: '/admin' },
        {
            section: 'Jefes de Negocio',
            icon: UsersIcon,
            subs: [
                { name: 'Agregar Jefe Negocio', link: '/admin/agregar-jefe-negocio' },
                { name: 'Listar Jefes Negocio', link: '/admin/listar-jefes-negocio' },
            ]
        },
    ],
    cliente: [
        { 
            section: 'Prestamos', 
            icon: BanknotesIcon, 
            subs: [{ name: 'Pagar Prestamo', link: '/cliente/pagar-prestamo' }] 
        },
    ],
    asesor: [
        {
            section: 'Clientes',
            icon: UserGroupIcon,
            subs: [
                { name: 'Agregar Cliente', link: '/asesor/agregar-cliente' },
                { name: 'Listar Clientes', link: '/asesor/listar-clientes' },
            ]
        },
        {
            section: 'Admisiones',
            icon: ClipboardDocumentListIcon,
            subs: [
                { name: 'Nueva Admision', link: '/asesor/nueva-admision' },
                { name: 'Listar Admisiones', link: '/asesor/listar-admisiones' },
            ]
        },
    ],
    jefe_negocio: [
        {
            section: 'Asesores',
            icon: UsersIcon,
            subs: [
                { name: 'Agregar Asesor', link: '/jefe_negocio/agregar-asesor' },
                { name: 'Listar Asesores', link: '/jefe_negocio/listar-asesores' },
            ]
        },
    ],
};

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    
    const location = useLocation();
    const refresh_token = jwtUtils.getRefreshTokenFromCookie();
    const rol = refresh_token ? jwtUtils.getUserRole(refresh_token) : null;

    const roleMenu = useMemo(() => rol && menus[rol] ? menus[rol] : [], [rol]);

    // --- LOGICA DE VISUALIZACIÓN UNIFICADA ---
    // Si está abierto en Móvil (isOpen) O si pasas el mouse en PC (isHovered) -> EXPANDIDO
    const isExpanded = isOpen || isHovered;

    const isSectionActive = useCallback((item) => {
        if (item.subs) return item.subs.some(sub => location.pathname === sub.link);
        if (item.link) return location.pathname === item.link;
        return false;
    }, [location.pathname]);

    useEffect(() => {
        if (!isExpanded) return;
        const activeGroup = roleMenu.find(item => 
            item.subs && item.subs.some(sub => location.pathname === sub.link)
        );
        if (activeGroup) setOpenSection(activeGroup.section);
    }, [location.pathname, roleMenu, isExpanded]);

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const toggleSection = (section) => {
        if (!isHovered && window.innerWidth >= 768) setIsHovered(true);
        setOpenSection(prev => prev === section ? null : section);
    };

    // Clases del contenedor principal
    const sidebarClasses = `fixed left-0 top-0 h-screen bg-fic-red shadow-2xl z-40 transition-all duration-300 flex flex-col border-r border-white/10
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
        md:translate-x-0 ${isHovered ? 'md:w-64' : 'md:w-20'}
    `;

    return (
        <>
            {/* Botón Móvil */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-fic-red text-white rounded-lg shadow-lg active:scale-95 transition-transform"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Overlay Móvil */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={sidebarClasses}
            >
                {/* 1. LOGO */}
                <div className={`bg-white transition-all duration-300 flex items-center justify-center flex-shrink-0 relative z-10 overflow-hidden
                    ${isExpanded ? 'h-32' : 'h-24'}`}>
                    
                    <img
                        src={logoImg}
                        alt="Logo"
                        // Aquí ajustamos el tamaño: w-16 en modo retraído (más grande que antes)
                        className={`transition-all duration-300 object-contain p-2
                            ${isExpanded ? 'w-48' : 'w-16'} 
                        `} 
                    />
                </div>

                {/* 2. MENÚ (Sin Scrollbar visible pero funcional) */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {roleMenu.map((item, index) => {
                        const isActive = isSectionActive(item);
                        const isSubOpen = item.subs && openSection === item.section;
                        const IconComponent = item.icon || DocumentTextIcon;

                        return (
                            <div key={index}>
                                {item.subs ? (
                                    <>
                                        {/* PADRE CON SUBMENÚ */}
                                        <button
                                            onClick={() => toggleSection(item.section)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                                                ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <IconComponent className={`h-6 w-6 min-w-[24px] flex-shrink-0 ${isActive ? 'text-fic-red' : 'text-white'}`} />
                                                
                                                {/* TEXTO: Si expandido -> visible. Si no -> width 0 y oculto */}
                                                <span className={`whitespace-nowrap transition-all duration-200 
                                                    ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                                                `}>
                                                    {item.section}
                                                </span>
                                            </div>
                                            {isExpanded && (
                                                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSubOpen ? 'rotate-180' : ''}`}/>
                                            )}
                                        </button>

                                        {/* SUBMENÚS */}
                                        <div className={`overflow-hidden transition-all duration-300 ${isSubOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                            {isExpanded && (
                                                <ul className="ml-4 pl-4 border-l-2 border-white/30 space-y-1">
                                                    {item.subs.map((sub, idx) => {
                                                        const isSubActive = location.pathname === sub.link;
                                                        return (
                                                            <li key={idx}>
                                                                <Link
                                                                    to={sub.link}
                                                                    onClick={() => setIsOpen(false)}
                                                                    className={`block py-2 px-3 rounded-lg text-sm transition-all
                                                                        ${isSubActive 
                                                                            ? 'text-fic-yellow font-bold bg-white/10 shadow-inner' 
                                                                            : 'text-gray-100 hover:text-white hover:bg-white/5'}`}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    /* ENLACE SIMPLE */
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                                            ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <IconComponent className={`h-6 w-6 min-w-[24px] flex-shrink-0 ${isActive ? 'text-fic-red' : 'text-white'}`} />
                                        
                                        <span className={`whitespace-nowrap transition-all duration-200 
                                            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                                        `}>
                                            {item.section}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 3. LOGOUT */}
                <div className="p-3 border-t border-white/20 bg-fic-red flex-shrink-0">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl text-white hover:bg-red-800 transition-colors
                            ${!isExpanded ? 'justify-center' : ''}`}
                        title="Cerrar Sesión"
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                        <span className={`whitespace-nowrap font-bold transition-all duration-200 
                            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}
                        `}>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {showConfirm && (
                <ConfirmModal
                    message="¿Cerrar sesión en Fic Sullana?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default Sidebar;