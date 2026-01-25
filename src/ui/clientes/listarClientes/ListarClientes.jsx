// src/ui/Administrador/clientes/listarClientes/ListarClientes.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getClientes, toggleClienteEstado, showCliente } from 'services/clienteService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import { 
    PencilSquareIcon, 
    UsersIcon, 
    EyeIcon,
    IdentificationIcon,
    PhoneIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

const ListarCliente = () => {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [clientes, setClientes] = useState([]);
    
    // Paginación y Búsqueda
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // Toggle Estado
    const [clienteToToggle, setClienteToToggle] = useState(null);

    // --- ESTADOS PARA MODAL GENÉRICO ---
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    const handleViewCliente = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showCliente(id);
            const { datos_cliente, contactos } = response.data;
            const contacto = contactos?.[0] || {};

            const formatBool = (val) => val ? 'SÍ' : 'NO';

            const seccionesFormateadas = [
                {
                    title: "1. Datos Personales",
                    icon: IdentificationIcon,
                    items: [
                        { label: "Nombre Completo", value: `${datos_cliente.nombre} ${datos_cliente.apellidoPaterno} ${datos_cliente.apellidoMaterno || ''}`, fullWidth: true },
                        { label: "DNI", value: datos_cliente.dni },
                        { label: "Caducidad DNI", value: datos_cliente.fechaCaducidadDni },
                        { label: "RUC", value: datos_cliente.ruc },
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
                        { label: "Teléfono Móvil", value: contacto.telefonoMovil },
                        { label: "Teléfono Fijo", value: contacto.telefonoFijo },
                        { label: "Correo Electrónico", value: contacto.correo, fullWidth: true },
                    ]
                }
            ];


            setModalData({
                title: "Ficha de Cliente",
                subtitle: `Visualizando a: ${datos_cliente.nombre} ${datos_cliente.apellidoPaterno}`,
                sections: seccionesFormateadas
            });

        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar la información del cliente.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    // ---  COLUMNAS DE LA TABLA ---
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
                    {/* BOTÓN VER */}
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

                    {/* BOTÓN EDITAR */}
                    <Link 
                        to={`/editar-cliente/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchClientes = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const data = await getClientes(page, search);
            setClientes(data.data);
            setPaginationInfo({
                currentPage: data.current_page,
                totalPages: data.last_page,
                totalItems: data.total,
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudieron cargar los clientes.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClientes(1, searchTerm);
    }, [fetchClientes, searchTerm]);

    const executeToggleEstado = async () => {
        if (!clienteToToggle) return;
        const { id, estado } = clienteToToggle;
        const nuevoEstado = estado === 1 ? 0 : 1;
        
        setClienteToToggle(null);
        setLoading(true);

        try {
            const response = await toggleClienteEstado(id, nuevoEstado);
            setAlert(response);
            await fetchClientes(paginationInfo.currentPage, searchTerm); 
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cambiar el estado.' }); 
            setLoading(false);
        }
    };

    if (loading && clientes.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">

            <PageHeader 
                title="Gestión de Clientes"
                subtitle="Base de datos de socios - Fic Sullana"
                buttonText="+ Nuevo Cliente"
                buttonLink="/agregar-cliente"
                icon={UsersIcon}
            />

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            {/* MODAL DE INFORMACIÓN GENÉRICO */}
            <InfoModal 
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading}
            />

            {/* MODAL DE CONFIRMACIÓN */}
            {clienteToToggle && (
                <ConfirmModal
                    message={`¿Desea cambiar el estado de este cliente a ${clienteToToggle.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setClienteToToggle(null)}
                />
            )}

            {/* TABLA */}
            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns}
                    data={clientes}
                    loading={loading}
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchClientes(page, searchTerm)
                    }}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Buscar por DNI o Nombre..."
                />
            </div>
        </div>
    );
};

export default ListarCliente;