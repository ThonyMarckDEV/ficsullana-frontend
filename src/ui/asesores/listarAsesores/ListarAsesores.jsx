import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAsesores, toggleAsesorEstado, showAsesor } from 'services/asesorService';
import Table from 'components/Shared/Tables/Table';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { 
    PencilSquareIcon, 
    EyeIcon, 
    IdentificationIcon, 
    PhoneIcon, 
    UserCircleIcon, 
    BriefcaseIcon,
} from '@heroicons/react/24/outline';
import { UsersIcon } from 'lucide-react';
import LoadingScreen from 'components/Shared/LoadingScreen';

const ListarAsesores = () => {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [asesores, setAsesores] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [alert, setAlert] = useState(null);
    const [search, setSearch] = useState('');
    
    // Estados para Modal de Información (Igual que en Sedes)
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });
    
    // Estado para Toggle
    const [toggleData, setToggleData] = useState(null);

    // --- CARGA DE DATOS ---
    const fetchAsesores = useCallback(async (page = 1, searchTerm = '') => {
        setLoading(true);
        try {
            const res = await getAsesores(page, searchTerm);
            // Ajustar según estructura de respuesta (res.data o res directo)
            const dataList = res.data?.data || res.data || [];
            setAsesores(dataList);
            setPagination({ 
                page: res.current_page || res.data?.current_page, 
                totalPages: res.last_page || res.data?.last_page 
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error cargando asesores.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAsesores(1, search); }, [fetchAsesores, search]);

    // --- VER DETALLE (Con Loading) ---
    const handleView = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true); // Activamos Skeleton
        setModalData({ title: 'Cargando...', sections: [] }); // Limpiamos data previa

        try {
            const response = await showAsesor(id);
            const data = response.data || response;
            const datos = data.datos_empleado || {}; 

            setModalData({
                title: 'Ficha de Asesor',
                subtitle: `Usuario: @${data.username}`,
                sections: [
                    {
                        title: 'Datos Personales', 
                        icon: IdentificationIcon,
                        items: [
                            { label: 'Nombre Completo', value: `${datos.nombre || ''} ${datos.apellidoPaterno || ''} ${datos.apellidoMaterno || ''}`, fullWidth: true },
                            { label: 'DNI', value: datos.dni },
                            { label: 'Fecha Nacimiento', value: datos.fechaNacimiento ? new Date(datos.fechaNacimiento).toLocaleDateString() : '-' },
                            { label: 'Sexo', value: datos.sexo },
                            { label: 'Estado Civil', value: datos.estadoCivil },
                        ]
                    },
                    {
                        title: 'Contacto', 
                        icon: PhoneIcon,
                        items: [ 
                            { label: 'Teléfono', value: datos.telefono }, 
                            { label: 'Dirección', value: datos.direccion, fullWidth: true } 
                        ]
                    },
                    {
                        title: 'Información Laboral', 
                        icon: BriefcaseIcon,
                        items: [ 
                            { label: 'Sede Asignada', value: data.sede?.nombre || 'Sin Sede' }, 
                            { label: 'Estado', value: data.estado === 1 ? 'ACTIVO' : 'INACTIVO' },
                            { label: 'Fecha Registro', value: new Date(data.created_at).toLocaleDateString() } 
                        ]
                    }
                ]
            });
        } catch(e) { 
            setAlert({ type: 'error', message: 'Error al cargar detalles del asesor.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false); // Desactivamos Skeleton
        }
    };

    // --- CAMBIAR ESTADO ---
    const handleToggle = async () => {
        if (!toggleData) return;
        try {
            await toggleAsesorEstado(toggleData.id, toggleData.estado === 1 ? 0 : 1);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            setToggleData(null);
            fetchAsesores(pagination.page, search);
        } catch (e) { 
            setAlert({ type: 'error', message: 'No se pudo cambiar el estado.' }); 
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Asesor',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                        <UserCircleIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <span className="font-black text-slate-700 block uppercase tracking-tight">
                            {row.datos_empleado?.nombre || ''} {row.datos_empleado?.apellidoPaterno || ''} {row.datos_empleado?.apellidoMaterno || ''}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <BriefcaseIcon className="w-3 h-3"/>
                            {row.sede?.nombre || 'Sin Asignar'}
                        </span>
                    </div>
                </div>
            )
        },
        { 
            header: 'DNI', 
            render: (row) => <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">{row.datos_empleado?.dni}</span> 
        },
        { 
            header: 'Usuario', 
            render: (row) => <span className="text-sm font-bold text-indigo-600">@{row.username}</span> 
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setToggleData({ id: row.id, estado: row.estado })} 
                    className={`px-4 py-1 font-black text-xs rounded-md shadow-sm border-b-2 transition-all active:translate-y-0.5
                        ${row.estado === 1 
                            ? 'text-white bg-green-600 border-green-800 hover:bg-red-600 hover:border-red-800' 
                            : 'text-white bg-red-600 border-red-800 hover:bg-green-600 hover:border-green-800'}`}
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
                            <EyeIcon className="w-5 h-5"/> 
                        </div>
                        Ver
                    </button>
                    <Link 
                        to={`/personal/editar-asesor/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5"/> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    if (loading && asesores.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">

            <PageHeader 
                title="Gestión de Asesores"
                subtitle="Personal Operativo de Créditos"
                buttonText="+ Nuevo Asesor"
                buttonLink="/personal/agregar-asesor"
                icon={UsersIcon}
            />

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns} 
                    data={asesores} 
                    loading={loading} 
                    pagination={{ 
                        currentPage: pagination.page, 
                        totalPages: pagination.totalPages, 
                        onPageChange: (p) => fetchAsesores(p, search) 
                    }} 
                    onSearch={setSearch} 
                    searchPlaceholder="Buscar por nombre o DNI..." 
                />
            </div>

            {/* MODAL DE INFORMACIÓN CON LOADER */}
            <InfoModal 
                isOpen={isInfoOpen} 
                onClose={() => setIsInfoOpen(false)} 
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading} // <--- AQUÍ PASAMOS EL ESTADO DE CARGA
            />

            {/* MODAL DE CONFIRMACIÓN */}
            {toggleData && (
                <ConfirmModal 
                    message={`¿Estás seguro de cambiar el estado a ${toggleData.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`} 
                    onConfirm={handleToggle} 
                    onCancel={() => setToggleData(null)} 
                />
            )}
        </div>
    );
};

export default ListarAsesores;