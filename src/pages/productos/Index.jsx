import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
// Asegúrate de que tu servicio acepte (page, filters)
import { getProductos, showProducto, updateProducto } from 'services/productoService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { 
    PencilSquareIcon, 
    CreditCardIcon, 
    EyeIcon, 
    ReceiptPercentIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
    buildProductoConfiguracionSummary,
    formatCuotasRange,
    formatMontoRange,
    formatTasaRange,
    getTipoEvaluacionLabel,
    buildProductoPayload,
    normalizeProducto,
    toBoolean,
} from 'utilities/productos';

const INITIAL_FILTERS = { search: '' };

const Index = () => {
    const [productoToToggle, setProductoToToggle] = useState(null);
    const {
        loading,
        setLoading,
        alert,
        setAlert,
        rows: productos,
        paginationInfo,
        filters,
        fetchRows: fetchProductos,
        handleFilterChange,
        handleFilterSubmit,
        handleFilterClear,
    } = usePaginatedIndex({
        initialFilters: INITIAL_FILTERS,
        fetcher: getProductos,
        mapRows: (response) => (response.data || []).map(normalizeProducto),
        onError: (error) => handleApiError(error, 'Error al cargar los productos.'),
    });
    const { modalProps, openInfoModal } = useInfoModal({ setAlert });

    const filterConfig = useMemo(() => [
        {
            name: 'search',
            type: 'text',
            label: 'Buscador',
            placeholder: 'Nombre comercial o resumen de tasa...',
            colSpan: 'md:col-span-5'
        }
    ], []);

    const handleViewProducto = useCallback((id) => openInfoModal({
        fetcher: () => showProducto(id),
        mapData: (response) => {
            const producto = normalizeProducto(response.data.data || response.data);
            const productoActivo = toBoolean(producto.activo, true);
            const summary = buildProductoConfiguracionSummary(producto);
            const configuraciones = (producto.configuraciones || []).filter((item) => item.legacy !== true);
            
            const seccionesFormateadas = [
                {
                    title: "Detalles del Producto",
                    icon: CreditCardIcon,
                    items: [
                        { label: "Nombre Comercial", value: producto.nombre, fullWidth: true },
                        { label: "Estado", value: productoActivo ? 'ACTIVO' : 'INACTIVO' },
                        { label: "Rango global", value: summary.overallRangeLabel },
                        { label: "Tipo de Evaluación", value: getTipoEvaluacionLabel(producto.tipo_evaluacion) },
                        { label: "Fecha de Creación", value: new Date(producto.created_at).toLocaleDateString() },
                    ]
                },
                {
                    title: "Configuraciones",
                    icon: ReceiptPercentIcon,
                    items: configuraciones.length > 0
                        ? configuraciones.map((configuracion, index) => ({
                            label: `Tramo ${index + 1}`,
                            value: `${configuracion.periodicidad_label} | ${formatMontoRange(configuracion)} | ${formatTasaRange(configuracion)} | ${formatCuotasRange(configuracion)}`,
                            fullWidth: true,
                        }))
                        : [{ label: 'Configuraciones', value: 'Sin configuraciones registradas.', fullWidth: true }],
                }
            ];

            return {
                title: "Ficha de Producto",
                subtitle: `ID: ${producto.id}`,
                sections: seccionesFormateadas
            };
        },
        onError: (error) => handleApiError(error, 'No se pudo cargar el detalle del producto.'),
    }), [openInfoModal]);

    const handleToggleEstado = useCallback(async () => {
        if (!productoToToggle) return;

        const nuevoEstado = !toBoolean(productoToToggle.activo, true);

        setProductoToToggle(null);
        setLoading(true);

        try {
            const response = await showProducto(productoToToggle.id);
            const producto = normalizeProducto(response.data?.data || response.data || response);
            const payload = buildProductoPayload({
                ...producto,
                activo: nuevoEstado,
            });

            await updateProducto(productoToToggle.id, payload);
            setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
            await fetchProductos(paginationInfo.currentPage).catch(() => {});
        } catch (error) {
            setAlert(handleApiError(error, 'Error al cambiar estado.'));
            setLoading(false);
        }
    }, [fetchProductos, paginationInfo.currentPage, productoToToggle, setAlert, setLoading]);

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
            header: 'Configuración',
            render: (row) => (
                (() => {
                    const summary = buildProductoConfiguracionSummary(row);
                    return (
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <ReceiptPercentIcon className="w-4 h-4 text-slate-400" />
                                <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    {summary.overallRangeLabel}
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                                {summary.totalConfiguraciones} tramos
                                {summary.totalPeriodicidades > 0 ? ` / ${summary.periodicidades.join(', ')}` : ''}
                            </p>
                        </div>
                    );
                })()
            )
        },
        {
            header: 'Tipo Evaluación',
            render: (row) => (
                <span className="font-semibold text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                    {getTipoEvaluacionLabel(row.tipo_evaluacion)}
                </span>
            )
        },
        {
            header: 'Estado',
            render: (row) => {
                const activo = toBoolean(row.activo, true);

                return (
                    <button
                        type="button"
                        onClick={() => setProductoToToggle(row)}
                        className={`px-3 py-1 text-[10px] font-black rounded border-b-2 transition-all active:translate-y-0.5 ${
                            activo
                                ? 'bg-green-600 border-green-800 text-white hover:bg-red-600 hover:border-red-800'
                                : 'bg-red-600 border-red-800 text-white hover:bg-green-600 hover:border-green-800'
                        }`}
                    >
                        {activo ? 'ACTIVO' : 'INACTIVO'}
                    </button>
                );
            }
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
    ], [handleViewProducto]);

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

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <InfoModal {...modalProps} />

            {productoToToggle && (
                <ConfirmModal
                    message={`¿Deseas cambiar el estado a ${toBoolean(productoToToggle.activo, true) ? 'INACTIVO' : 'ACTIVO'}?`}
                    onConfirm={handleToggleEstado}
                    onCancel={() => setProductoToToggle(null)}
                />
            )}

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
                        onPageChange: (page) => fetchProductos(page).catch(() => {})
                    }}
                />
            </div>
        </div>
    );
};

export default Index;
