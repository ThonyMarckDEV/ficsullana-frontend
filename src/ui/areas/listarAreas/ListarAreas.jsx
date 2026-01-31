import React, { useState, useEffect, useMemo } from 'react';
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
  const [filters, setFilters] = useState({ search: '' });

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);
  const [modalData, setModalData] = useState({ title: '', subtitle: '', sections: [] });

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const response = await getAreas();
      setAreas(response.data || []);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al cargar las áreas.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const filteredAreas = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    if (!term) return areas;
    return areas.filter(area => {
      const nombre = area.nombre_area?.toLowerCase() || '';
      const descripcion = area.descripcion?.toLowerCase() || '';
      return `${nombre} ${descripcion}`.includes(term);
    });
  }, [areas, filters.search]);

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
          data={filteredAreas}
          loading={loading}
          filterConfig={[
            { name: 'search', type: 'text', label: 'Buscador', placeholder: 'Nombre o descripción...', colSpan: 'md:col-span-12' }
          ]}
          filters={filters}
          onFilterChange={(name, value) => setFilters(prev => ({ ...prev, [name]: value }))}
          onFilterClear={() => setFilters({ search: '' })}
        />
      </div>
    </div>
  );
};

export default ListarAreas;