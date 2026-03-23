import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, PencilSquareIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import InfoModal from 'components/Shared/Modals/InfoModal';
import LoadingScreen from 'components/Shared/LoadingScreen';
import Table from 'components/Shared/Tables/Table';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { getActividadesNoSensibles, showActividadNoSensible } from 'services/actividadNoSensibleService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const INITIAL_FILTERS = { search: '' };

const Index = () => {
  const {
    loading,
    alert,
    setAlert,
    rows: actividades,
    paginationInfo,
    filters,
    fetchRows: fetchActividades,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
  } = usePaginatedIndex({
    initialFilters: INITIAL_FILTERS,
    fetcher: getActividadesNoSensibles,
    onError: (error) => handleApiError(error, 'Error al cargar las actividades no sensibles.'),
  });
  const { modalProps, openInfoModal } = useInfoModal({ setAlert });

  const handleView = useCallback((id) => openInfoModal({
    fetcher: () => showActividadNoSensible(id),
    mapData: (response) => {
      const actividadNoSensible = response.data || response;

      return {
        title: 'Detalle de Actividad No Sensible',
        subtitle: actividadNoSensible.actividad,
        sections: [
          {
            title: 'Información Principal',
            icon: RectangleStackIcon,
            items: [
              { label: 'Sector', value: actividadNoSensible.sector },
              { label: 'Actividad', value: actividadNoSensible.actividad, fullWidth: true },
              { label: 'Margen máximo', value: `${actividadNoSensible.margen_maximo}%` },
              {
                label: 'Fecha creación',
                value: actividadNoSensible.created_at ? new Date(actividadNoSensible.created_at).toLocaleDateString() : '-',
              },
            ],
          },
        ],
      };
    },
    onError: (error) => handleApiError(error, 'No se pudo cargar el detalle de la actividad no sensible.'),
  }), [openInfoModal]);

  const filterConfig = useMemo(() => [
    {
      name: 'search',
      type: 'text',
      label: 'Buscador',
      placeholder: 'Sector o actividad...',
      colSpan: 'md:col-span-12',
    },
  ], []);

  const columns = useMemo(() => [
    {
      header: 'Sector / Actividad',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
            <RectangleStackIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-slate-700 block uppercase">{row.actividad}</span>
            <span className="text-xs text-slate-500 uppercase">{row.sector}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Margen máximo',
      render: (row) => (
        <span className="font-bold text-slate-700">{row.margen_maximo}%</span>
      ),
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
              <EyeIcon className="w-5 h-5" />
            </div>
            Ver
          </button>
          <Link
            to={`/actividades-no-sensibles/editar/${row.id}`}
            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
          >
            <PencilSquareIcon className="w-5 h-5" /> Editar
          </Link>
        </div>
      ),
    },
  ], [handleView]);

  if (loading && actividades.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Gestión de Actividades No Sensibles"
        subtitle="Catálogo para otros ingresos"
        icon={RectangleStackIcon}
        buttonText="+ Nueva Actividad"
        buttonLink="/actividades-no-sensibles/agregar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <InfoModal {...modalProps} />

      <div className="rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={actividades}
          loading={loading}
          filterConfig={filterConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          onFilterSubmit={handleFilterSubmit}
          onFilterClear={handleFilterClear}
          pagination={{
            currentPage: paginationInfo.currentPage,
            totalPages: paginationInfo.totalPages,
            onPageChange: (page) => fetchActividades(page).catch(() => {}),
          }}
        />
      </div>
    </div>
  );
};

export default Index;