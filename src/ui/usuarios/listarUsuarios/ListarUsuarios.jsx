import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUsuarios, toggleUsuarioEstado, showUsuario } from 'services/usuarioService';
import Table from 'components/Shared/Tables/Table';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import LoadingScreen from 'components/Shared/LoadingScreen';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, EyeIcon, UserIcon, IdentificationIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useAuth } from 'context/AuthContext'; 
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const ListarUsuarios = ({ 
    rolId: propRolId, 
    title: propTitle, 
    subtitle, 
    addPath, 
    editPathBase = '/personal/editar-usuario' 
}) => {
    const { idRol: urlRolId } = useParams();
    const rolId = propRolId || urlRolId;
    
    const { roles } = useAuth(); 
    
    const [dynamicTitle, setDynamicTitle] = useState(propTitle);
    const [loading, setLoading] = useState(true);
    const [usuarios, setUsuarios] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [alert, setAlert] = useState(null);
    const [info, setInfo] = useState({ open: false, loading: false, data: { title: '', sections: [] } });
    const [toggleData, setToggleData] = useState(null);
    const [filters, setFilters] = useState({ search: '', estado: '' });

    useEffect(() => {
        if (!propTitle && roles && rolId) {
            const r = roles.find(r => r.id === parseInt(rolId));
            if (r) {
                const name = r.nombre.replace(/_/g, ' ').toUpperCase();
                
                if (name.endsWith('S')) {
                    setDynamicTitle(name);
                } else if (/[AEIOUÁÉÍÓÚ]$/.test(name)) {
                    setDynamicTitle(name + 'S');
                } else {
                    setDynamicTitle(name + 'ES');
                }
            }
        } else {
            setDynamicTitle(propTitle);
        }
    }, [propTitle, roles, rolId]);

    const fetchUsuarios = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await getUsuarios(page, { ...filters, rol_id: rolId });
            setUsuarios(res.data || []);
            setPagination({ page: res.current_page, totalPages: res.last_page });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error cargando la lista de personal.' });
        } finally { setLoading(false); }
    }, [rolId, filters]);

    useEffect(() => { fetchUsuarios(1); }, [fetchUsuarios]);

    const handleView = async (id) => {
        setInfo(p => ({ ...p, open: true, loading: true }));
        try {
            const res = await showUsuario(id);
            const { perfil, rol_nombre, username, sede, email } = res.data;
            setInfo(p => ({ ...p, loading: false, data: {
                title: 'Ficha de Usuario',
                subtitle: `${rol_nombre} - @${username}`,
                sections: [
                    { title: 'Datos Personales', icon: IdentificationIcon, items: [
                        { label: 'Nombre Completo', value: `${perfil.nombre} ${perfil.apellidoPaterno} ${perfil.apellidoMaterno || ''}`, fullWidth: true },
                        { label: 'DNI', value: perfil.dni },
                        { label: 'Sexo', value: perfil.sexo },
                        { label: 'Estado Civil', value: perfil.estadoCivil },
                    ]},
                    { title: 'Contacto y Sede', icon: MapPinIcon, items: [
                        { label: 'Teléfono', value: perfil.telefono || perfil.telefonoMovil || 'N/A' },
                        { label: 'Email', value: email || 'N/A' },
                        { label: 'Sede', value: sede?.nombre || 'N/A' },
                        { label: 'Dirección', value: perfil.direccion || 'N/A', fullWidth: true },
                    ]}
                ]
            }}));
        } catch (e) { setInfo(p => ({ ...p, open: false })); }
    };

    const handleToggleExecute = async () => {
        try {
            await toggleUsuarioEstado(toggleData.id, toggleData.estado === 1 ? 0 : 1);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            fetchUsuarios(pagination.page);
        } catch (e) { 
            setAlert(handleApiError(e, 'Error al cambiar estado.')); 
        }
        setToggleData(null);
    };

    const columns = useMemo(() => [
        { header: 'Usuario', render: (row) => (
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-lg border"><UserIcon className="w-5 h-5"/></div>
                <div>
                    <span className="font-black text-slate-700 block uppercase text-xs">
                        {row.datos_empleado?.nombre || row.datos_cliente?.nombre} {row.datos_empleado?.apellidoPaterno || row.datos_cliente?.apellidoPaterno}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">@{row.username}</span>
                </div>
            </div>
        )},
        { header: 'Sede', render: (row) => <span className="text-xs font-bold text-slate-500 uppercase">{row.sede?.nombre || 'N/A'}</span> },
        { header: 'Estado', render: (row) => (
            <button onClick={() => setToggleData(row)} className={`px-3 py-1 text-[10px] font-black rounded border-b-2 transition-all active:translate-y-0.5 ${row.estado === 1 ? 'bg-green-600 border-green-800 text-white' : 'bg-red-600 border-red-800 text-white'}`}>
                {row.estado === 1 ? 'ACTIVO' : 'INACTIVO'}
            </button>
        )},
        { header: 'Acciones', render: (row) => (
            <div className="flex items-center gap-3">
                <button onClick={() => handleView(row.id)} className="flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark text-[10px] uppercase transition-colors"><EyeIcon className="w-4 h-4"/> Ver</button>
                <Link to={`${editPathBase}/${row.id}`} className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 text-[10px] uppercase transition-colors"><PencilSquareIcon className="w-4 h-4"/> Editar</Link>
            </div>
        )}
    ], [editPathBase]);

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
            <AlertMessage {...alert} onClose={() => setAlert(null)} />
            <Table 
                columns={columns} data={usuarios} loading={loading} 
                filterConfig={[{ name: 'search', type: 'text', label: 'Buscador', placeholder: 'DNI, Nombre...', colSpan: 'md:col-span-8' }, { name: 'estado', type: 'select', label: 'Estado', options: [{value:'', label:'Todos'}, {value:'1', label:'Activos'}, {value:'0', label:'Inactivos'}], colSpan: 'md:col-span-4' }]}
                filters={filters} onFilterChange={(n,v) => setFilters(p=>({...p,[n]:v}))} onFilterSubmit={()=>fetchUsuarios(1)} onFilterClear={()=>{setFilters({search:'',estado:''}); fetchUsuarios(1);}}
                pagination={{ currentPage: pagination.page, totalPages: pagination.totalPages, onPageChange: fetchUsuarios }}
            />
            <InfoModal isOpen={info.open} onClose={() => setInfo(p=>({...p, open:false}))} {...info.data} loading={info.loading} />
            {toggleData && <ConfirmModal message="¿Desea cambiar el estado de acceso de este usuario?" onConfirm={handleToggleExecute} onCancel={() => setToggleData(null)} />}
        </div>
    );
};

export default ListarUsuarios;