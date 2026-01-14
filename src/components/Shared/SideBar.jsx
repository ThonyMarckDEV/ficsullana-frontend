import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Bars3Icon, 
    ChevronDownIcon, 
    ArrowRightOnRectangleIcon,
    UserGroupIcon,
    UsersIcon,
    BanknotesIcon,
    ChartBarIcon,
    ClipboardDocumentCheckIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline'; 
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';
import logoImg from 'assets/img/Logo_FICSULLANA.png'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { Building2, House } from 'lucide-react';

// --- CONFIGURACIÓN DE MENÚS ---
const menus = {
    superadmin: [
        { 
            section: 'Home', 
            icon: House, 
            link: '/superadmin'
        },
        {
            section: 'Sedes',
            icon: Building2,
            subs: [
                { name: 'Agregar Sede', link: '/superadmin/agregar-sede' },
                { name: 'Listar Sedes', link: '/superadmin/listar-sedes' },
            ]
        },
    ],
    admin: [
        { 
            section: 'Home', 
            icon: House, 
            link: '/admin' 
        },
        {
            section: 'Clientes',
            icon: UsersIcon,
            subs: [
                { name: 'Agregar Cliente', link: '/admin/agregar-cliente' },
                { name: 'Listar Clientes', link: '/admin/listar-clientes' },
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
    contador: [
        { 
            section: 'Prestamos', 
            icon: BanknotesIcon, 
            subs: [{ name: 'Pagar Prestamo', link: '/cliente/pagar-prestamo' }] 
        },
    ]
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

    const isSectionActive = useCallback((item) => {

        if (item.subs) {
            return item.subs.some(sub => location.pathname === sub.link);
        }
        
        if (item.link) {
            return location.pathname === item.link;
        }
        
        return false;
    }, [location.pathname]);


    useEffect(() => {
        if (!isHovered && window.innerWidth >= 768) return;

        const activeGroup = roleMenu.find(item => 
            item.subs && item.subs.some(sub => location.pathname === sub.link)
        );
        if (activeGroup) {
            setOpenSection(activeGroup.section);
        }
    }, [location.pathname, roleMenu, isHovered]);


    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const toggleSection = (section) => {
        if (!isHovered && window.innerWidth >= 768) setIsHovered(true);
        setOpenSection(prev => prev === section ? null : section);
    };

    // Control de ancho del sidebar
    const sidebarWidth = isHovered ? 'md:w-64' : 'md:w-20';

    return (
        <>
            {/* Botón Móvil */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-fic-red text-white rounded-lg shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Sidebar Container */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`fixed left-0 top-0 h-screen bg-fic-red shadow-2xl z-40 transition-all duration-300 flex flex-col
                    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
                    ${sidebarWidth} md:translate-x-0 border-r border-white/10`}
            >
                {/* 1. LOGO FIC SULLANA */}
                <div className={`bg-white transition-all duration-300 flex items-center justify-center flex-shrink-0 relative z-10
                    ${isHovered ? 'h-32' : 'h-24'}`}>
                    <img
                        src={logoImg}
                        alt="Logo Fic Sullana"
                        className={`transition-all duration-300 object-contain p-2
                            ${isHovered ? 'w-48' : 'w-12'}
                        `}
                    />
                </div>

                {/* 2. MENÚ SCROLLABLE */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20">
                    {roleMenu.map((item, index) => {
                        const isActive = isSectionActive(item);
                        const isSubOpen = item.subs && openSection === item.section;
                        const IconComponent = item.icon || DocumentTextIcon;

                        return (
                            <div key={index}>
                                {item.subs ? (
                                    <>
                                        {/* BOTÓN PADRE (CON SUBMENÚS) */}
                                        <button
                                            onClick={() => toggleSection(item.section)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                                                ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <IconComponent className={`h-6 w-6 min-w-[24px] flex-shrink-0 ${isActive ? 'text-fic-red' : 'text-white'}`} />
                                                <span className={`whitespace-nowrap transition-opacity duration-200 ${!isHovered ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                                                    {item.section}
                                                </span>
                                            </div>
                                            {(isHovered || window.innerWidth < 768) && (
                                                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSubOpen ? 'rotate-180' : ''}`}/>
                                            )}
                                        </button>

                                        {/* LISTA DE SUBMENÚS */}
                                        <div className={`overflow-hidden transition-all duration-300 ${isSubOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                            {(isHovered || window.innerWidth < 768) && (
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
                                    /* BOTÓN SIMPLE (SIN SUBMENÚS - EJ: HOME) */
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                                            ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <IconComponent className={`h-6 w-6 min-w-[24px] flex-shrink-0 ${isActive ? 'text-fic-red' : 'text-white'}`} />
                                        <span className={`whitespace-nowrap transition-opacity duration-200 ${!isHovered ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
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
                            ${!isHovered ? 'md:justify-center' : ''}`}
                        title="Cerrar Sesión"
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                        <span className={`whitespace-nowrap font-bold transition-opacity duration-200 ${!isHovered ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </div>

            {/* MODAL DE CONFIRMACIÓN */}
            {showConfirm && (
                <ConfirmModal
                    message="¿Estás seguro de que deseas cerrar sesión en Fic Sullana?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default Sidebar;