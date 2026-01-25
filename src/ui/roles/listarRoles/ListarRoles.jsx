import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRoles, toggleRolEstado, showRol } from 'services/rolService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import { 
    PencilSquareIcon, 
    ShieldCheckIcon, 
    EyeIcon, 
    KeyIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

const ListarRoles = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [roles, setRoles] = useState([]);
    
    // Paginación
    const [paginationInfo, setPaginationInfo] = useState({ 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0 
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [roleToToggle, setRoleToToggle] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    // --- FUNCIÓN DE CARGA ---
    const fetchRoles = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getRoles(page, search);
            
            const responseData = response.data || response; 

            // Validamos si es paginado o array simple
            let rolesArray = [];
            
            if (Array.isArray(responseData)) {
                // Caso: Array directo
                rolesArray = responseData;
            } else if (responseData.data && Array.isArray(responseData.data)) {
                // Caso: Objeto paginado estándar de Laravel
                rolesArray = responseData.data;
                
                setPaginationInfo({
                    currentPage: responseData.current_page || 1,
                    totalPages: responseData.last_page || 1,
                    totalItems: responseData.total || 0,
                });
            } else {
                console.warn("⚠️ Formato de respuesta inesperado:", responseData);
            }
            setRoles(rolesArray);

        } catch (err) {
            console.error("❌ Error fetchRoles:", err);
            setAlert({ type: 'error', message: 'Error al cargar los roles.' });
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar al inicio y cuando cambie la búsqueda (con debounce idealmente, pero directo por ahora)
    useEffect(() => { 
        fetchRoles(1, searchTerm); 
    }, [fetchRoles, searchTerm]);

    // --- MANEJO DE VISTAS (MODAL) ---
    const handleViewRol = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showRol(id);
            const rol = response.data || response;
            
            const listaPermisos = rol.permisos && rol.permisos.length > 0 
                ? rol.permisos.map(p => p.nombre).join(', ') 
                : 'Sin permisos asignados';

            setModalData({
                title: "Detalle del Rol",
                subtitle: `Perfil: ${rol.nombre}`,
                sections: [
                    {
                        title: "Información del Rol",
                        icon: ShieldCheckIcon,
                        items: [
                            { label: "Nombre", value: rol.nombre, fullWidth: true },
                            { label: "Descripción", value: rol.descripcion || '-', fullWidth: true },
                            { label: "Estado", value: rol.estado === 1 ? 'ACTIVO' : 'INACTIVO' },
                        ]
                    },
                    {
                        title: "Permisos",
                        icon: KeyIcon,
                        items: [
                            { label: "Accesos", value: listaPermisos, fullWidth: true, isLongText: true }
                        ]
                    }
                ]
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Rol',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                        <ShieldCheckIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-black text-slate-700 block uppercase">{row.nombre}</span>
                        {row.nombre === 'superadmin' && (
                            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                                SISTEMA
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Descripción',
            render: (row) => <span className="text-sm text-slate-500 truncate max-w-xs block" title={row.descripcion}>{row.descripcion || '-'}</span>
        },
        {
            header: 'Permisos',
            render: (row) => (
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                    {Array.isArray(row.permisos) ? row.permisos.length : 0} Permisos
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setRoleToToggle({ id: row.id, estado: row.estado, nombre: row.nombre })}
                    disabled={row.nombre === 'superadmin'}
                    className={`px-4 py-1 font-black text-xs rounded-md border-b-2 transition-all active:translate-y-0.5
                        ${row.estado === 1 
                            ? 'bg-green-600 border-green-800 text-white hover:bg-red-600 hover:border-red-800' 
                            : 'bg-red-600 border-red-800 text-white hover:bg-green-600 hover:border-green-800'}
                        ${row.nombre === 'superadmin' ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <button onClick={() => handleViewRol(row.id)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" title="Ver Detalle">
                        <EyeIcon className="w-5 h-5" />
                    </button>
                    {row.nombre !== 'superadmin' ? (
                        <Link to={`/roles/editar/${row.id}`} className="p-2 text-fic-red hover:bg-red-50 rounded-full transition-colors" title="Editar">
                            <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                    ) : (
                        <div className="p-2 text-slate-300 cursor-not-allowed">
                            <PencilSquareIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            )
        }
    ], []);

    // --- ACCIÓN DE TOGGLE ---
    const executeToggleEstado = async () => {
        if (!roleToToggle) return;
        setLoading(true);
        try {
            await toggleRolEstado(roleToToggle.id);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            setRoleToToggle(null);
            fetchRoles(paginationInfo.currentPage, searchTerm);
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cambiar estado.' });
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Gestión de Roles"
                subtitle="Administración de perfiles y permisos"
                icon={ShieldCheckIcon}
                buttonText="+ Nuevo Rol"
                buttonLink="/roles/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <InfoModal 
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading}
            />

            {roleToToggle && (
                <ConfirmModal
                    message={`¿Cambiar estado del rol "${roleToToggle.nombre}"?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setRoleToToggle(null)}
                />
            )}
            
            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns}
                    data={roles}
                    loading={loading}
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchRoles(page, searchTerm)
                    }}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Buscar rol..."
                />
            </div>
        </div>
    );
};

export default ListarRoles;