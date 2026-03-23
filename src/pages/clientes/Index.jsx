import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClientes, toggleClienteEstado, showCliente } from 'services/clienteService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { 
    PencilSquareIcon, 
    UsersIcon, 
    EyeIcon,
    IdentificationIcon,
    PhoneIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const INITIAL_FILTERS = {
    search: '',
    estado: ''
};

const Index = () => {
    const [clienteToToggle, setClienteToToggle] = useState(null);

    const {
        loading,
        setLoading,
        alert,
        setAlert,
        rows: clientes,
        paginationInfo,
        filters,
        fetchRows: fetchClientes,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear,
    } = usePaginatedIndex({
        initialFilters: INITIAL_FILTERS,
        fetcher: getClientes,
        onError: (error) => handleApiError(error, 'Error al cargar los clientes.'),
    });
    const { modalProps, openInfoModal } = useInfoModal({ setAlert });

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'Nombre, Apellido o DNI...',
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

    // --- LÓGICA DEL MODAL ADAPTADA AL JSON ---
    const handleViewCliente = useCallback((id) => openInfoModal({
        fetcher: () => showCliente(id),
        mapData: (response) => {
            const { datos_cliente, cliente_datos_contacto, cliente_cuentas_bancarias } = response.data;

            const formatBool = (val) => (val === 1 || val === true) ? 'SÍ' : 'NO';
            const valOrHyphen = (val) => val || '-';

            const secciones = [
                {
                    title: "1. Datos Personales",
                    icon: IdentificationIcon,
                    items: [
                        { label: "Nombre Completo", value: `${datos_cliente.nombre} ${datos_cliente.apellidoPaterno} ${datos_cliente.apellidoMaterno || ''}`, fullWidth: true },
                        { label: "DNI", value: datos_cliente.dni },
                        { label: "Caducidad DNI", value: datos_cliente.fechaCaducidadDni },
                        { label: "RUC", value: valOrHyphen(datos_cliente.ruc) },
                        { label: "Nacionalidad", value: datos_cliente.nacionalidad },
                        { label: "Sexo", value: datos_cliente.sexo },
                        { label: "Estado Civil", value: datos_cliente.estadoCivil },
                        { label: "Profesión", value: datos_cliente.profesion },
                        { label: "Nivel Educativo", value: datos_cliente.nivelEducativo, fullWidth: true },
                        { label: "¿Reside en Perú?", value: formatBool(datos_cliente.residePeru) },
                        { label: "¿Enf. Preexistentes?", value: formatBool(datos_cliente.enfermedadesPreexistentes) },
                        { label: "¿Exp. Políticamente?", value: formatBool(datos_cliente.expuestaPoliticamente) },
                    ]
                },
                {
                    title: "2. Datos de Contacto",
                    icon: PhoneIcon,
                    items: [
                        { label: "Teléfono Móvil", value: valOrHyphen(cliente_datos_contacto?.telefono) },
                        { label: "Teléfono Fijo", value: valOrHyphen(cliente_datos_contacto?.telefonoFijo) },
                        { label: "Correo Electrónico", value: valOrHyphen(cliente_datos_contacto?.correo), fullWidth: true },
                    ]
                }
            ];

            if (cliente_cuentas_bancarias && cliente_cuentas_bancarias.numero_cuenta) {
                secciones.push({
                    title: "3. Datos Bancarios",
                    icon: CreditCardIcon,
                    items: [
                        { label: "Banco", value: cliente_cuentas_bancarias.entidad_financiera?.nombre || 'Desconocido' },
                        { label: "N° Cuenta", value: cliente_cuentas_bancarias.numero_cuenta },
                        { label: "CCI", value: cliente_cuentas_bancarias.cci, fullWidth: true },
                    ]
                });
            } else {
                secciones.push({
                    title: "3. Datos Bancarios",
                    icon: CreditCardIcon,
                    items: [
                        { label: "Estado", value: "No tiene cuentas registradas", fullWidth: true },
                    ]
                });
            }

            return {
                title: "Ficha de Cliente",
                subtitle: `Visualizando a: ${datos_cliente.nombre} ${datos_cliente.apellidoPaterno}`,
                sections: secciones
            };
        },
        onError: (error) => handleApiError(error, 'No se pudo cargar la información del usuario.'),
    }), [openInfoModal]);

    const executeToggleEstado = async () => {
        if (!clienteToToggle) return;
        const { id, estado } = clienteToToggle;
        const nuevoEstado = estado === 1 ? 0 : 1;
        
        setClienteToToggle(null);
        setLoading(true);

        try {
            const response = await toggleClienteEstado(id, nuevoEstado);
            setAlert(response);
            await fetchClientes(paginationInfo.currentPage).catch(() => {}); 
        } catch (err) {
            setAlert(handleApiError(err, 'Error al cambiar estado.')); 
            setLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            header: 'Cliente',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-fic-red rounded-lg border border-red-100">
                        <UsersIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-black text-fic-dark block uppercase tracking-tight">
                            {row.datos_cliente ? `${row.datos_cliente.nombre} ${row.datos_cliente.apellidoPaterno} ${row.datos_cliente.apellidoMaterno || ''}` : 'Sin Nombre'}
                        </span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                            Registrado: {new Date(row.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: 'DNI',
            render: (row) => row.datos_cliente?.dni 
                ? <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{row.datos_cliente.dni}</span> 
                : <span className="text-slate-300 italic">N/A</span>
        },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setClienteToToggle({ id: row.id, estado: row.estado })}
                    className={`px-4 py-1 font-black text-xs rounded-md shadow-sm transition-all duration-150 border-b-2 ${
                        row.estado === 1
                            ? 'text-white bg-green-600 border-green-800 hover:bg-red-600 hover:border-red-800'
                            : 'text-white bg-red-600 border-red-800 hover:bg-green-600 hover:border-green-800'
                    } active:translate-y-0.5`}
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
                        onClick={() => handleViewCliente(row.id)}
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                        title="Ver Ficha Completa"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                        </div>
                        Ver
                    </button>

                    <Link 
                        to={`/clientes/editar/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], [handleViewCliente]);

    if (loading && clientes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">

            <PageHeader 
                title="Gestión de Clientes"
                subtitle="Base de datos de socios - Fic Sullana"
                buttonText="+ Nuevo Cliente"
                buttonLink="/clientes/agregar"
                icon={UsersIcon}
            />

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            <InfoModal {...modalProps} />

            {clienteToToggle && (
                <ConfirmModal
                    message={`¿Desea cambiar el estado de este cliente a ${clienteToToggle.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setClienteToToggle(null)}
                />
            )}

            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns}
                    data={clientes}
                    loading={loading}
                    
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterClear={handleFilterClear}

                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchClientes(page).catch(() => {})
                    }}
                />
            </div>
        </div>
    );
};

export default Index;