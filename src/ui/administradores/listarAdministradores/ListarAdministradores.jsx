import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAdministradores, toggleAdminEstado, showAdministrador } from 'services/administradorService';
import Table from 'components/Shared/Tables/Table';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, EyeIcon, UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const ListarAdministradores = () => {
    const [loading, setLoading] = useState(true);
    const [admins, setAdmins] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', sections: [] });
    const [toggleData, setToggleData] = useState(null);
    const [alert, setAlert] = useState(null);

    const fetchAdmins = useCallback(async (page = 1, searchTerm = '') => {
        setLoading(true);
        try {
            const res = await getAdministradores(page, searchTerm);
            setAdmins(res.data || []);
            setPagination({ page: res.current_page, totalPages: res.last_page });
        } catch (err) {
            console.error(err);
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAdmins(1, search); }, [fetchAdmins, search]);

    const handleView = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const res = await showAdministrador(id);
            const data = res.data;
            setModalData({
                title: 'Perfil de Administrador',
                subtitle: `@${data.username}`,
                sections: [
                    {
                        title: 'Datos Personales',
                        items: [
                            { label: 'Nombre', value: `${data.datos_empleado.nombre || ''} ${data.datos_empleado.apellidoPaterno || ''} ${data.datos_empleado.apellidoMaterno || ''}`, fullWidth: true },
                            { label: 'DNI', value: data.datos_empleado.dni },
                            { label: 'Sede', value: data.sede?.nombre || 'General' }
                        ]
                    }
                ]
            });
        } finally { setInfoLoading(false); }
    };

    const handleToggle = async () => {
        try {
            await toggleAdminEstado(toggleData.id);
            setToggleData(null);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchAdmins(pagination.page, search);
        } catch (e) { alert("Error al cambiar estado"); }
    };

    const columns = useMemo(() => [
        {
            header: 'Administrador',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <UserCircleIcon className="w-10 h-10 text-slate-400"/>
                    <div>
                        <span className="font-black text-slate-700 block uppercase">{row.datos_empleado.nombre || ''} {row.datos_empleado.apellidoPaterno || ''} {row.datos_empleado.apellidoMaterno || ''}</span>
                        <span className="text-[10px] text-indigo-600 font-bold">@{row.username}</span>
                    </div>
                </div>
            )
        },
        { header: 'Sede', render: (row) => row.sede?.nombre || 'N/A' },
        {
            header: 'Estado',
            render: (row) => (
                <button 
                    onClick={() => setToggleData({ id: row.id, estado: row.estado })}
                    className={`px-3 py-1 rounded font-black text-xs text-white ${row.estado === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex gap-3">
                    <button onClick={() => handleView(row.id)} className="text-slate-400 hover:text-fic-dark"><EyeIcon className="w-5 h-5"/></button>
                    <Link to={`/personal/editar-administrador/${row.id}`} className="text-fic-red"><PencilSquareIcon className="w-5 h-5"/></Link>
                </div>
            )
        }
    ], []);

    if (loading && admins.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader title="Administradores" icon={ShieldCheckIcon} buttonText="+ Nuevo Admin" buttonLink="/personal/agregar-administrador" />
            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
            <Table columns={columns} data={admins} pagination={{ currentPage: pagination.page, totalPages: pagination.totalPages, onPageChange: fetchAdmins }} onSearch={setSearch} />
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} title={modalData.title} subtitle={modalData.subtitle} sections={modalData.sections} loading={infoLoading} />
            {toggleData && <ConfirmModal message="¿Cambiar estado?" onConfirm={handleToggle} onCancel={() => setToggleData(null)} />}
        </div>
    );
};

export default ListarAdministradores;