import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Bars3Icon, 
    ChevronDownIcon, 
    ArrowRightOnRectangleIcon,
    UsersIcon,
    DocumentTextIcon,
    UserGroupIcon,
    ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'; 
import { logout } from 'js/logout';
import logoImg from 'assets/img/Logo_FICSULLANA.png'; 
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { Building2, House, ListChecksIcon } from 'lucide-react';
import authService from 'services/authService';

const menuConfig = [
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
        section: 'Jefes de Negocio',
        icon: UsersIcon,
        subs: [
            { name: 'Agregar Jefe Negocio', link: '/personal/agregar-jefe-negocio', permission: 'jefenegocios.crear' },
            { name: 'Listar Jefes Negocio', link: '/personal/listar-jefes-negocio', permission: 'jefenegocios.listar' },
        ]
    },
    {
        section: 'Asesores',
        icon: UserGroupIcon,
        subs: [
            { name: 'Agregar Asesor', link: '/personal/agregar-asesor', permission: 'asesores.crear' },
            { name: 'Listar Asesores', link: '/personal/listar-asesores', permission: 'asesores.listar' },
        ]
    },
    {
        section: 'Clientes',
        icon: UserGroupIcon,
        subs: [
            { name: 'Agregar Cliente', link: '/clientes/agregar', permission: 'clientes.crear' },
            { name: 'Listar Clientes', link: '/clientes/listar', permission: 'clientes.listar' },
        ]
    },
    {
        section: 'Admisiones',
        icon: ClipboardDocumentListIcon,
        subs: [
            { name: 'Nueva Admision', link: '/gestion/nueva-admision', permission: 'admisiones.crear' },
            { name: 'Listar Admisiones', link: '/gestion/listar-admisiones', permission: 'admisiones.listar' },
        ]
    },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [openSection, setOpenSection] = useState(null); 
    const [showConfirm, setShowConfirm] = useState(false);
    const [userAuth, setUserAuth] = useState({ rol: '', permisos: [] });
    const [loading, setLoading] = useState(true);
    
    const location = useLocation();

    // 1. CARGA DE SESIÓN
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await authService.verifySession();
                
                // --- CORRECCIÓN AQUÍ ---
                // Axios devuelve la data en response.data. Si usas fetch puro puede ser response directo.
                // Esta línea detecta dónde está la información real.
                const serverData = response.data || response; 

                // Verificamos en consola qué está llegando realmente (F12)
                console.log("Datos del servidor:", serverData);

                // Ahora sí accedemos a serverData.rol, no response.rol
                const rolName = serverData.rol?.nombre || '';
                const permisosArray = serverData.rol?.permisos || [];

                setUserAuth({
                    rol: rolName,
                    permisos: permisosArray
                });
            } catch (error) {
                console.error("Error al obtener sesión", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, []);

    // 2. FILTRADO
    const allowedMenu = useMemo(() => {
        if (loading) return [];

        return menuConfig.map(item => {
            // Lógica para items con submenús
            if (item.subs) {
                // Filtramos los hijos permitidos
                const visibleSubs = item.subs.filter(sub => 
                    userAuth.permisos.includes(sub.permission)
                );

                // Si queda al menos uno, mostramos el padre
                if (visibleSubs.length > 0) {
                    return { ...item, subs: visibleSubs };
                }
                return null;
            }

            // Lógica para items directos (Home)
            if (!item.permission || userAuth.permisos.includes(item.permission)) {
                return item;
            }

            return null;
        }).filter(item => item !== null); // Elimina los nulos

    }, [userAuth, loading]);

    // ... Resto de tu código de UI (isExpanded, isSectionActive, render...) se queda igual
    const isExpanded = isOpen || isHovered;

    const isSectionActive = useCallback((item) => {
        if (item.subs) return item.subs.some(sub => location.pathname === sub.link);
        if (item.link) return location.pathname === item.link;
        return false;
    }, [location.pathname]);

    useEffect(() => {
        if (!isExpanded) return;
        const activeGroup = allowedMenu.find(item => 
            item.subs && item.subs.some(sub => location.pathname === sub.link)
        );
        if (activeGroup) setOpenSection(activeGroup.section);
    }, [location.pathname, allowedMenu, isExpanded]);

    const handleLogout = () => {
        logout();
        setShowConfirm(false);
    };

    const toggleSection = (section) => {
        if (!isHovered && window.innerWidth >= 768) setIsHovered(true);
        setOpenSection(prev => prev === section ? null : section);
    };

    const sidebarClasses = `fixed left-0 top-0 h-screen bg-fic-red shadow-2xl z-40 transition-all duration-300 flex flex-col border-r border-white/10
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'} 
        md:translate-x-0 ${isHovered ? 'md:w-64' : 'md:w-20'}
    `;

    if (loading) return <div className="fixed left-0 top-0 h-screen bg-fic-red md:w-20 z-40"></div>;

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-fic-red text-white rounded-lg shadow-lg active:scale-95 transition-transform"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={sidebarClasses}
            >
                <div className={`bg-white transition-all duration-300 flex items-center justify-center flex-shrink-0 relative z-10 overflow-hidden
                    ${isExpanded ? 'h-32' : 'h-24'}`}>
                    <img src={logoImg} alt="Logo" className={`transition-all duration-300 object-contain p-2 ${isExpanded ? 'w-48' : 'w-16'}`} />
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-2 [&::-webkit-scrollbar]:hidden">
                    {allowedMenu.map((item, index) => {
                        const isActive = isSectionActive(item);
                        const isSubOpen = item.subs && openSection === item.section;
                        const IconComponent = item.icon || DocumentTextIcon;

                        return (
                            <div key={index}>
                                {item.subs ? (
                                    <>
                                        <button
                                            onClick={() => toggleSection(item.section)}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group
                                                ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                        >
                                            <div className="flex items-center gap-4 overflow-hidden">
                                                <IconComponent className={`h-6 w-6 min-w-[24px] flex-shrink-0 ${isActive ? 'text-fic-red' : 'text-white'}`} />
                                                <span className={`whitespace-nowrap transition-all duration-200 
                                                    ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                                                    {item.section}
                                                </span>
                                            </div>
                                            {isExpanded && <ChevronDownIcon className={`h-4 w-4 transition-transform ${isSubOpen ? 'rotate-180' : ''}`}/>}
                                        </button>

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
                                                                        ${isSubActive ? 'text-fic-yellow font-bold bg-white/10' : 'text-gray-100 hover:text-white hover:bg-white/5'}`}
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
                                    <Link
                                        to={item.link}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200
                                            ${isActive ? 'bg-white text-fic-red font-bold shadow-lg' : 'text-white hover:bg-white/10'}`}
                                    >
                                        <IconComponent className={`h-6 w-6 min-w-[24px] flex-shrink-0 ${isActive ? 'text-fic-red' : 'text-white'}`} />
                                        <span className={`whitespace-nowrap transition-all duration-200 
                                            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                                            {item.section}
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-3 border-t border-white/20 bg-fic-red flex-shrink-0">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className={`w-full flex items-center gap-4 p-3 rounded-xl text-white hover:bg-red-800 transition-colors
                            ${!isExpanded ? 'justify-center' : ''}`}
                        title="Cerrar Sesión"
                    >
                        <ArrowRightOnRectangleIcon className="h-6 w-6 min-w-[24px] flex-shrink-0" />
                        <span className={`whitespace-nowrap font-bold transition-all duration-200 
                            ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 overflow-hidden'}`}>
                            Cerrar Sesión
                        </span>
                    </button>
                </div>
            </div>

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