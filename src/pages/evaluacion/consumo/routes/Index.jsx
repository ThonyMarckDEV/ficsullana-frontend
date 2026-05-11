import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from 'components/Shared/Headers/PageHeader';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import Table from 'components/Shared/Tables/Table';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { ClipboardDocumentCheckIcon, EyeIcon, PaperAirplaneIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { useAuth } from 'context/AuthContext';
import useEvaluacionConsumoList from '../hooks/useEvaluacionConsumoList';
import EvaluacionConsumoDetailModal from '../components/modals/EvaluacionConsumoDetailModal';
import {
  EVALUACION_CONSUMO_BADGE_STYLES,
  formatEvaluacionConsumoState,
  getEvaluacionConsumoStateFilterOptions,
  isEvaluacionConsumoEditable,
  isEvaluacionConsumoLocked,
  normalizeEvaluacionConsumoState,
} from 'utilities/pages/evaluacion/consumo/status';

const Index = () => {
  const { checkPermission } = useAuth();
  const [sendConfirmRow, setSendConfirmRow] = useState(null);
  const canEditRecords = checkPermission('evaluaciones_consumo.editar');
  const canApproveRecords = checkPermission('evaluaciones_consumo.aprobar');
  const canRejectRecords = checkPermission('evaluaciones_consumo.rechazar');
  const canSeeAllEvaluaciones = canApproveRecords || canRejectRecords;
  const stateFilterOptions = useMemo(
    () => getEvaluacionConsumoStateFilterOptions({ canReviewQueue: canSeeAllEvaluaciones }),
    [canSeeAllEvaluaciones]
  );
  const {
    loading,
    alert,
    setAlert,
    rows,
    pagination,
    filters,
    fetchRows,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
    detailLoading,
    detailOpen,
    setDetailOpen,
    detailData,
    setDetailData,
    handleView,
    refreshDetail,
    sendLoadingId,
    handleSendToReview,
  } = useEvaluacionConsumoList({ canReviewQueue: canSeeAllEvaluaciones });

  const columns = useMemo(() => [
    {
      header: 'Solicitante',
      render: (row) => (
        <div>
          <p className="font-black text-xs uppercase text-slate-700">{row.solicitante_nombre_snapshot}</p>
          <p className="text-[10px] text-slate-500">{row.solicitante_dni_snapshot}</p>
        </div>
      ),
    },
    {
      header: 'Agencia',
      render: (row) => <span className="text-xs font-semibold text-slate-700">{row?.sede?.nombre || 'N/A'}</span>,
    },
    {
      header: 'Monto',
      render: (row) => (
        <span className="text-xs font-black text-slate-700">
          {Number(row.monto || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      header: 'Estado',
      render: (row) => (
        <span className={`inline-flex px-2 py-1 text-[10px] font-black uppercase rounded-full border ${EVALUACION_CONSUMO_BADGE_STYLES[normalizeEvaluacionConsumoState(row.estado)] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
          {formatEvaluacionConsumoState(row.estado)}
        </span>
      ),
    },
    {
      header: 'Acciones',
      render: (row) => {
        const isLocked = isEvaluacionConsumoLocked(row.estado);
        const canOpenEditForm = canEditRecords
          && !canSeeAllEvaluaciones
          && !isLocked
          && isEvaluacionConsumoEditable(row.estado);
        const canSendToReview = canEditRecords && !canSeeAllEvaluaciones && isEvaluacionConsumoEditable(row.estado);
        const isSending = Number(sendLoadingId) === Number(row.id);

        return (
          <div className="flex items-center gap-3">
            {checkPermission('evaluaciones_consumo.mostrar') && (
              <button
                type="button"
                onClick={() => handleView(row.id)}
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-slate-600 hover:text-slate-900"
              >
                <EyeIcon className="w-4 h-4" /> Ver
              </button>
            )}
            {canOpenEditForm && (
              <Link
                to={`/evaluacion/consumo/editar/${row.id}`}
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-amber-600 hover:text-amber-700"
              >
                <PencilSquareIcon className="w-4 h-4" /> Editar
              </Link>
            )}
            {canSendToReview && (
              <button
                type="button"
                onClick={() => setSendConfirmRow(row)}
                disabled={isSending}
                className="inline-flex items-center gap-1 text-xs font-black uppercase text-fic-red hover:text-red-700 disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-4 h-4" /> {isSending ? 'Enviando...' : 'Enviar a revisión'}
              </button>
            )}
          </div>
        );
      },
    },
  ], [canEditRecords, canSeeAllEvaluaciones, checkPermission, handleView, sendLoadingId]);

  const filterConfig = useMemo(() => [
    {
      name: 'search',
      type: 'text',
      label: 'Buscador',
      placeholder: 'ID, DNI o Nombre...',
      colSpan: 'md:col-span-8',
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado',
      options: stateFilterOptions,
      colSpan: 'md:col-span-4',
    },
  ], [stateFilterOptions]);

  const handleDecisionSuccess = useCallback(async (nextData) => {
    if (!nextData?.id) return;

    setDetailData(nextData);
    await refreshDetail(nextData.id, nextData);
    fetchRows(pagination.currentPage).catch(() => {});
  }, [fetchRows, pagination.currentPage, refreshDetail, setDetailData]);

  if (loading && rows.length === 0) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title={canSeeAllEvaluaciones ? 'Evaluación Consumo' : 'Mis Evaluaciones'}
        subtitle={canSeeAllEvaluaciones
          ? 'Registro y gestión operativa'
          : 'Solo se muestran las evaluaciones registradas por su usuario'}
        icon={ClipboardDocumentCheckIcon}
        buttonText={checkPermission('evaluaciones_consumo.crear') ? '+ Nueva Evaluación' : undefined}
        buttonLink="/evaluacion/consumo/agregar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <EvaluacionConsumoDetailModal
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        loading={detailLoading}
        data={detailData}
        onDecisionSuccess={handleDecisionSuccess}
      />

      {sendConfirmRow ? (
        <ConfirmModal
          title="Enviar a revisión"
          message={`¿Deseas enviar la evaluación #${sendConfirmRow.id} a revisión?`}
          confirmText="Enviar"
          cancelText="Cancelar"
          onConfirm={async () => {
            const targetId = sendConfirmRow.id;
            setSendConfirmRow(null);
            await handleSendToReview(targetId);
          }}
          onCancel={() => setSendConfirmRow(null)}
        />
      ) : null}

      <Table
        columns={columns}
        data={rows}
        loading={loading}
        filterConfig={filterConfig}
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterSubmit={handleFilterSubmit}
        onFilterClear={handleFilterClear}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          onPageChange: (page) => fetchRows(page).catch(() => {}),
        }}
      />
    </div>
  );
};

export default Index;
