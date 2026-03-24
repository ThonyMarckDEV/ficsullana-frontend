import React, { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEmpleados, toggleEmpleadoEstado, showEmpleado } from 'services/empleadoService';
import Table from 'components/Shared/Tables/Table';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import LoadingScreen from 'components/Shared/LoadingScreen';
import PageHeader from 'components/Shared/Headers/PageHeader';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { PencilSquareIcon, EyeIcon, UserIcon, IdentificationIcon, MapPinIcon, UsersIcon, BanknotesIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { useAuth } from 'context/AuthContext'; 
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const INITIAL_FILTERS = {
    search: '',
    estado: '',
};

const FILTER_CONFIG = [
    { name: 'search', type: 'text', label: 'Buscador', placeholder: 'DNI, Nombre...', colSpan: 'md:col-span-8' },
    { name: 'estado', type: 'select', label: 'Estado', options: [{ value: '', label: 'Todos' }, { value: '1', label: 'Activos' }, { value: '0', label: 'Inactivos' }], colSpan: 'md:col-span-4' }
];

const resolveDynamicTitle = ({ propTitle, roles, rolId }) => {
    if (propTitle || !roles || !rolId) {
        return propTitle;
    }

    const role = roles.find((item) => item.id === parseInt(rolId, 10));
    if (!role) {
        return propTitle;
    }

    const name = role.nombre.replace(/_/g, ' ').toUpperCase();
    if (name.endsWith('S')) {
        return name;
    }

    if (/[AEIOUÁÉÍÓÚ]$/.test(name)) {
        return `${name}S`;
    }

    return `${name}ES`;
};

const Index = ({ 
    rolId: propRolId, 
    title: propTitle, 
    subtitle, 
    addPath, 
    editPathBase = '/personal/editar' 
}) => {
    const { idRol: urlRolId } = useParams();
    const rolId = propRolId || urlRolId;
    const { roles } = useAuth(); 
    const [toggleData, setToggleData] = useState(null);
    const dynamicTitle = useMemo(
        () => resolveDynamicTitle({ propTitle, roles, rolId }),
        [propTitle, roles, rolId]
    );
    const fetchEmpleados = useCallback(
        (page, currentFilters) => getEmpleados(page, { ...currentFilters, rol_id: rolId }),
        [rolId]
    );
    const {
        loading,
        setLoading,
        alert,
        setAlert,
        rows: usuarios,
        paginationInfo,
        filters,
        fetchRows: fetchUsuarios,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear,
    } = usePaginatedIndex({
        initialFilters: INITIAL_FILTERS,
        fetcher: fetchEmpleados,
        onError: (error) => handleApiError(error, 'Error cargando la lista de personal.'),
    });
    const { modalProps, openInfoModal } = useInfoModal({ setAlert });

    const handleView = useCallback((id) => openInfoModal({
        fetcher: () => showEmpleado(id),
        mapData: (response) => {
            const {
                datos_empleado,
                empleado_datos_contacto,
                empleado_cuentas_bancarias,
                rol_nombre,
                username,
                sede
            } = response.data;

            const cuentas = Array.isArray(empleado_cuentas_bancarias)
                ? empleado_cuentas_bancarias
                : empleado_cuentas_bancarias?.entidad_financiera_id
                    ? [empleado_cuentas_bancarias]
                    : [];

            const resumenCuentas = cuentas.length > 0
                ? cuentas
                    .map((cuenta, index) => {
                        const banco = cuenta.entidad_financiera?.nombre || 'Banco';
                        const numero = cuenta.numero_cuenta || 'Sin numero';
                        const cci = cuenta.cci ? ` | CCI: ${cuenta.cci}` : '';
                        return `#${index + 1} ${banco} - ${numero}${cci}`;
                    })
                    .join(' | ')
                : 'N/A';

            const correos = Array.isArray(empleado_datos_contacto?.correos)
                ? empleado_datos_contacto.correos.filter(Boolean)
                : (empleado_datos_contacto?.correo ? [empleado_datos_contacto.correo] : []);

            return {
                title: 'Ficha de Usuario',
                subtitle: `${rol_nombre} - @${username}`,
                sections: [
                    { 
                        title: 'Datos Personales', 
                        icon: IdentificationIcon, 
                        items: [
                            { label: 'Nombre Completo', value: `${datos_empleado.nombre} ${datos_empleado.apellidoPaterno} ${datos_empleado.apellidoMaterno || ''}`, fullWidth: true },
                            { label: 'DNI', value: datos_empleado.dni },
                            { label: 'Sexo', value: datos_empleado.sexo },
                            { label: 'Estado Civil', value: datos_empleado.estadoCivil },
                        ]
                    },
                    { 
                        title: 'Contacto y Sede', 
                        icon: MapPinIcon, 
                        items: [
                            { label: 'Celular', value: empleado_datos_contacto?.telefono || 'N/A' },
                            { label: 'Emails Personales', value: correos.length ? correos.join(' | ') : 'N/A' },
                            { label: 'Sede', value: sede?.nombre || 'N/A' },
                            { label: 'Dirección', value: datos_empleado.direccion || 'N/A', fullWidth: true },
                            { label: 'Ubicación', value: `${datos_empleado.distrito || ''}, ${datos_empleado.provincia || ''} - ${datos_empleado.departamento || ''}`, fullWidth: true },
                        ]
                    },
                    { 
                        title: 'Datos Laborales', 
                        icon: BriefcaseIcon, 
                        items: [
                            { label: 'Fecha de Ingreso', value: datos_empleado.fechaIngreso },
                            { label: 'Área', value: datos_empleado.area?.nombre_area || 'N/A', fullWidth: true },
                        ]
                    },
                    { 
                        title: 'Datos Bancarios', 
                        icon: BanknotesIcon, 
                        items: [
                            { label: 'Total de Cuentas', value: cuentas.length || 0 },
                            { label: 'Detalle', value: resumenCuentas, fullWidth: true },
                        ]
                    }
                ]
            };
        },
        onError: (error) => handleApiError(error, 'No se pudo cargar la información del usuario.'),
    }), [openInfoModal]);

    const handleToggleExecute = useCallback(async () => {
        if (!toggleData) return;

        const targetId = toggleData.id;
        const targetEstado = toggleData.estado === 1 ? 0 : 1;
        setToggleData(null);
        setLoading(true);
        
        try {
            await toggleEmpleadoEstado(targetId, targetEstado);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            await fetchUsuarios(paginationInfo.currentPage).catch(() => {});
        } catch (error) { 
            setAlert(handleApiError(error, 'Error al cambiar estado.'));
            setLoading(false);
        }
    }, [fetchUsuarios, paginationInfo.currentPage, setAlert, setLoading, toggleData]);

    const columns = useMemo(() => [
        { 
            header: 'Usuario', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-lg border">
                        <UserIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-black text-slate-700 block uppercase text-xs">
                            {row.datos_empleado?.nombre || row.perfil?.nombre} {row.datos_empleado?.apellidoPaterno || row.perfil?.apellidoPaterno}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">@{row.username}</span>
                    </div>
                </div>
            )
        },
        { 
            header: 'Sede', 
            render: (row) => <span className="text-xs font-bold text-slate-500 uppercase">{row.sede?.nombre || 'N/A'}</span> 
        },
        { 
            header: 'Estado', 
            render: (row) => (
                <button 
                    onClick={() => setToggleData(row)} 
                    className={`px-3 py-1 text-[10px] font-black rounded border-b-2 transition-all active:translate-y-0.5 ${
                        row.estado === 1 
                        ? 'bg-green-600 border-green-800 text-white hover:bg-green-700' 
                        : 'bg-red-600 border-red-800 text-white hover:bg-red-700'
                    }`}
                >
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        { 
            header: 'Acciones', 
            render: (row) => (
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleView(row.id)} 
                        className="flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark text-[10px] uppercase transition-colors"
                    >
                        <EyeIcon className="w-4 h-4"/> Ver
                    </button>
                    <Link 
                        to={`${editPathBase}/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 text-[10px] uppercase transition-colors"
                    >
                        <PencilSquareIcon className="w-4 h-4"/> Editar
                    </Link>
                </div>
            )
        }
    ], [editPathBase, handleView]);

    if (loading && usuarios.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title={dynamicTitle || 'Personal'} 
                subtitle={subtitle} 
                icon={UsersIcon} 
                buttonText="+ Nuevo" 
                buttonLink={addPath || `/personal/agregar/${rolId}`} 
            />

            <AlertMessage 
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />

            <Table 
                columns={columns} 
                data={usuarios} 
                loading={loading} 
                filterConfig={FILTER_CONFIG}
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onFilterSubmit={handleFilterSubmit} 
                onFilterClear={handleFilterClear}
                pagination={{ 
                    currentPage: paginationInfo.currentPage, 
                    totalPages: paginationInfo.totalPages, 
                    onPageChange: (page) => fetchUsuarios(page).catch(() => {}),
                }}
            />

            <InfoModal {...modalProps} />

            {toggleData && (
                <ConfirmModal 
                    message={`¿Desea cambiar el estado de acceso de ${toggleData.username}?`} 
                    onConfirm={handleToggleExecute} 
                    onCancel={() => setToggleData(null)} 
                />
            )}
        </div>
    );
};

export default Index;