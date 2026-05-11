import { useCallback, useState } from 'react';
import { getEvaluacionesConsumo, showEvaluacionConsumo } from 'services/evaluacionConsumoService';
import usePaginatedIndex from 'hooks/usePaginatedIndex';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const INITIAL_FILTERS = { search: '', estado: '' };

const useEvaluacionConsumoList = () => {
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

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
    initialFilters: INITIAL_FILTERS,
    fetcher: getEvaluacionesConsumo,
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
  };
};

export default useEvaluacionConsumoList;
