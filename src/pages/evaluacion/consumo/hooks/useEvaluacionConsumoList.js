import { useCallback, useMemo, useState } from 'react';
import {
  enviarRevisionEvaluacionConsumo,
  getEvaluacionesConsumo,
  showEvaluacionConsumo,
} from 'services/evaluacionConsumoService';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import {
  getEvaluacionConsumoInitialFilters,
  normalizeEvaluacionConsumoListFilters,
} from 'utilities/pages/evaluacion/consumo/status';

const useEvaluacionConsumoList = ({ canReviewQueue = false } = {}) => {
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [sendLoadingId, setSendLoadingId] = useState(null);
  const initialFilters = useMemo(
    () => getEvaluacionConsumoInitialFilters({ canReviewQueue }),
    [canReviewQueue]
  );
  const fetchListRows = useCallback((page, filters) => getEvaluacionesConsumo(
    page,
    normalizeEvaluacionConsumoListFilters(filters, { canReviewQueue })
  ), [canReviewQueue]);

  const {
    loading,
    alert,
    setAlert,
    rows,
    paginationInfo: pagination,
    filters,
    setFilters,
    fetchRows,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
  } = usePaginatedIndex({
    initialFilters,
    fetcher: fetchListRows,
    onError: (error) => handleApiError(error, 'No se pudo cargar el listado de evaluaciones consumo.'),
  });

  const handleView = useCallback(async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const response = await showEvaluacionConsumo(id);
      setDetailData(response.data || response);
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo cargar el detalle.'));
      setDetailOpen(false);
    } finally {
      setDetailLoading(false);
    }
  }, [setAlert]);

  const refreshDetail = useCallback(async (id, fallbackData = null) => {
    const targetId = id || fallbackData?.id || detailData?.id;
    if (!targetId) return fallbackData;

    try {
      const response = await showEvaluacionConsumo(targetId);
      const source = response.data || response;
      setDetailData(source);
      return source;
    } catch (error) {
      if (fallbackData) {
        setDetailData(fallbackData);
      }
      setAlert(handleApiError(error, 'La resolución se registró, pero no se pudo refrescar el detalle.'));
      return fallbackData;
    }
  }, [detailData?.id, setAlert]);

  const handleSendToReview = useCallback(async (id) => {
    setSendLoadingId(id);
    setAlert(null);

    try {
      const response = await enviarRevisionEvaluacionConsumo(id);
      setAlert({
        type: 'success',
        message: response.message || 'Evaluación enviada a revisión correctamente.',
      });
      await fetchRows(pagination.currentPage);
      return response.data || response;
    } catch (error) {
      setAlert(handleApiError(error, 'No se pudo enviar la evaluación a revisión.'));
      return null;
    } finally {
      setSendLoadingId(null);
    }
  }, [fetchRows, pagination.currentPage, setAlert]);

  return {
    loading,
    alert,
    setAlert,
    rows,
    pagination,
    filters,
    setFilters,
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
  };
};

export default useEvaluacionConsumoList;
