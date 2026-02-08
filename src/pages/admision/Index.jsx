import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAdmisiones, showAdmision } from 'services/admisionService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import { 
    PencilSquareIcon, 
    EyeIcon, 
    UserIcon,
    BanknotesIcon,
    ExclamationTriangleIcon,
    ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const buildFullName = (persona, type) => {
    if (!persona) return 'Sin nombre';

    if (type === 'CLIENTE') {
        return `${persona.nombre || ''} ${persona.apellidoPaterno || ''} ${persona.apellidoMaterno || ''}`.trim() || 'Sin nombre';
    }

    return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || 'Sin nombre';
};

// --- MAPA DE ESTADOS PARA UI (BADGES) ---
const ESTADOS = {
    0: { label: 'PENDIENTE', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    1: { label: 'APROBADO',  color: 'bg-green-100 text-green-800 border-green-200' },
    2: { label: 'OBSERVADO', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    3: { label: 'RECHAZADO', color: 'bg-red-100 text-red-800 border-red-200' },
};

const ESTADO_LABEL_TO_VALUE = {
    PENDIENTE: 0,
    APROBADO: 1,
    OBSERVADO: 2,
    RECHAZADO: 3,
};

const normalizeEstado = (estado) => {
    if (typeof estado === 'number' && Number.isInteger(estado)) return estado;
    if (typeof estado === 'string' && /^\d+$/.test(estado)) return Number(estado);
    if (typeof estado === 'string') return ESTADO_LABEL_TO_VALUE[estado.toUpperCase()] ?? null;
    return null;
};

const Index = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [admisiones, setAdmisiones] = useState([]);
    
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

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
            placeholder: 'ID, DNI o Nombre...',
            colSpan: 'md:col-span-8'
        },
        {
            name: 'estado',
            type: 'select',
            label: 'Estado',
            options: [
                { value: '', label: 'Todos' },
                { value: '0', label: 'Pendiente' },
                { value: '1', label: 'Aprobado' },
                { value: '2', label: 'Observado' },
                { value: '3', label: 'Rechazado' }
            ],
            colSpan: 'md:col-span-4'
        }
    ], []);

    const fetchAdmisiones = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const currentFilters = filtersRef.current;
            const response = await getAdmisiones(page, currentFilters);
            
            setAdmisiones(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                totalItems: response.total,
            });
        } catch (err) {
            setAlert(handleApiError(err,'Error al cargar las admisiones.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { 
        fetchAdmisiones(1); 
    }, [fetchAdmisiones]);

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback(() => {
        fetchAdmisiones(1);
    }, [fetchAdmisiones]);

    const handleFilterClear = useCallback(() => {
        const cleanFilters = { search: '', estado: '' };
        setFilters(cleanFilters);
        filtersRef.current = cleanFilters;
        fetchAdmisiones(1);
    }, [fetchAdmisiones]);

    const handleViewAdmision = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showAdmision(id);
            const data = response.data;
            const solicitante = data.cliente ? data.cliente.datos : data.prospecto;
            const nombreSolicitante = buildFullName(solicitante, data.cliente ? 'CLIENTE' : 'PROSPECTO');
            const estadoValue = normalizeEstado(data.estado);
            const estadoInfo = ESTADOS[estadoValue] || { label: 'DESCONOCIDO' };
            const asesorNombre = data.asesor?.datos
                ? `${data.asesor.datos.nombre || ''} ${data.asesor.datos.apellidoPaterno || ''}`.trim()
                : 'Desconocido';

            const secciones = [
                {
                    title: "1. Información General",
                    icon: UserIcon,
                    items: [
                        { label: "Solicitante", value: nombreSolicitante, fullWidth: true },
                        { label: "DNI", value: solicitante?.dni || 'N/A' },
                        { label: "Tipo", value: data.cliente ? 'CLIENTE RECURRENTE' : 'PROSPECTO NUEVO' },
                        { label: "Asesor", value: asesorNombre },
                        { label: "Sede", value: data.sede?.nombre || 'N/A' },
                    ]
                },
                {
                    title: "2. Resumen Financiero",
                    icon: BanknotesIcon,
                    items: [
                        { label: "Estado", value: data.estado_label || estadoInfo.label },
                        { label: "Tipo Préstamo", value: data.tipo_prestamo },
                        { label: "Total Deuda", value: `S/ ${data.total_deuda}` },
                        { label: "Total Protestos", value: `S/ ${data.total_protestos}` },
                        { label: "N° Entidades", value: data.total_ifis },
                        { 
                            label: "Riesgo Detectado", 
                            value: data.excepcion_detectada ? 'SÍ (OBSERVADO)' : 'NO (CALIFICA)',
                            className: data.excepcion_detectada ? 'text-red-600 font-black' : 'text-green-600 font-bold'
                        },
                    ]
                },
                {
                    title: "3. Observaciones y Análisis",
                    icon: ExclamationTriangleIcon,
                    items: [
                        { 
                            label: "Detalle de Observaciones", 
                            value: data.observaciones || 'Sin observaciones registradas.', 
                            fullWidth: true,
                            className: data.excepcion_detectada 
                                ? 'bg-red-50 text-red-800 p-3 rounded-md border border-red-200 font-medium' 
                                : 'text-slate-600'
                        }
                    ]
                }
            ];

            setModalData({
                title: "Ficha de Admisión",
                subtitle: `Evaluación #${data.id} - Creado el: ${new Date(data.created_at).toLocaleDateString()}`,
                sections: secciones
            });

        } catch (err) {
            setAlert(handleApiError(err,'No se pudo cargar el detalle.'));
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Solicitante',
            render: (row) => {
                const persona = row.cliente ? row.cliente.datos : row.prospecto;
                const nombre = buildFullName(persona, row.cliente ? 'CLIENTE' : 'PROSPECTO');
                
                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${row.cliente ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            <UserIcon className="w-5 h-5"/>
                        </div>
                        <div>
                            <span className="font-black text-fic-dark block uppercase tracking-tight text-xs">{nombre}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{persona?.dni || 'N/A'}</span>
                        </div>
                    </div>
                );
            }
        },
        {
            header: 'Tipo',
            render: (row) => (
                <span className="font-bold text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                    {row.tipo_prestamo}
                </span>
            )
        },
        {
            header: 'Endeudamiento',
            render: (row) => (
                <div className="text-xs">
                    <div className="flex justify-between w-32">
                        <span className="text-slate-500">Deuda:</span>
                        <span className="font-bold text-slate-700">S/ {row.total_deuda}</span>
                    </div>
                    <div className="flex justify-between w-32">
                        <span className="text-slate-500">Protestos:</span>
                        <span className={`font-bold ${parseFloat(row.total_protestos) > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                            S/ {row.total_protestos}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            render: (row) => {
                const estadoValue = normalizeEstado(row.estado);
                const config = ESTADOS[estadoValue] || { label: 'DESC.', color: 'bg-gray-100' };
                return (
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${config.color}`}>
                        {row.estado_label || config.label}
                    </span>
                );
            }
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleViewAdmision(row.id)}
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                        </div>
                        Ver
                    </button>
                    
                    {(normalizeEstado(row.estado) === 0 || normalizeEstado(row.estado) === 2) ? (
                        <Link 
                            to={`/gestion/editar-admision/${row.id}`} 
                            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                        >
                            <PencilSquareIcon className="w-5 h-5" /> EDITAR
                        </Link>
                    ) : null}
                </div>
            )
        }
    ], []);

    if (loading && admisiones.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">

            <PageHeader 
                title="Admisiones"
                subtitle="Evaluación crediticia de clientes y prospectos"
                icon={ClipboardDocumentCheckIcon}
                buttonText="+ Nueva Admisión"
                buttonLink="/gestion/nueva-admision"
            />

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <InfoModal 
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading}
            />

            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns}
                    data={admisiones}
                    loading={loading}
                    
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterClear={handleFilterClear}

                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchAdmisiones(page)
                    }}
                />
            </div>
        </div>
    );
};

export default Index;