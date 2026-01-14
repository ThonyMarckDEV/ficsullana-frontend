// src/ui/Administrador/asesores/listarAsesores/ListarAsesores.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAsesores, toggleAsesorEstado, showAsesor } from 'services/asesorService';
import Table from 'components/Shared/Tables/Table';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { 
    PencilSquareIcon, EyeIcon, BriefcaseIcon, IdentificationIcon, PhoneIcon, UserCircleIcon 
} from '@heroicons/react/24/outline';

const ListarAsesores = () => {
    const [loading, setLoading] = useState(true);
    const [asesores, setAsesores] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [alert, setAlert] = useState(null);
    const [search, setSearch] = useState('');

    const [infoOpen, setInfoOpen] = useState(false);
    const [modalData, setModalData] = useState({ title: '', sections: [] });
    const [toggleData, setToggleData] = useState(null);

    const fetchAsesores = useCallback(async (page = 1, searchTerm = '') => {
        setLoading(true);
        try {
            const res = await getAsesores(page, searchTerm);
            setAsesores(res.data);
            setPagination({ page: res.current_page, totalPages: res.last_page });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error cargando asesores.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAsesores(1, search);
    }, [fetchAsesores, search]);

    const handleView = async (id) => {
        setInfoOpen(true);
        try {
            const { data } = await showAsesor(id);

            // 1. Datos personales
            const datos = data.datos || {};
            
            // 2. Contactos
            const contacto = (data.contactos && data.contactos.length > 0) 
                ? data.contactos[0] 
                : {}; 

            setModalData({
                title: 'Ficha de Asesor',
                subtitle: `Usuario: ${data.username}`,
                sections: [
                    {
                        title: 'Datos Personales',
                        icon: IdentificationIcon,
                        items: [
                            { label: 'Nombre Completo', value: `${datos.nombre} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`, fullWidth: true },
                            { label: 'DNI', value: datos.dni },
                            { label: 'Fecha Nacimiento', value: datos.fechaNacimiento },
                        ]
                    },
                    {
                        title: 'Cuenta & Sede',
                        icon: BriefcaseIcon,
                        items: [
                            { label: 'Usuario', value: data.username },
                            { label: 'Sede Asignada', value: data.sede?.nombre || 'Sin Sede' },
                            { label: 'Fecha Registro', value: data.created_at ? new Date(data.created_at).toLocaleDateString() : '---' },
                        ]
                    },
                    {
                        title: 'Contacto',
                        icon: PhoneIcon,
                        items: [
                             { label: 'Celular', value: contacto.telefonoMovil || '---' },
                             { label: 'Teléfono Fijo', value: contacto.telefonoFijo || '---' },
                             { label: 'Email', value: contacto.correo || '---', fullWidth: true },
                        ]
                    }
                ]
            });
        } catch(e) { 
            setInfoOpen(false);
            setAlert({ type: 'error', message: 'No se pudieron cargar los detalles.' });
        }
    };

    const handleToggle = async () => {
        if (!toggleData) return;
        try {
            await toggleAsesorEstado(toggleData.id, toggleData.estado === 1 ? 0 : 1);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchAsesores(pagination.page, search);
            setToggleData(null);
        } catch (e) {
            setAlert({ type: 'error', message: 'No se pudo cambiar el estado.' });
        }
    };

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
                            {row.datos?.nombre} {row.datos?.apellidoPaterno} {row.datos?.apellidoMaterno}
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
            render: (row) => row.datos?.dni 
                ? <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">{row.datos.dni}</span>
                : <span className="text-slate-300 italic">---</span>
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
                        onClick={() => handleView(row.id)} 
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                        title="Ver Detalles"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5"/>
                        </div>
                        Ver
                    </button>
                    <Link 
                        to={`/admin/editar-asesor/${row.id}`} 
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
            <div className="flex justify-between items-end mb-8 border-b-4 border-fic-red pb-4">
                <div>
                    <h1 className="text-4xl font-black text-fic-dark tracking-tighter uppercase">Gestión de Asesores</h1>
                    <p className="text-slate-500 font-bold">Personal Operativo y Accesos</p>
                </div>
                <Link to="/admin/agregar-asesor" className="bg-fic-red text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all font-black shadow-lg uppercase tracking-widest active:scale-95">
                    + Nuevo Asesor
                </Link>
            </div>
            
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
                    searchPlaceholder="Buscar por Nombre, DNI o Usuario..."
                />
            </div>

            <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} {...modalData} />
            
            {toggleData && (
                <ConfirmModal 
                    message={`¿Desea cambiar el estado de este asesor a ${toggleData.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={handleToggle}
                    onCancel={() => setToggleData(null)}
                />
            )}
        </div>
    );
};

export default ListarAsesores;