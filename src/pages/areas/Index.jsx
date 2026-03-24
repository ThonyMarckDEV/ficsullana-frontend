import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAreas, showArea } from 'services/areaService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { Squares2X2Icon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';

const INITIAL_FILTERS = { search: '' };

const Index = () => {
  const {
    loading,
    alert,
    setAlert,
    rows: areas,
    paginationInfo,
    filters,
    fetchRows: fetchAreas,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
  } = usePaginatedIndex({
    initialFilters: INITIAL_FILTERS,
    fetcher: getAreas,
    onError: (error) => handleApiError(error, 'Error al cargar las áreas.'),
  });
  const { modalProps, openInfoModal } = useInfoModal({ setAlert });

  const filterConfig = useMemo(() => [
    { 
      name: 'search', 
      type: 'text', 
      label: 'Buscador', 
      placeholder: 'Nombre o descripción...', 
      colSpan: 'md:col-span-12' 
    }
  ], []);

  // Ver Detalle
  const handleViewArea = useCallback((id) => openInfoModal({
    fetcher: () => showArea(id),
    mapData: (response) => {
      const area = response.data || response;

      return {
        title: 'Detalle del Área',
        subtitle: area.nombre_area,
        sections: [
          {
            title: 'Información del Área',
            icon: Squares2X2Icon,
            items: [
              { label: 'Nombre', value: area.nombre_area, fullWidth: true },
              { label: 'Descripción', value: area.descripcion || '-', fullWidth: true },
              { label: 'Empleados', value: area.empleados_count ?? 0 },
              { label: 'Fecha Creación', value: area.created_at ? new Date(area.created_at).toLocaleDateString() : '-' }
            ]
          }
        ]
      };
    },
    onError: (error) => handleApiError(error, 'No se pudo cargar el detalle del área.'),
  }), [openInfoModal]);

  const columns = useMemo(() => [
    {
      header: 'Área',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
            <Squares2X2Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-slate-700 block uppercase">{row.nombre_area}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Descripción',
      render: (row) => (
        <span className="text-sm text-slate-500 truncate max-w-xs block" title={row.descripcion}>
          {row.descripcion || '-'}
        </span>
      )
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleViewArea(row.id)}
            className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
            title="Ver Detalles"
          >
            <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
              <EyeIcon className="w-5 h-5" />
            </div>
            Ver
          </button>
          <Link
            to={`/areas/editar/${row.id}`}
            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
          >
            <PencilSquareIcon className="w-5 h-5" /> Editar
          </Link>
        </div>
      )
    }
  ], [handleViewArea]);

  if (loading && areas.length === 0) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Gestión de Áreas"
        subtitle="Catálogo de áreas internas"
        icon={Squares2X2Icon}
        buttonText="+ Nueva Área"
        buttonLink="/areas/agregar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details}  onClose={() => setAlert(null)} />

      <InfoModal {...modalProps} />

      <div className="rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={areas}
          loading={loading}
          
          // Configuración de Filtros
          filterConfig={filterConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          onFilterSubmit={handleFilterSubmit}
          onFilterClear={handleFilterClear}

          // Configuración de Paginación
          pagination={{
            currentPage: paginationInfo.currentPage,
            totalPages: paginationInfo.totalPages,
            onPageChange: (page) => fetchAreas(page).catch(() => {})
          }}
        />
      </div>
    </div>
  );
};

export default Index;