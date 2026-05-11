import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, PencilSquareIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import InfoModal from 'components/Shared/Modals/InfoModal';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import LoadingScreen from 'components/Shared/LoadingScreen';
import Table from 'components/Shared/Tables/Table';
import useInfoModal from 'hooks/useInfoModal';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import {
  getNivelesDiscrecionalidad,
  getRolesAutorizadoresCombobox,
  showNivelDiscrecionalidad,
  toggleEstadoNivelDiscrecionalidad,
} from 'services/nivelDiscrecionalidadService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
  formatNivelDiscrecionalidadEstado,
  formatNivelDiscrecionalidadRange,
  resolveTipoEvaluacionLabel,
  TIPO_EVALUACION_OPTIONS,
} from 'utilities/nivelesDiscrecionalidad';

const INITIAL_FILTERS = {
  search: '',
  tipo_evaluacion: '',
  rol_autorizador_id: '',
  estado: '',
};

const Index = () => {
  const [toggleData, setToggleData] = useState(null);
  const [rolesFilterOptions, setRolesFilterOptions] = useState([]);
  const {
    loading,
    setLoading,
    alert,
    setAlert,
    rows: niveles,
    paginationInfo,
    filters,
    fetchRows: fetchNiveles,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
  } = usePaginatedIndex({
    initialFilters: INITIAL_FILTERS,
    fetcher: getNivelesDiscrecionalidad,
    onError: (error) => handleApiError(error, 'Error al cargar los niveles de discrecionalidad.'),
  });
  const { modalProps, openInfoModal } = useInfoModal({ setAlert });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRolesAutorizadoresCombobox(1, '');
        setRolesFilterOptions(response.data || []);
      } catch (error) {
        setAlert(handleApiError(error, 'No se pudieron cargar los roles autorizadores.'));
      }
    };

    fetchRoles();
  }, [setAlert]);

  const handleView = useCallback((id) => openInfoModal({
    fetcher: () => showNivelDiscrecionalidad(id),
    mapData: (response) => {
      const nivel = response.data || response;
      const ranges = formatNivelDiscrecionalidadRange(nivel);

      return {
        title: 'Detalle de Nivel de Discrecionalidad',
        subtitle: nivel.rol_autorizador?.nombre || 'Sin rol',
        sections: [
          {
            title: 'Configuración',
            icon: ShieldCheckIcon,
            items: [
              { label: 'Tipo evaluación', value: nivel.tipo_evaluacion_label || resolveTipoEvaluacionLabel(nivel.tipo_evaluacion) },
              { label: 'Rol autorizador', value: nivel.rol_autorizador?.nombre || '-' },
              { label: 'Estado', value: formatNivelDiscrecionalidadEstado(nivel.estado) },
              { label: 'Monto', value: ranges.monto },
              { label: 'Cuotas', value: ranges.cuotas },
              { label: 'Tasa', value: ranges.tasa },
              {
                label: 'Fecha creación',
                value: nivel.created_at ? new Date(nivel.created_at).toLocaleDateString() : '-',
              },
            ],
          },
        ],
      };
    },
    onError: (error) => handleApiError(error, 'No se pudo cargar el detalle del nivel de discrecionalidad.'),
  }), [openInfoModal]);

  const handleToggleEstado = useCallback(async (row) => {
    setToggleData(row);
  }, []);

  const handleToggleExecute = useCallback(async () => {
    if (!toggleData) return;

    const nextState = !Boolean(toggleData.estado);
    setToggleData(null);
    setLoading(true);

    try {
      await toggleEstadoNivelDiscrecionalidad(toggleData.id, nextState);
      await fetchNiveles(paginationInfo.currentPage).catch(() => {});
      setAlert({
        type: 'success',
        message: nextState
          ? 'Nivel de discrecionalidad activado correctamente.'
          : 'Nivel de discrecionalidad inactivado correctamente.',
      });
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo cambiar el estado del nivel de discrecionalidad.'));
      setLoading(false);
    }
  }, [fetchNiveles, paginationInfo.currentPage, setAlert, setLoading, toggleData]);

  const filterConfig = useMemo(() => [
    {
      name: 'search',
      type: 'text',
      label: 'Buscador',
      placeholder: 'Rol autorizador o tipo de evaluación...',
      colSpan: 'md:col-span-4',
    },
    {
      name: 'tipo_evaluacion',
      type: 'select',
      label: 'Tipo de evaluación',
      options: [
        { value: '', label: 'Todos' },
        ...TIPO_EVALUACION_OPTIONS,
      ],
      colSpan: 'md:col-span-3',
    },
    {
      name: 'rol_autorizador_id',
      type: 'select',
      label: 'Rol autorizador',
      options: [
        { value: '', label: 'Todos' },
        ...rolesFilterOptions.map((rol) => ({ value: String(rol.id), label: rol.nombre })),
      ],
      colSpan: 'md:col-span-3',
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      options: [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
      ],
      colSpan: 'md:col-span-2',
    },
  ], [rolesFilterOptions]);

  const columns = useMemo(() => [
    {
      header: 'Rol / Tipo',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 text-fic-red rounded-lg border border-red-100">
            <ShieldCheckIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-slate-700 block uppercase">{row.rol_autorizador?.nombre || '-'}</span>
            <span className="text-xs text-slate-500">{row.tipo_evaluacion_label || resolveTipoEvaluacionLabel(row.tipo_evaluacion)}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rangos',
      render: (row) => {
        const ranges = formatNivelDiscrecionalidadRange(row);

        return (
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-700">Monto: <span className="font-medium">{ranges.monto}</span></div>
            <div className="text-xs font-bold text-slate-700">Cuotas: <span className="font-medium">{ranges.cuotas}</span></div>
            <div className="text-xs font-bold text-slate-700">Tasa: <span className="font-medium">{ranges.tasa}</span></div>
          </div>
        );
      },
    },
    {
      header: 'Estado',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleEstado(row)}
          className={`px-3 py-1 text-[10px] font-black rounded border-b-2 transition-all active:translate-y-0.5 ${
            row.estado
              ? 'bg-green-600 border-green-800 text-white hover:bg-green-700'
              : 'bg-red-600 border-red-800 text-white hover:bg-red-700'
          }`}
        >
          {formatNivelDiscrecionalidadEstado(row.estado)}
        </button>
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
            to={`/niveles-discrecionalidad/editar/${row.id}`}
            className="flex items-center gap-1 font-black text-fic-red hover:text-red-800 transition-colors uppercase text-xs tracking-tighter"
          >
            <PencilSquareIcon className="w-5 h-5" /> Editar
          </Link>
        </div>
      ),
    },
  ], [handleToggleEstado, handleView]);

  if (loading && niveles.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Gestión de Niveles de Discrecionalidad"
        subtitle="Reglas de autorización por evaluación"
        icon={ShieldCheckIcon}
        buttonText="+ Nuevo Nivel"
        buttonLink="/niveles-discrecionalidad/agregar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <InfoModal {...modalProps} />

      {toggleData ? (
        <ConfirmModal
          title="Cambiar estado"
          message={`¿Desea cambiar el estado del nivel de discrecionalidad para ${toggleData.rol_autorizador?.nombre || 'este registro'}?`}
          onConfirm={handleToggleExecute}
          onCancel={() => setToggleData(null)}
        />
      ) : null}

      <div className="rounded-xl overflow-hidden">
        <Table
          columns={columns}
          data={niveles}
          loading={loading}
          filterConfig={filterConfig}
          filters={filters}
          onFilterChange={handleFilterChange}
          onFilterSubmit={handleFilterSubmit}
          onFilterClear={handleFilterClear}
          pagination={{
            currentPage: paginationInfo.currentPage,
            totalPages: paginationInfo.totalPages,
            onPageChange: (page) => fetchNiveles(page).catch(() => {}),
          }}
        />
      </div>
    </div>
  );
};

export default Index;