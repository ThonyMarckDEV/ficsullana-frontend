import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAsesores, toggleAsesorEstado, showAsesor } from 'services/asesorService';
import Table from 'components/Shared/Tables/Table';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, EyeIcon, IdentificationIcon, PhoneIcon, UserCircleIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { UsersIcon } from 'lucide-react';


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

    useEffect(() => { fetchAsesores(1, search); }, [fetchAsesores, search]);

    const handleView = async (id) => {
        setInfoOpen(true);
        try {
            const { data } = await showAsesor(id);
            const datos = data.datos_empleado || {}; 
            setModalData({
                title: 'Ficha de Asesor',
                subtitle: `Usuario: @${data.username}`,
                sections: [
                    {
                        title: 'Datos Personales', icon: IdentificationIcon,
                        items: [
                            { label: 'Nombre Completo', value: `${datos.nombre} ${datos.apellidoPaterno} ${datos.apellidoMaterno}`, fullWidth: true },
                            { label: 'DNI', value: datos.dni },
                            { label: 'Fecha Nacimiento', value: datos.fechaNacimiento },
                            { label: 'Sexo', value: datos.sexo },
                        ]
                    },
                    {
                        title: 'Contacto', icon: PhoneIcon,
                        items: [ { label: 'Teléfono', value: datos.telefono }, { label: 'Dirección', value: datos.direccion, fullWidth: true } ]
                    },
                    {
                        title: 'Laboral', icon: BriefcaseIcon,
                        items: [ { label: 'Sede', value: data.sede?.nombre }, { label: 'Registro', value: new Date(data.created_at).toLocaleDateString() } ]
                    }
                ]
            });
        } catch(e) { setInfoOpen(false); setAlert({ type: 'error', message: 'Error al cargar detalles.' }); }
    };

    const handleToggle = async () => {
        if (!toggleData) return;
        try {
            await toggleAsesorEstado(toggleData.id, toggleData.estado === 1 ? 0 : 1);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchAsesores(pagination.page, search);
            setToggleData(null);
        } catch (e) { setAlert({ type: 'error', message: 'No se pudo cambiar el estado.' }); }
    };

    const columns = useMemo(() => [
        {
            header: 'Asesor',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><UserCircleIcon className="w-6 h-6"/></div>
                    <div>
                        <span className="font-black text-slate-700 block uppercase tracking-tight">{row.datos_empleado?.nombre} {row.datos_empleado?.apellidoPaterno}</span>
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Sede: {row.sede?.nombre || 'N/A'}</span>
                    </div>
                </div>
            )
        },
        { header: 'DNI', render: (row) => <span className="font-mono font-bold text-slate-600">{row.datos_empleado?.dni}</span> },
        { header: 'Usuario', render: (row) => <span className="text-sm font-bold text-slate-500">@{row.username}</span> },
        {
            header: 'Estado',
            render: (row) => (
                <button onClick={() => setToggleData({ id: row.id, estado: row.estado })} className={`px-4 py-1 font-black text-xs rounded-md shadow-sm border-b-2 ${row.estado === 1 ? 'text-white bg-green-600 border-green-800 hover:bg-red-600' : 'text-white bg-red-600 border-red-800 hover:bg-green-600'}`}>
                    {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
                </button>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-4">
                    <button onClick={() => handleView(row.id)} className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark text-xs uppercase"><EyeIcon className="w-5 h-5"/> Ver</button>
                    <Link to={`/personal/editar-asesor/${row.id}`} className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 text-xs uppercase"><PencilSquareIcon className="w-5 h-5"/> Editar</Link>
                </div>
            )
        }
    ], []);

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
                <Table columns={columns} data={asesores} loading={loading} pagination={{ currentPage: pagination.page, totalPages: pagination.totalPages, onPageChange: (p) => fetchAsesores(p, search) }} onSearch={setSearch} searchPlaceholder="Buscar Asesor..." />
            </div>
            <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} {...modalData} />
            {toggleData && <ConfirmModal message={`¿Desea cambiar el estado a ${toggleData.estado === 1 ? 'INACTIVO' : 'ACTIVO'}?`} onConfirm={handleToggle} onCancel={() => setToggleData(null)} />}
        </div>
    );
};
export default ListarAsesores;