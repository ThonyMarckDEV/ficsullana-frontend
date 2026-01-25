import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSedes, toggleSedeEstado, showSede } from 'services/sedeService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import { 
    PencilSquareIcon, 
    BuildingStorefrontIcon, 
    EyeIcon, 
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

const ListarSedes = () => {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [sedes, setSedes] = useState([]);
    
    // Paginación y Búsqueda
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Toggle Estado
    const [sedeToToggle, setSedeToToggle] = useState(null);

    // --- ESTADOS PARA MODAL DE INFORMACIÓN ---
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    // --- FUNCIÓN PARA VER DETALLE ---
    const handleViewSede = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showSede(id);
            // Solo extraemos la sede, ya no hay admin vinculado directamente en la respuesta plana
            const { sede } = response.data; 
            
            // Transformamos la data para el InfoModal
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

            setModalData({
                title: "Ficha de Sede",
                subtitle: `Detalle de: ${sede.nombre}`,
                sections: seccionesFormateadas
            });

        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle de la sede.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    // --- COLUMNAS ---
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
                     {/* BOTÓN VER */}
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

                    {/* BOTÓN EDITAR */}
                    <Link 
                        to={`/sedes/editar/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchSedes = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getSedes(page, search);
            setSedes(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                totalItems: response.total,
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar las sedes.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchSedes(1, searchTerm); }, [fetchSedes, searchTerm]);

    const executeToggleEstado = async () => {
        if (!sedeToToggle || sedeToToggle.esPrincipal) return;
        const nuevoEstado = sedeToToggle.estado === 1 ? 0 : 1;
        setSedeToToggle(null);
        setLoading(true);
        try {
            const response = await toggleSedeEstado(sedeToToggle.id, nuevoEstado);
            setAlert(response);
            await fetchSedes(paginationInfo.currentPage, searchTerm);
        } catch (err) {
            setAlert(err);
            setLoading(false);
        }
    };

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

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {/* MODAL DE INFORMACIÓN */}
            <InfoModal 
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading}
            />

            {/* MODAL DE CONFIRMACIÓN */}
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
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchSedes(page, searchTerm)
                    }}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Buscar por nombre de sede..."
                />
            </div>
        </div>
    );
};

export default ListarSedes;