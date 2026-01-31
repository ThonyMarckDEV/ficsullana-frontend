import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que tu servicio acepte (page, filters)
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
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [productos, setProductos] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [infoLoading, setInfoLoading] = useState(false);
    const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

    const [filters, setFilters] = useState({
        search: ''
    });

    const filtersRef = useRef(filters);
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);


    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'Nombre comercial o Rango de tasa (ej. 10-12%)...',
            colSpan: 'md:col-span-5'
        }
    ], []);

    const fetchProductos = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const currentFilters = filtersRef.current;
            
            const response = await getProductos(page, currentFilters);
            
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

    useEffect(() => {
        fetchProductos(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFilterChange = useCallback((name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleFilterSubmit = useCallback(() => {
        fetchProductos(1);
    }, [fetchProductos]);

    const handleFilterClear = useCallback(() => {
        const cleanFilters = { search: '' };
        setFilters(cleanFilters);
        filtersRef.current = cleanFilters;
        fetchProductos(1);
    }, [fetchProductos]);

    const handleViewProducto = async (id) => {
        setIsInfoOpen(true);
        setInfoLoading(true);
        try {
            const response = await showProducto(id);
            const producto = response.data.data || response.data;
            
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
            setAlert(handleApiError(err, 'No se pudo cargar el detalle del producto.'));
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
                        to={`/productos/editar/${row.id}`} 
                        className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
                    >
                        <PencilSquareIcon className="w-5 h-5" /> Editar
                    </Link>
                </div>
            )
        }
    ], []);

    if (loading && productos.length === 0) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            
            <PageHeader
                title="Gestión de Productos"
                subtitle="Gestión del catálogo de productos financieros"
                icon={CubeIcon}
                buttonText="+ Nuevo Producto"
                buttonLink="/productos/agregar"
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
                    
                    // Configuración de Filtros
                    filterConfig={filterConfig}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onFilterSubmit={handleFilterSubmit}
                    onFilterClear={handleFilterClear}

                    pagination={{
                        currentPage: paginationInfo.currentPage,
                        totalPages: paginationInfo.totalPages,
                        onPageChange: (page) => fetchProductos(page)
                    }}
                />
            </div>
        </div>
    );
};

export default ListarProductos;