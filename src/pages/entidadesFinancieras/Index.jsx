import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BuildingLibraryIcon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { getEntidadesFinancieras, showEntidadFinanciera, toggleEntidadFinancieraEstado } from 'services/entidadFinancieraService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const INITIAL_FILTERS = {
  search: '',
  tipo: '',
  estado: '',
};

const Index = () => {
  const [entidadToToggle, setEntidadToToggle] = useState(null);
  const {
    loading,
    setLoading,
    alert,
    setAlert,
    rows: entidades,
    paginationInfo,
    filters,
    fetchRows: fetchEntidades,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
  } = usePaginatedIndex({
    initialFilters: INITIAL_FILTERS,
    fetcher: getEntidadesFinancieras,
    onError: (error) => handleApiError(error, 'Error al cargar entidades financieras.'),
  });
  const { modalProps, openInfoModal } = useInfoModal({ setAlert });

  const filterConfig = useMemo(() => [
    {
      name: 'search',
      type: 'text',
      label: 'Buscador',
      placeholder: 'Nombre de la entidad...',
      colSpan: 'md:col-span-6'
    },
    {
      name: 'tipo',
      type: 'select',
      label: 'Tipo',
      options: [
        { value: '', label: 'Todos' },
        { value: 'banco', label: 'Banco' },
        { value: 'caja', label: 'Caja' },
        { value: 'financiera', label: 'Financiera' }
      ],
      colSpan: 'md:col-span-3'
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      options: [
        { value: '', label: 'Todos' },
        { value: '1', label: 'Activos' },
        { value: '0', label: 'Inactivos' }
      ],
      colSpan: 'md:col-span-3'
    }
  ], []);

  const handleViewEntidad = useCallback((id) => openInfoModal({
    fetcher: () => showEntidadFinanciera(id),
    mapData: (response) => {
      const entidad = response.data || response;

      return {
        title: 'Detalle de Entidad',
        subtitle: entidad.nombre,
        sections: [
          {
            title: 'Información de la Entidad',
            icon: BuildingLibraryIcon,
            items: [
              { label: 'Nombre', value: entidad.nombre, fullWidth: true },
              { label: 'Tipo', value: entidad.tipo, capitalize: true },
              { label: 'Longitudes', value: Array.isArray(entidad.longitudes_cuenta) ? entidad.longitudes_cuenta.join(', ') : '-', fullWidth: true },
              { label: 'Estado', value: entidad.estado ? 'ACTIVO' : 'INACTIVO' },
            ]
          }
        ]
      };
    },
    onError: (error) => handleApiError(error, 'No se pudo cargar el detalle.'),
  }), [openInfoModal]);

  const handleToggleEstado = useCallback(async () => {
    if (!entidadToToggle) return;

    const nuevoEstado = entidadToToggle.estado ? 0 : 1;
    setEntidadToToggle(null);
    setLoading(true);

    try {
      await toggleEntidadFinancieraEstado(entidadToToggle.id, nuevoEstado);
      setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
      await fetchEntidades(paginationInfo.currentPage).catch(() => {});
    } catch (error) {
      setAlert(handleApiError(error, 'Error al cambiar estado.'));
      setLoading(false);
    }
  }, [entidadToToggle, fetchEntidades, paginationInfo.currentPage, setAlert, setLoading]);

  const columns = useMemo(() => [
    {
      header: 'Entidad',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
            <BuildingLibraryIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-slate-700 block uppercase">{row.nombre}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">{row.tipo}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Longitudes',
      render: (row) => (
        <span className="text-sm text-slate-500">
          {Array.isArray(row.longitudes_cuenta) ? row.longitudes_cuenta.join(', ') : '-'}
        </span>
      )
    },
    {
      header: 'Estado',
      render: (row) => (
        <button
          onClick={() => setEntidadToToggle({ id: row.id, estado: row.estado })}
          className={`px-3 py-1 text-[10px] font-black rounded border-b-2 transition-all active:translate-y-0.5 ${
            row.estado
              ? 'bg-green-600 border-green-800 text-white hover:bg-red-600 hover:border-red-800'
              : 'bg-red-600 border-red-800 text-white hover:bg-green-600 hover:border-green-800'
          }`}
        >
          {row.estado ? 'ACTIVO' : 'INACTIVO'}
        </button>
      )
    },
    {
      header: 'Acciones',
      render: (row) => (
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleViewEntidad(row.id)}
            className="group flex items-center gap-1 font-black text-slate-500 hover:text-fic-dark transition-colors uppercase text-xs tracking-tighter"
            title="Ver Detalles"
          >
            <div className="p-1 rounded-full group-hover:bg-slate-200 transition-colors">
              <EyeIcon className="w-5 h-5" />
            </div>
            Ver
          </button>
          <Link
            to={`/entidades-financieras/editar/${row.id}`}
            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
          >
            <PencilSquareIcon className="w-5 h-5" /> Editar
          </Link>
        </div>
      )
    }
  ], [handleViewEntidad]);

  if (loading && entidades.length === 0) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Entidades Financieras"
        subtitle="Catálogo de bancos y cajas"
        icon={BuildingLibraryIcon}
        buttonText="+ Nueva Entidad"
        buttonLink="/entidades-financieras/agregar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <InfoModal {...modalProps} />

      {entidadToToggle && (
        <ConfirmModal
          message={`¿Deseas cambiar el estado a ${entidadToToggle.estado ? 'INACTIVO' : 'ACTIVO'}?`}
          onConfirm={handleToggleEstado}
          onCancel={() => setEntidadToToggle(null)}
        />
      )}

      <div className="rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={entidades}
          loading={loading}
          filterConfig={filterConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          onFilterSubmit={handleFilterSubmit}
          onFilterClear={handleFilterClear}
          pagination={{
            currentPage: paginationInfo.currentPage,
            totalPages: paginationInfo.totalPages,
            onPageChange: (page) => fetchEntidades(page).catch(() => {})
          }}
        />
      </div>
    </div>
  );
};

export default Index;
