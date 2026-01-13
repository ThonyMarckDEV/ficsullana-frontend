import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getSedes, toggleSedeEstado } from 'services/sedeService'; 
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import { PencilSquareIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const ListarSedes = () => {
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [sedeToToggle, setSedeToToggle] = useState(null);
    const [sedes, setSedes] = useState([]);
    
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const columns = useMemo(() => [
        {
            header: 'Nombre',
            render: (row) => (
                <div className="flex items-center gap-3">
                    {/* Icono con fondo rojo suave de la marca */}
                    <div className="p-2 bg-red-50 text-fic-red rounded-lg border border-red-100">
                        <BuildingStorefrontIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-black text-fic-dark block uppercase tracking-tight">{row.nombre}</span>
                        {/* Badge Principal con Amarillo Fic */}
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
                    title={row.id === 1 ? "La sede principal no se puede desactivar" : "Cambiar estado"}
                >
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <Link 
                    to={`/admin/editar-sede/${row.id}`} 
                    className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                >
                    <PencilSquareIcon className="w-5 h-5" /> Editar
                </Link>
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

    useEffect(() => { 
        fetchSedes(1, searchTerm); 
    }, [fetchSedes, searchTerm]);

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
            <div className="flex justify-between items-end mb-8 border-b-4 border-fic-red pb-4">
                <div>
                    <h1 className="text-4xl font-black text-fic-dark tracking-tighter uppercase">Gestión de Sedes</h1>
                    <p className="text-slate-500 font-bold">Panel de control administrativo - Fic Sullana</p>
                </div>
                <Link 
                    to="/admin/agregar-sede" 
                    className="bg-fic-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-black shadow-lg uppercase tracking-widest active:scale-95"
                >
                    + Nueva Sede
                </Link>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            {sedeToToggle && (
                <ConfirmModal
                    message={`¿Deseas cambiar el estado a ${sedeToToggle.estado === 1 ? 'INACTIVO' : 'ACTIVO'}? Esto afectará las operaciones de este local.`}
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