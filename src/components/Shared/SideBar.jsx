import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Bars3Icon, 
    ChevronDownIcon, 
    HomeIcon, 
    DocumentTextIcon, 
    ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'; 
import jwtUtils from 'utilities/Token/jwtUtils';
import { logout } from 'js/logout';
import logoImg from 'assets/img/Logo_FICSULLANA.png'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

const menus = {
    admin: [
        { section: 'Roles', subs: [{ name: 'Listar Roles', link: '/admin/listar-roles' }] },
    ],
    contador: [
        { section: 'Prestamos', subs: [{ name: 'Pagar Prestamo', link: '/cliente/pagar-prestamo' }] },
    ],
    jefe_contabilidad: [
        { section: 'Dashboard', link: '/asesor/dashboard' },
        {
            section:'Evaluaciones',
            subs:[
                {name:'Evaluar Cliente' , link:'/asesor/evaluacion-cliente'},
                {name:'Evaluaciones Enviadas' ,  link: '/asesor/evaluaciones-enviadas'}
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

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const toggleSection = (section) => {
        if (!isHovered && window.innerWidth >= 768) setIsHovered(true);
        setOpenSection(prev => prev === section ? null : section);
    };

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) setIsHovered(true);
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) setIsHovered(false);
    };

    const isSectionActive = useCallback((item) => {
        if (item.link && location.pathname.startsWith(item.link)) return true;
        if (item.subs) return item.subs.some(sub => location.pathname.startsWith(sub.link));
        return false;
    }, [location.pathname]); 
    
    useEffect(() => {
        if (openSection === null) {
            const activeItem = roleMenu.find(item => isSectionActive(item));
            if (activeItem && activeItem.subs) setOpenSection(activeItem.section);
        }
    }, [location.pathname, roleMenu, isSectionActive, openSection]); 

    const sidebarWidth = isHovered ? 'md:w-64' : 'md:w-20';

    return (
        <>
            {/* Botón Hamburguesa (Móvil) */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Sidebar Container */}
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className={`fixed left-0 top-0 h-screen bg-red-600 shadow-2xl z-40 transition-all duration-300 ease-out flex flex-col
                    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
                    ${sidebarWidth} md:translate-x-0 border-r border-gray-200`}
            >
                {/* 1. HEADER (Logo) - CORREGIDO PARA MÓVIL */}
                {/* h-32: Altura base grande para móvil.
                    md:... : En escritorio usa la lógica condicional.
                */}
                <div className={`bg-white transition-all duration-300 flex items-center justify-center flex-shrink-0 shadow-md relative z-10
                    h-32 ${isHovered ? 'md:h-40' : 'md:h-24'}`}>
                    
                    {/* w-40 h-auto: Tamaño base grande para móvil.
                        md:... : En escritorio alterna entre grande (w-48) y pequeño (w-12 h-12).
                    */}
                    <img
                        src={logoImg}
                        alt="Logo"
                        className={`transition-all duration-300 object-contain p-2
                            w-40 h-auto ${isHovered ? 'md:w-48' : 'md:w-12 md:h-12'}
                        `}
                    />
                </div>

                {/* 2. BODY (Menú) */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {roleMenu.map((item, index) => {
                        const isActive = isSectionActive(item); 
                        const isSubOpen = item.subs && openSection === item.section; 

                        return (
                            <div key={index}>
                                {item.subs ? (
                                    <>
                                        <button
                                            onClick={() => toggleSection(item.section)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                                                ${isActive ? 'bg-white text-red-600 font-bold shadow-sm' : 'text-white hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <DocumentTextIcon className="h-6 w-6 min-w-[24px] flex-shrink-0" /> 
                                                <span className={`whitespace-nowrap transition-opacity duration-200 
                                                    ${!isHovered ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                                                    {item.section}
                                                </span>
                                            </div>
                                            
                                            {(isHovered || window.innerWidth < 768) && (
                                                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSubOpen ? 'rotate-180' : ''}`}/>
                                            )}
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-300 ${isSubOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                            {(isHovered || window.innerWidth < 768) && (
                                                <ul className="ml-4 pl-4 border-l-2 border-white/30 space-y-1">
                                                    {item.subs.map((sub, idx) => (
                                                        <li key={idx}>
                                                            <Link
                                                                to={sub.link}
                                                                onClick={() => setIsOpen(false)}
                                                                className={`block py-2 px-3 rounded-lg text-sm transition-colors
                                                                    ${location.pathname.startsWith(sub.link) 
                                                                        ? 'text-yellow-300 font-bold bg-white/10' 
                                                                        : 'text-gray-100 hover:text-white hover:bg-white/5'}`}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                                            ${isActive ? 'bg-white text-red-600 font-bold shadow-sm' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <HomeIcon className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                                        <span className={`whitespace-nowrap transition-opacity duration-200 
                                            ${!isHovered ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                                            {item.section}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 3. FOOTER (Logout) */}
                <div className="p-3 border-t border-white/20 bg-red-600 flex-shrink-0">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl text-white hover:bg-red-700 hover:shadow-inner transition-colors
                            ${!isHovered ? 'md:justify-center' : ''}`}
                        title="Cerrar Sesión"
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-opacity duration-200 
                            ${!isHovered ? 'md:hidden md:opacity-0' : 'opacity-100'}`}>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </div>

            {showConfirm && (
                <ConfirmModal
                    message="¿Deseas cerrar sesión?"
                    onConfirm={handleLogout}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default Sidebar;