import { act, renderHook } from '@testing-library/react';
import useEvaluacionConsumoList from 'pages/evaluacion/consumo/hooks/useEvaluacionConsumoList';
import {
  getEvaluacionesConsumo,
  showEvaluacionConsumo,
} from 'services/evaluacionConsumoService';
import usePaginatedIndex from 'hooks/usePaginatedIndex';

const mockFetchRows = jest.fn();
const mockSetAlert = jest.fn();

jest.mock('services/evaluacionConsumoService', () => ({
  enviarRevisionEvaluacionConsumo: jest.fn(),
  getEvaluacionesConsumo: jest.fn(),
  showEvaluacionConsumo: jest.fn(),
}));

jest.mock('hooks/usePaginatedIndex', () => jest.fn());

const mockUsePaginatedIndex = () => {
  usePaginatedIndex.mockImplementation((config) => ({
    loading: false,
    alert: null,
    setAlert: mockSetAlert,
    rows: [],
    paginationInfo: { currentPage: 1, totalPages: 1 },
    filters: config.initialFilters,
    setFilters: jest.fn(),
    fetchRows: mockFetchRows,
    handleFilterChange: jest.fn(),
    handleFilterSubmit: jest.fn(),
    handleFilterClear: jest.fn(),
  }));
};

describe('useEvaluacionConsumoList detail refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePaginatedIndex();
  });

  it('uses the advisor queue filters by default', async () => {
    renderHook(() => useEvaluacionConsumoList());

    const config = usePaginatedIndex.mock.calls[0][0];

    expect(config.initialFilters).toEqual({ search: '', estado: '' });

    await config.fetcher(1, { search: '12345678', estado: 'APROBADO' });

    expect(getEvaluacionesConsumo).toHaveBeenCalledWith(1, {
      search: '12345678',
      estado: 'APROBADO',
    });
  });

  it('allows reviewer queue to request review and resolved states', async () => {
    renderHook(() => useEvaluacionConsumoList({ canReviewQueue: true }));

    const config = usePaginatedIndex.mock.calls[0][0];

    expect(config.initialFilters).toEqual({ search: '', estado: '' });

    await config.fetcher(1, { search: 'MARIA', estado: 'APROBADO' });

    expect(getEvaluacionesConsumo).toHaveBeenCalledWith(1, {
      search: 'MARIA',
      estado: 'APROBADO',
    });

    await config.fetcher(1, { search: 'MARIA', estado: 'PENDIENTE' });

    expect(getEvaluacionesConsumo).toHaveBeenLastCalledWith(1, {
      search: 'MARIA',
      estado: '',
    });
  });

  it('rehydrates the open detail from show after a decision update', async () => {
    const refreshedDetail = {
      id: 8,
      estado: 'APROBADO',
      monto: '1800.00',
      propuesta: '15.25',
      tasa: '15.25',
      tasa_interes_solicitada: '15.25',
      cuota: '260.44',
    };
    showEvaluacionConsumo.mockResolvedValue({ data: refreshedDetail });

    const { result } = renderHook(() => useEvaluacionConsumoList());

    let response;
    await act(async () => {
      response = await result.current.refreshDetail(8, {
        id: 8,
        estado: 'APROBADO',
        cuota: '999.99',
      });
    });

    expect(showEvaluacionConsumo).toHaveBeenCalledWith(8);
    expect(response).toBe(refreshedDetail);
    expect(result.current.detailData).toBe(refreshedDetail);
  });
});
