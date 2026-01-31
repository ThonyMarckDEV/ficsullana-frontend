import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEntidadesFinancieras, showEntidadFinanciera, toggleEntidadFinancieraEstado } from 'services/entidadFinancieraService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { BuildingLibraryIcon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';

const ListarEntidadesFinancieras = () => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [entidades, setEntidades] = useState([]);
  const [filters, setFilters] = useState({ search: '' });
  const [entidadToToggle, setEntidadToToggle] = useState(null);

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

  const fetchEntidades = async () => {
    setLoading(true);
    try {
      const response = await getEntidadesFinancieras();
      setEntidades(response.data || []);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar entidades financieras.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntidades();
  }, []);

  const filteredEntidades = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    if (!term) return entidades;
    return entidades.filter(entidad => {
      const nombre = entidad.nombre?.toLowerCase() || '';
      const tipo = entidad.tipo?.toLowerCase() || '';
      return `${nombre} ${tipo}`.includes(term);
    });
  }, [entidades, filters.search]);

  const handleViewEntidad = async (id) => {
    setIsInfoOpen(true);
    setInfoLoading(true);
    setModalData({ title: 'Cargando...', sections: [] });

    try {
      const response = await showEntidadFinanciera(id);
      const entidad = response.data || response;

      setModalData({
        title: 'Detalle de Entidad',
        subtitle: entidad.nombre,
        sections: [
          {
            title: 'Información de la Entidad',
            icon: BuildingLibraryIcon,
            items: [
              { label: 'Nombre', value: entidad.nombre, fullWidth: true },
              { label: 'Tipo', value: entidad.tipo },
              { label: 'Longitudes', value: Array.isArray(entidad.longitudes_cuenta) ? entidad.longitudes_cuenta.join(', ') : '-', fullWidth: true },
              { label: 'Estado', value: entidad.estado ? 'ACTIVO' : 'INACTIVO' },
              { label: 'Cuentas', value: entidad.cuentas_count ?? 0 },
            ]
          }
        ]
      });
    } catch (err) {
      setAlert(handleApiError(err, 'No se pudo cargar el detalle.'));
      setIsInfoOpen(false);
    } finally {
      setInfoLoading(false);
    }
  };

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
  ], []);

  const handleToggleEstado = async () => {
    if (!entidadToToggle) return;
    const nuevoEstado = entidadToToggle.estado ? 0 : 1;
    setEntidadToToggle(null);
    setLoading(true);
    try {
      await toggleEntidadFinancieraEstado(entidadToToggle.id, nuevoEstado);
      setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
      await fetchEntidades();
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cambiar estado.'));
      setLoading(false);
    }
  };


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

      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        title={modalData.title}
        subtitle={modalData.subtitle}
        sections={modalData.sections}
        loading={infoLoading}
      />

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
          data={filteredEntidades}
          loading={loading}
          filterConfig={[
            { name: 'search', type: 'text', label: 'Buscador', placeholder: 'Nombre o tipo...', colSpan: 'md:col-span-12' }
          ]}
          filters={filters}
          onFilterChange={(name, value) => setFilters(prev => ({ ...prev, [name]: value }))}
          onFilterClear={() => setFilters({ search: '' })}
        />
      </div>
    </div>
  );
};

export default ListarEntidadesFinancieras;