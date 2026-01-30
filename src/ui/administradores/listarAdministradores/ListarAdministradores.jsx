import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAdministradores, toggleAdminEstado, showAdministrador } from 'services/administradorService';
import Table from 'components/Shared/Tables/Table';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, EyeIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import SedeSearchSelect from 'components/Shared/Comboboxes/SedeSearchSelect';

const ListarAdministradores = () => {
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [alert, setAlert] = useState(null);
    
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', sections: [] });
    const [toggleData, setToggleData] = useState(null);

    const [filters, setFilters] = useState({
        search: '',
        estado: '',
        sede_id: ''
    });

    const filtersRef = useRef(filters);
    useEffect(() => { filtersRef.current = filters; }, [filters]);

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'Nombre, DNI o Usuario...',
            colSpan: 'md:col-span-4'
        },
        {
            name: 'sede_id',
            type: 'custom',
            label: '',
            colSpan: 'md:col-span-4',
            render: ({ value, onChange }) => (
                <SedeSearchSelect 
                    selectedId={value}
                    onSelect={(sede) => onChange('sede_id', sede?.id || '')}
                />
            )
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

    const fetchAdmins = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const currentFilters = filtersRef.current;
            const res = await getAdministradores(page, currentFilters);
            
            setAdmins(res.data || []);
            setPagination({ page: res.current_page, totalPages: res.last_page });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar administradores.' });
        } finally { 
            setLoading(false); 
        }
    }, []);

    useEffect(() => { fetchAdmins(1); }, [fetchAdmins]);


    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback(() => {
        fetchAdmins(1);
    }, [fetchAdmins]);

    const handleFilterClear = useCallback(() => {
        const clean = { search: '', estado: '', sede_id: '' };
        setFilters(clean);
        filtersRef.current = clean;
        fetchAdmins(1);
    }, [fetchAdmins]);

    const handleView = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const res = await showAdministrador(id);
            const data = res.data;
            
            const admin = data.data || data; 

            setModalData({
                title: 'Perfil de Administrador',
                subtitle: `@${admin.username}`,
                sections: [
                    {
                        title: 'Datos Personales',
                        items: [
                            { label: 'Nombre', value: `${admin.datos_empleado?.nombre || ''} ${admin.datos_empleado?.apellidoPaterno || ''}`, fullWidth: true },
                            { label: 'DNI', value: admin.datos_empleado?.dni },
                            { label: 'Sede', value: admin.sede?.nombre || 'General' }
                        ]
                    }
                ]
            });
        } finally { setInfoLoading(false); }
    };

    const handleToggle = async () => {
        try {
            await toggleAdminEstado(toggleData.id);
            setToggleData(null);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchAdmins(pagination.page);
        } catch (e) { 
            setAlert({ type: 'error', message: "Error al cambiar estado" });
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Administrador',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-10 h-10 text-slate-400"/>
                    <div>
                        <span className="font-black text-slate-700 block uppercase">
                            {row.datos_empleado?.nombre} {row.datos_empleado?.apellidoPaterno}
                        </span>
                        <span className="text-[10px] text-indigo-600 font-bold">@{row.username}</span>
                    </div>
                </div>
            )
        },
        { header: 'Sede', render: (row) => row.sede?.nombre || 'N/A' },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setToggleData({ id: row.id, estado: row.estado })}
                    className={`px-3 py-1 rounded font-black text-xs text-white ${row.estado === 1 ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}
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
                            onClick={() => handleView(row.id)}
                            className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                        >
                            <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                                <EyeIcon className="w-5 h-5" />
                            </div>
                            Ver
                        </button>
                        <Link 
                            to={`/personal/editar-administrador/${row.id}`} 
                            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                        >
                            <PencilSquareIcon className="w-5 h-5" /> Editar
                        </Link>
                </div>
            )
        }
    ], []);

    if (loading && admins.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Administradores" icon={ShieldCheckIcon} buttonText="+ Nuevo Admin" buttonLink="/personal/agregar-administrador" />
            
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <Table 
                columns={columns} 
                data={admins} 
                loading={loading} 
                
                // Filtros
                filterConfig={filterConfig}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterSubmit={handleFilterSubmit}
                onFilterClear={handleFilterClear}

                pagination={{ 
                    currentPage: pagination.page, 
                    totalPages: pagination.totalPages, 
                    onPageChange: (page) => fetchAdmins(page) 
                }} 
            />
            
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} title={modalData.title} subtitle={modalData.subtitle} sections={modalData.sections} loading={infoLoading} />
            
            {toggleData && <ConfirmModal message="¿Cambiar estado?" onConfirm={handleToggle} onCancel={() => setToggleData(null)} />}
        </div>
    );
};

export default ListarAdministradores;