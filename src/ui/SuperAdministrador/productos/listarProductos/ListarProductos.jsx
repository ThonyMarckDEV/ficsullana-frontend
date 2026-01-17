import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getProductos, showProducto } from 'services/productoService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import { 
    PencilSquareIcon, 
    CreditCardIcon, 
    EyeIcon, 
    ReceiptPercentIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';

const ListarProductos = () => {
    // --- ESTADOS ---
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [productos, setProductos] = useState([]);
    
    // Paginación y Búsqueda
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    // --- ESTADOS PARA MODAL DE INFORMACIÓN ---
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    // --- VER DETALLE ---
    const handleViewProducto = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showProducto(id);
            const producto = response.data;
            
            const seccionesFormateadas = [
                {
                    title: "Detalles del Producto",
                    icon: CreditCardIcon,
                    items: [
                        { label: "Nombre Comercial", value: producto.nombre, fullWidth: true },
                        { label: "Rango de Tasa", value: producto.rango_tasa },
                        { label: "Fecha de Creación", value: new Date(producto.created_at).toLocaleDateString() },
                    ]
                }
            ];

            setModalData({
                title: "Ficha de Producto",
                subtitle: `ID: ${producto.id}`,
                sections: seccionesFormateadas
            });

        } catch (err) {
            setAlert({ type: 'error', message: 'No se pudo cargar el detalle del producto.' });
            setIsInfoOpen(false);
        } finally {
            setInfoLoading(false);
        }
    };

    // --- COLUMNAS ---
    const columns = useMemo(() => [
        {
            header: 'Nombre',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                        <CreditCardIcon className="w-5 h-5"/>
                    </div>
                    <div>
                        <span className="font-black text-fic-dark block uppercase tracking-tight">{row.nombre}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Rango de Tasa',
            render: (row) => (
                <div className="flex items-center gap-2">
                    <ReceiptPercentIcon className="w-4 h-4 text-slate-400" />
                    <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {row.rango_tasa}
                    </span>
                </div>
            )
        },
        {
            header: 'Acciones',
            render: (row) => (
                <div className="flex items-center gap-4">
                      {/* BOTÓN VER */}
                      <button
                        onClick={() => handleViewProducto(row.id)}
                        className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
                        title="Ver Detalles"
                    >
                        <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
                            <EyeIcon className="w-5 h-5" />
                        </div>
                        Ver
                    </button>

                    {/* BOTÓN EDITAR */}
                    <Link 
                        to={`/superadmin/editar-producto/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    const fetchProductos = useCallback(async (page, search = '') => {
        setLoading(true);
        try {
            const response = await getProductos(page, search);
            setProductos(response.data || []);
            setPaginationInfo({
                currentPage: response.current_page,
                totalPages: response.last_page,
                totalItems: response.total,
            });
        } catch (err) {
            setAlert({ type: 'error', message: 'Error al cargar los productos.' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProductos(1, searchTerm); }, [fetchProductos, searchTerm]);

    if (loading && productos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">

            
            <PageHeader
                title="Gestión de Productos"
                subtitle="Gestión del catálogo de productos - Fic Sullana"
                icon={CubeIcon}
                buttonText="+ Nuevo Producto"
                buttonLink="/superadmin/agregar-producto"
            />

            <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

            <InfoModal 
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
                title={modalData.title}
                subtitle={modalData.subtitle}
                sections={modalData.sections}
                loading={infoLoading}
            />

            <div className="rounded-xl overflow-hidden">
                <Table 
                    columns={columns}
                    data={productos}
                    loading={loading}
                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchProductos(page, searchTerm)
                    }}
                    onSearch={setSearchTerm}
                    searchPlaceholder="Buscar producto..."
                />
            </div>
        </div>
    );
};

export default ListarProductos;