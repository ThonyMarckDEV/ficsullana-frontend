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

    // --- 1. LÓGICA PARA VER DETALLE (MAPPING DE DATOS) ---
    const handleViewCliente = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showCliente(id);
            const { datos, contactos } = response.data;
            const contacto = contactos?.[0] || {};

            // Helper para formatear booleans
            const formatBool = (val) => val ? 'SÍ' : 'NO';

            // Construimos las secciones para el Modal Genérico
            const seccionesFormateadas = [
                {
                    title: "1. Datos Personales",
                    icon: IdentificationIcon,
                    items: [
                        { label: "Nombre Completo", value: `${datos.nombre} ${datos.apellidoPaterno} ${datos.apellidoMaterno || ''}`, fullWidth: true },
                        { label: "DNI", value: datos.dni },
                        { label: "Caducidad DNI", value: datos.fechaCaducidadDni },
                        { label: "RUC", value: datos.ruc },
                        { label: "Nacionalidad", value: datos.nacionalidad },
                        { label: "Sexo", value: datos.sexo },
                        { label: "Estado Civil", value: datos.estadoCivil },
                        { label: "Profesión", value: datos.profesion },
                        { label: "Nivel Educativo", value: datos.nivelEducativo, fullWidth: true },
                        
                        // Booleans convertidos a texto legible
                        { label: "¿Reside en Perú?", value: formatBool(datos.residePeru) },
                        { label: "¿Enf. Preexistentes?", value: formatBool(datos.enfermedadesPreexistentes) },
                        { label: "¿Exp. Políticamente?", value: formatBool(datos.expuestaPoliticamente) },
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

            // Actualizamos el estado del modal
            setModalData({
                title: "Ficha de Cliente",
                subtitle: `Visualizando a: ${datos.nombre} ${datos.apellidoPaterno}`,
                sections: seccionesFormateadas
            });

        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar la información del cliente.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    // --- 2. COLUMNAS DE LA TABLA ---
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
                            {row.datos ? `${row.datos.nombre} ${row.datos.apellidoPaterno} ${row.datos.apellidoMaterno || ''}` : 'Sin Nombre'}
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
            render: (row) => row.datos?.dni 
                ? <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{row.datos.dni}</span> 
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
                        to={`/admin/editar-cliente/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    // --- 3. CARGA DE DATOS ---
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

    // --- 4. TOGGLE ESTADO ---
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
            
            {/* HEADER */}
            <div className="flex justify-between items-end mb-8 border-b-4 border-fic-red pb-4">
                <div>
                    <h1 className="text-4xl font-black text-fic-dark tracking-tighter uppercase">Gestión de Clientes</h1>
                    <p className="text-slate-500 font-bold">Base de datos de socios - Fic Sullana</p>
                </div>
                <Link 
                    to="/admin/agregar-cliente" 
                    className="bg-fic-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-black shadow-lg uppercase tracking-widest active:scale-95"
                >
                    + Nuevo Cliente
                </Link>
            </div>

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