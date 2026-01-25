import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getJefesNegocio, toggleJefeEstado, showJefeNegocio } from 'services/jefeNegocioService';
import Table from 'components/Shared/Tables/Table';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { PencilSquareIcon, EyeIcon, BriefcaseIcon, IdentificationIcon, PhoneIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { UsersIcon } from 'lucide-react';
import LoadingScreen from 'components/Shared/LoadingScreen'; // <--- 1. IMPORTADO

const ListarJefesNegocio = () => {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [jefes, setJefes] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [alert, setAlert] = useState(null);
    const [search, setSearch] = useState('');
    
    // Estados para Modal de Información
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', sections: [] });
    
    const [toggleData, setToggleData] = useState(null);

    // --- CARGA DE DATOS ---
    const fetchJefes = useCallback(async (page = 1, searchTerm = '') => {
        setLoading(true);
        try {
            const res = await getJefesNegocio(page, searchTerm);
            // Aseguramos que data sea un array
            const dataList = res.data?.data || res.data || [];
            setJefes(dataList);
            setPagination({ 
                page: res.current_page || res.data?.current_page || 1, 
                totalPages: res.last_page || res.data?.last_page || 1 
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error cargando jefes de negocio.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchJefes(1, search); }, [fetchJefes, search]);

    // --- VER DETALLE (Con Loader) ---
    const handleView = async (id) => {
        setInfoOpen(true);
        setInfoLoading(true); // Activamos loader modal
        setModalData({ title: 'Cargando...', sections: [] }); 

        try {
            const response = await showJefeNegocio(id);
            const data = response.data || response;
            const datos = data.datos_empleado || {}; 

            setModalData({
                title: 'Ficha de Jefe de Negocio',
                subtitle: `Usuario: @${data.username}`,
                sections: [
                    {
                        title: 'Datos Personales', 
                        icon: IdentificationIcon,
                        items: [
                            { label: 'Nombre Completo', value: `${datos.nombre} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`, fullWidth: true },
                            { label: 'DNI', value: datos.dni },
                            { label: 'Estado Civil', value: datos.estadoCivil },
                            { label: 'Sexo', value: datos.sexo },
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
            setInfoOpen(false); 
            setAlert({ type: 'error', message: 'Error al cargar detalles.' }); 
        } finally {
            setInfoLoading(false); 
        }
    };

    // --- CAMBIAR ESTADO ---
    const handleToggle = async () => {
        if (!toggleData) return;
        try {
            await toggleJefeEstado(toggleData.id, toggleData.estado === 1 ? 0 : 1);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchJefes(pagination.page, search);
            setToggleData(null);
        } catch (e) { 
            setAlert({ type: 'error', message: 'No se pudo cambiar el estado.' }); 
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Jefe de Negocio',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg border border-purple-100">
                        <BriefcaseIcon className="w-6 h-6"/>
                    </div>
                    <div>
                        <span className="font-black text-slate-700 block uppercase tracking-tight">
                            {row.datos_empleado?.nombre} {row.datos_empleado?.apellidoPaterno}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            Sede: {row.sede?.nombre || 'N/A'}
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
            render: (row) => <span className="text-sm font-bold text-slate-500">@{row.username}</span> 
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setToggleData({ id: row.id, estado: row.estado })} 
                    className={`px-4 py-1 font-black text-xs rounded-md shadow-sm border-b-2 transition-all active:translate-y-0.5
                        ${row.estado === 1 
                            ? 'text-white bg-green-600 border-green-800 hover:bg-red-600' 
                            : 'text-white bg-red-600 border-red-800 hover:bg-green-600'}`}
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
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark text-xs uppercase transition-colors"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5"/> 
                        </div>
                        Ver
                    </button>
                    <Link 
                        to={`/personal/editar-jefe-negocio/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 text-xs uppercase transition-colors"
                    >
                        <PencilSquareIcon className="w-5 h-5"/> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    // --- 2. CONDICIÓN DE CARGA INICIAL ---
    if (loading && jefes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
  
            <PageHeader 
                title="Jefes de Negocio"
                subtitle="Gestión del personal de supervisión"
                buttonText="+ Nuevo Jefe"
                buttonLink="/personal/agregar-jefe-negocio"
                icon={UsersIcon}
            />

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            
            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns} 
                    data={jefes} 
                    loading={loading} 
                    pagination={{ 
                        currentPage: pagination.page, 
                        totalPages: pagination.totalPages, 
                        onPageChange: (p) => fetchJefes(p, search) 
                    }} 
                    onSearch={setSearch} 
                    searchPlaceholder="Buscar Jefe..." 
                />
            </div>

            <InfoModal 
                isOpen={infoOpen} 
                onClose={() => setInfoOpen(false)} 
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading} 
            />

            {toggleData && (
                <ConfirmModal 
                    message={`¿Desea cambiar el estado a ${toggleData.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`} 
                    onConfirm={handleToggle} 
                    onCancel={() => setToggleData(null)} 
                />
            )}
        </div>
    );
};

export default ListarJefesNegocio;