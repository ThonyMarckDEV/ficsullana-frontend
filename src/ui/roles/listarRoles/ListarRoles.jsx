import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getRoles, toggleRolEstado, showRol } from 'services/rolService';
import LoadingScreen from 'components/Shared/LoadingScreen';
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
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const ListarRoles = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [roles, setRoles] = useState([]);
    
    const [paginationInfo, setPaginationInfo] = useState({ 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0 
    });
    
    const [roleToToggle, setRoleToToggle] = useState(null);
    
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    const [filters, setFilters] = useState({
        search: '',
        estado: ''
    });

    const filtersRef = useRef(filters);
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'Nombre del rol...',
            colSpan: 'md:col-span-8'
        },
        {
            name: 'estado',
            type: 'select',
            label: 'Estado',
            options: [
                { value: '', label: 'Todos' },
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' }
            ],
            colSpan: 'md:col-span-4'
        }
    ], []);

    const fetchRoles = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const currentFilters = filtersRef.current;
            const response = await getRoles(page, currentFilters);
            
            if (response.current_page && Array.isArray(response.data)) {
                setRoles(response.data);
                setPaginationInfo({
                    currentPage: response.current_page,
                    totalPages: response.last_page,
                    totalItems: response.total
                });
            } else if (response.data && Array.isArray(response.data)) {
                setRoles(response.data);
            } else if (Array.isArray(response)) {
                setRoles(response);
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los roles.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchRoles(1); 
    }, [fetchRoles]);

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback(() => {
        fetchRoles(1);
    }, [fetchRoles]);

    const handleFilterClear = useCallback(() => {
        const cleanFilters = { search: '', estado: '' };
        setFilters(cleanFilters);
        filtersRef.current = cleanFilters;
        fetchRoles(1);
    }, [fetchRoles]);

    const handleViewRol = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true); 
        setModalData({ title: 'Cargando...', sections: [] });

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
            setAlert(handleApiError(err, 'No se pudo cargar el detalle.'));
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false); 
        }
    };

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

                <div className="flex items-center gap-4">
                        <button
                        onClick={() => handleViewRol(row.id)}
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                        title="Ver Detalles"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                        </div>
                        Ver
                    </button>

                    <Link 
                        to={`/roles/editar/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    const executeToggleEstado = async () => {
        if (!roleToToggle) return;
        setLoading(true);
        try {
            await toggleRolEstado(roleToToggle.id);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            setRoleToToggle(null);
            fetchRoles(paginationInfo.currentPage);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar estado.')); 
            setLoading(false);
        }
    };

    if (loading && roles.length === 0) return <LoadingScreen />;

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
                    
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterClear={handleFilterClear}

                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchRoles(page)
                    }}
                />
            </div>
        </div>
    );
};

export default ListarRoles;