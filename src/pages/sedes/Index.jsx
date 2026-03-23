import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSedes, toggleSedeEstado, showSede } from 'services/sedeService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { 
    PencilSquareIcon, 
    BuildingStorefrontIcon, 
    EyeIcon, 
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const INITIAL_FILTERS = {
    search: '',
    estado: ''
};

const Index = () => {
    const [sedeToToggle, setSedeToToggle] = useState(null);

    const {
        loading,
        setLoading,
        alert,
        setAlert,
        rows: sedes,
        paginationInfo,
        filters,
        fetchRows: fetchSedes,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear,
    } = usePaginatedIndex({
        initialFilters: INITIAL_FILTERS,
        fetcher: getSedes,
        onError: (error) => handleApiError(error , 'Error al cargar las sedes.'),
    });
    const { modalProps, openInfoModal } = useInfoModal({ setAlert });

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'Nombre, Dirección o Código SUNAT...',
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

    const handleViewSede = useCallback((id) => openInfoModal({
        fetcher: () => showSede(id),
        mapData: (response) => {
            const { sede } = response.data; 
            
            const seccionesFormateadas = [
                {
                    title: "Datos del Local",
                    icon: BuildingStorefrontIcon,
                    items: [
                        { label: "Nombre de Sede", value: sede.nombre, fullWidth: true },
                        { label: "Código SUNAT", value: sede.codigo_sunat || 'No registrado' },
                        { label: "Dirección", value: sede.direccion, fullWidth: true },
                        { label: "Estado Actual", value: sede.estado === 1 ? 'ACTIVO' : 'INACTIVO' },
                        { label: "Fecha Creación", value: new Date(sede.created_at).toLocaleDateString() },
                    ]
                }
            ];

            return {
                title: "Ficha de Sede",
                subtitle: `Detalle de: ${sede.nombre}`,
                sections: seccionesFormateadas
            };
        },
        onError: (error) => handleApiError(error , 'No se pudo cargar el detalle de la sede.'),
    }), [openInfoModal]);

    const executeToggleEstado = async () => {
        if (!sedeToToggle || sedeToToggle.esPrincipal) return;
        const nuevoEstado = sedeToToggle.estado === 1 ? 0 : 1;
        setSedeToToggle(null);
        setLoading(true);
        try {
            await toggleSedeEstado(sedeToToggle.id, nuevoEstado);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            await fetchSedes(paginationInfo.currentPage).catch(() => {});
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar estado.')); 
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Nombre',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-fic-red rounded-lg border border-red-100">
                        <BuildingStorefrontIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-black text-fic-dark block uppercase tracking-tight">{row.nombre}</span>
                        {row.id === 1 && (
                            <span className="text-[10px] bg-fic-yellow text-fic-dark font-black px-2 py-0.5 rounded shadow-sm border border-yellow-400">
                                PRINCIPAL
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Código SUNAT',
            render: (row) => row.codigo_sunat 
                ? <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{row.codigo_sunat}</span> 
                : <span className="text-slate-300 italic">N/A</span>
        },
        {
            header: 'Dirección',
            render: (row) => <span className="text-sm text-slate-600 truncate max-w-xs block font-medium" title={row.direccion}>{row.direccion || 'Sin dirección'}</span>
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setSedeToToggle({ id: row.id, estado: row.estado, esPrincipal: row.id === 1 })}
                    disabled={row.id === 1}
                    className={`px-4 py-1 font-black text-xs rounded-md shadow-sm transition-all duration-150 border-b-2 ${
                        row.estado === 1
                            ? 'text-white bg-green-600 border-green-800 hover:bg-red-600 hover:border-red-800'
                            : 'text-white bg-red-600 border-red-800 hover:bg-green-600 hover:border-green-800'
                    } ${row.id === 1 ? 'opacity-50 cursor-not-allowed' : 'active:translate-y-0.5'}`}
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
                        onClick={() => handleViewSede(row.id)}
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                        title="Ver Detalles"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                        </div>
                        Ver
                    </button>

                    <Link 
                        to={`/sedes/editar/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], [handleViewSede]);

    if (loading && sedes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Gestión de Sedes"
                subtitle="Panel de control administrativo - Fic Sullana"
                icon={BuildingOfficeIcon}
                buttonText="+ Nueva Sede"
                buttonLink="/sedes/agregar"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <InfoModal {...modalProps} />

            {sedeToToggle && (
                <ConfirmModal
                    message={`¿Deseas cambiar el estado a ${sedeToToggle.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setSedeToToggle(null)}
                />
            )}
            
            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns}
                    data={sedes}
                    loading={loading}
                    
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterClear={handleFilterClear}

                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchSedes(page).catch(() => {})
                    }}
                />
            </div>
        </div>
    );
};

export default Index;