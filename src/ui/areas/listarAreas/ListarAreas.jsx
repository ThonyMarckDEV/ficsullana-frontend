import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAreas, showArea } from 'services/areaService';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import InfoModal from 'components/Shared/Modals/InfoModal';
import Table from 'components/Shared/Tables/Table';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { Squares2X2Icon, PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';

const ListarAreas = () => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [areas, setAreas] = useState([]);
  
  // Estado para paginación
  const [paginationInfo, setPaginationInfo] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Estado para filtros
  const [filters, setFilters] = useState({ search: '' });
  
  // Referencia para filtros
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Estados del Modal
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

  // Configuración de campos de filtro
  const filterConfig = useMemo(() => [
    { 
      name: 'search', 
      type: 'text', 
      label: 'Buscador', 
      placeholder: 'Nombre o descripción...', 
      colSpan: 'md:col-span-12' 
    }
  ], []);

  // Función de carga de datos (Server-Side)
  const fetchAreas = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const currentFilters = filtersRef.current;
      const response = await getAreas(page, currentFilters);
      
      setAreas(response.data || []);
      setPaginationInfo({
        currentPage: response.current_page,
        totalPages: response.last_page,
        totalItems: response.total,
      });
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar las áreas.'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchAreas(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejadores de filtros
  const handleFilterChange = useCallback((name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleFilterSubmit = useCallback(() => {
    fetchAreas(1);
  }, [fetchAreas]);

  const handleFilterClear = useCallback(() => {
    const cleanFilters = { search: '' };
    setFilters(cleanFilters);
    filtersRef.current = cleanFilters;
    fetchAreas(1);
  }, [fetchAreas]);

  // Ver Detalle
  const handleViewArea = async (id) => {
    setIsInfoOpen(true);
    setInfoLoading(true);
    setModalData({ title: 'Cargando...', sections: [] });

    try {
      const response = await showArea(id);
      const area = response.data || response;

      setModalData({
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
      });
    } catch (err) {
      setAlert(handleApiError(err, 'No se pudo cargar el detalle del área.'));
      setIsInfoOpen(false);
    } finally {
      setInfoLoading(false);
    }
  };

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
  ], []);

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
            onPageChange: (page) => fetchAreas(page)
          }}
        />
      </div>
    </div>
  );
};

export default ListarAreas;