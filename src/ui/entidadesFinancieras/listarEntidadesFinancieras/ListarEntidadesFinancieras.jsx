import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [entidadToToggle, setEntidadToToggle] = useState(null);

  // Modales
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

  // Filtros
  const [filters, setFilters] = useState({ 
    search: '', 
    tipo: '', 
    estado: '' 
  });

  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Configuración de los campos de filtrado
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

  // Función de carga de datos 
  const fetchEntidades = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const response = await getEntidadesFinancieras(page, currentFilters);
      
      setEntidades(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        totalPages: response.last_page,
        totalItems: response.total,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar entidades financieras.'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchEntidades(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejadores de Filtros
  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFilterSubmit = useCallback(() => {
    fetchEntidades(1);
  }, [fetchEntidades]);

  const handleFilterClear = useCallback(() => {
    const cleanFilters = { search: '', tipo: '', estado: '' };
    setFilters(cleanFilters);
    filtersRef.current = cleanFilters;
    fetchEntidades(1);
  }, [fetchEntidades]);


  // Ver Detalle (Modal)
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
              { label: 'Tipo', value: entidad.tipo, capitalize: true },
              { label: 'Longitudes', value: Array.isArray(entidad.longitudes_cuenta) ? entidad.longitudes_cuenta.join(', ') : '-', fullWidth: true },
              { label: 'Estado', value: entidad.estado ? 'ACTIVO' : 'INACTIVO' },
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

  // Cambiar Estado
  const handleToggleEstado = async () => {
    if (!entidadToToggle) return;
    const nuevoEstado = entidadToToggle.estado ? 0 : 1;
    setEntidadToToggle(null);
    setLoading(true);
    try {
      await toggleEntidadFinancieraEstado(entidadToToggle.id, nuevoEstado);
      setAlert({ type: 'success', message: 'Estado actualizado correctamente.' });
      // Recargamos la página actual
      await fetchEntidades(paginationInfo.currentPage);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cambiar estado.'));
      setLoading(false);
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
          data={entidades}
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
            onPageChange: (page) => fetchEntidades(page)
          }}
        />
      </div>
    </div>
  );
};

export default ListarEntidadesFinancieras;