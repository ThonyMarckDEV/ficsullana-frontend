// src/ui/Administrador/clientes/listarClientes/ListarClientes.jsx

import React, { useState, useEffect, useCallback } from 'react'; // 💡 Importar useCallback
// 💡 IMPORTAR la nueva función
import { getClientes, toggleClienteEstado } from 'services/clienteService'; 
import Pagination from 'components/Shared/Pagination';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { Link } from 'react-router-dom';

import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';

const ListarCliente = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [alert, setAlert] = useState(null);

    const [clienteToToggle, setClienteToToggle] = useState(null);

    const [clientes, setClientes] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0 
    });
    const [currentPage, setCurrentPage] = useState(1);

    const fetchClientes = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClientes(page);

            setClientes(data.data);
            setPaginationInfo({
                currentPage: data.current_page,
                totalPages: data.last_page,
                totalItems: data.total,
            });
        } catch (err) {
            setError('No se pudieron cargar los clientes. Por favor, intente de nuevo más tarde.');
            console.error(err);
        } finally {
            setLoading(false);
            if (isInitialLoad) setIsInitialLoad(false); 
        }
    }, [isInitialLoad]);


    useEffect(() => {
        fetchClientes(currentPage);
    }, [currentPage, fetchClientes]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleToggleEstado = (clienteId, currentEstado) => {
        // Almacenar el cliente y mostrar el modal
        setClienteToToggle({ id: clienteId, estado: currentEstado });
    };

    const executeToggleEstado = async () => {
        if (!clienteToToggle) return;

        const { id, estado } = clienteToToggle;
        const nuevoEstado = estado === 1 ? 0 : 1;
        
        // 1. Cerrar el modal
        setClienteToToggle(null);
        setLoading(true);

        try {
            const response = await toggleClienteEstado(id, nuevoEstado);
            setAlert(response);
            // 2. Volver a cargar los clientes después del cambio de estado
            await fetchClientes(currentPage); 
        } catch (err) {
            console.error("Error al cambiar estado:", err);
            // El backend devuelve el objeto de error, lo mostramos
            setAlert(err); 
            setLoading(false);
        }
    };

    if (isInitialLoad && loading) {
        return <LoadingScreen />;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Listado de Clientes</h1>

            <AlertMessage
                type={alert?.type}
                message={alert?.message}
                details={alert?.details}
                onClose={() => setAlert(null)}
            />

            {/* 💡 RENDERIZAR EL MODAL DE CONFIRMACIÓN */}
            {clienteToToggle && (
                <ConfirmModal
                    message={`¿Desea cambiar el estado de este cliente a ${clienteToToggle.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={executeToggleEstado}
                    onCancel={() => setClienteToToggle(null)}
                />
            )}
            
            <div className={`bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
                            <th className="px-5 py-3">DNI</th>
                            <th className="px-5 py-3">Nombre Completo</th>
                            <th className="px-5 py-3">Fecha de Registro</th>
                            <th className="px-5 py-3">Estado</th>
                            <th className="px-5 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length > 0 ? (
                            clientes.map((cliente) => (
                            <tr key={cliente.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-5 py-4 text-sm">{cliente.datos.dni}</td>
                                <td className="px-5 py-4 text-sm">
                                {`${cliente.datos.nombre} ${cliente.datos.apellidoPaterno} ${cliente.datos.apellidoMaterno}`}
                                </td>
                                <td className="px-5 py-4 text-sm">
                                {new Date(cliente.created_at).toLocaleDateString()}
                                </td>
                                
                                {/* 💡 CAMBIO: Reemplazamos el span por un botón */}
                                <td className="px-5 py-4 text-sm">
                                    <button 
                                        onClick={() => handleToggleEstado(cliente.id, cliente.estado)}
                                        disabled={loading}
                                        className={`px-3 py-1 font-semibold leading-tight rounded-full text-sm transition-colors duration-150 ${
                                            cliente.estado === 1
                                                ? 'text-green-700 bg-green-100 hover:bg-red-100 hover:text-red-700'
                                                : 'text-red-700 bg-red-100 hover:bg-green-100 hover:text-green-700'
                                        }`}
                                    >
                                        {cliente.estado === 1 ? 'Activo' : 'Inactivo'}
                                    </button>
                                </td>
                                
                                <td className="px-5 py-4 text-sm">
                                    <Link 
                                        to={`/admin/editar-cliente/${cliente.id}`} 
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        Editar
                                    </Link>
                                </td>
                            </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500">
                                    No se encontraron clientes.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ListarCliente;