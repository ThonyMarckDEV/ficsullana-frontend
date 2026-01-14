import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// --- MAPA DE ESTADOS (TRADUCCIÓN DE NÚMERO A TEXTO/COLOR) ---
const ESTADOS = {
    0: { label: 'PENDIENTE', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    1: { label: 'APROBADO',  color: 'bg-green-100 text-green-800 border-green-200' },
    2: { label: 'OBSERVADO', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    3: { label: 'RECHAZADO', color: 'bg-red-100 text-red-800 border-red-200' },
};

const ListarAdmisiones = () => {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [admisiones, setAdmisiones] = useState([]);
    
    // Paginación y Búsqueda
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // --- MODAL DETALLE ---
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    // --- VER DETALLE ---
    const handleViewAdmision = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showAdmision(id);
            const data = response.data;
            const solicitante = data.cliente ? data.cliente.datos : data.prospecto;
            const nombreSolicitante = data.cliente 
                ? `${solicitante.nombre} ${solicitante.apellidoPaterno}`
                : `${solicitante.nombres} ${solicitante.apellido_paterno}`;

            const estadoInfo = ESTADOS[data.estado] || { label: 'DESCONOCIDO' };

            const secciones = [
                {
                    title: "1. Información General",
                    icon: UserIcon,
                    items: [
                        { label: "Solicitante", value: nombreSolicitante, fullWidth: true },
                        { label: "DNI", value: solicitante.dni },
                        { label: "Tipo", value: data.cliente ? 'CLIENTE RECURRENTE' : 'PROSPECTO NUEVO' },
                        { label: "Asesor", value: data.asesor?.datos?.nombre || 'Desconocido' },
                        { label: "Sede", value: data.sede?.nombre || 'N/A' },
                    ]
                },
                {
                    title: "2. Resumen Financiero",
                    icon: BanknotesIcon,
                    items: [
                        { label: "Estado", value: estadoInfo.label },
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
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Solicitante',
            render: (row) => {
                const persona = row.cliente ? row.cliente.datos : row.prospecto;
                const nombre = row.cliente 
                    ? `${persona.nombre} ${persona.apellidoPaterno}` 
                    : `${persona.nombres} ${persona.apellido_paterno}`;
                
                return (
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${row.cliente ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                            <UserIcon className="w-5 h-5"/>
                        </div>
                        <div>
                            <span className="font-black text-fic-dark block uppercase tracking-tight text-xs">{nombre}</span>
                            <span className="text-[10px] text-slate-500 font-bold">{persona.dni}</span>
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
                const config = ESTADOS[row.estado] || { label: 'DESC.', color: 'bg-gray-100' };
                return (
                    <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border ${config.color}`}>
                        {config.label}
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
                    
                    {/* Solo editable si es PENDIENTE (0) u OBSERVADO (2) */}
                    {(row.estado === 0 || row.estado === 2) ? (
                        <Link 
                            to={`/asesor/editar-admision/${row.id}`} 
                            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                        >
                            <PencilSquareIcon className="w-5 h-5" /> Editar
                        </Link>
                    ) : null}
                </div>
            )
        }
    ], []);

    const fetchAdmisiones = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getAdmisiones(page, search);
            setAdmisiones(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                totalItems: response.total,
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar las admisiones.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAdmisiones(1, searchTerm); }, [fetchAdmisiones, searchTerm]);

    if (loading && admisiones.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-end mb-8 border-b-4 border-fic-red pb-4">
                <div>
                    <h1 className="text-4xl font-black text-fic-dark tracking-tighter uppercase">Admisiones</h1>
                    <p className="text-slate-500 font-bold">Evaluación crediticia de clientes y prospectos</p>
                </div>
                <Link 
                    to="/asesor/nueva-admision" 
                    className="bg-fic-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-black shadow-lg uppercase tracking-widest active:scale-95"
                >
                    + Nueva Evaluación
                </Link>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

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
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchAdmisiones(page, searchTerm)
                    }}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Buscar por DNI o Nombre..."
                />
            </div>
        </div>
    );
};

export default ListarAdmisiones;