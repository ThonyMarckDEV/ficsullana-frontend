import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_PAGINATION = { currentPage: 1, totalPages: 1, totalItems: 0 };

const defaultGetRows = (response) => response?.data || [];

const defaultGetPagination = (response) => ({
  currentPage: response?.current_page || 1,
  totalPages: response?.last_page || 1,
  totalItems: response?.total || 0,
});

const usePaginatedIndex = ({
  initialFilters,
  fetcher,
  mapRows = defaultGetRows,
  mapPagination = defaultGetPagination,
  autoFetch = true,
  onError,
}) => {
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [rows, setRows] = useState([]);
  const [paginationInfo, setPaginationInfo] = useState(DEFAULT_PAGINATION);
  const [filters, setFilters] = useState(initialFilters);
  const initialFiltersRef = useRef(initialFilters);
  const filtersRef = useRef(initialFilters);
  const fetcherRef = useRef(fetcher);
  const mapRowsRef = useRef(mapRows);
  const mapPaginationRef = useRef(mapPagination);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  useEffect(() => {
    mapRowsRef.current = mapRows;
  }, [mapRows]);

  useEffect(() => {
    mapPaginationRef.current = mapPagination;
  }, [mapPagination]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchRows = useCallback(async (page = 1, overrideFilters = null) => {
    setLoading(true);
    try {
      const currentFilters = overrideFilters ?? filtersRef.current;
      const response = await fetcherRef.current(page, currentFilters);
      setRows(mapRowsRef.current(response));
      setPaginationInfo(mapPaginationRef.current(response));
      return response;
    } catch (error) {
      if (onErrorRef.current) {
        setAlert(onErrorRef.current(error));
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) {
      return;
    }

    fetchRows(1).catch(() => {});
  }, [autoFetch, fetchRows]);

  const handleFilterChange = useCallback((name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleFilterSubmit = useCallback(() => fetchRows(1).catch(() => {}), [fetchRows]);

  const handleFilterClear = useCallback(() => {
    const cleanFilters = initialFiltersRef.current;
    setFilters(cleanFilters);
    return fetchRows(1, cleanFilters).catch(() => {});
  }, [fetchRows]);

  return {
    loading,
    setLoading,
    alert,
    setAlert,
    rows,
    setRows,
    paginationInfo,
    setPaginationInfo,
    filters,
    setFilters,
    fetchRows,
    handleFilterChange,
    handleFilterSubmit,
    handleFilterClear,
  };
};

export default usePaginatedIndex;
