import { act, renderHook, waitFor } from '@testing-library/react';
import useEvaluacionConsumoBootstrap from 'pages/evaluacion/consumo/hooks/useEvaluacionConsumoBootstrap';
import {
  getAdmisionesElegiblesConsumo,
  getCatalogosEvaluacionConsumo,
  showEvaluacionConsumo,
} from 'services/evaluacionConsumoService';

jest.mock('services/evaluacionConsumoService', () => ({
  getAdmisionesElegiblesConsumo: jest.fn(),
  getCatalogosEvaluacionConsumo: jest.fn(),
  getAdmisionContextEvaluacionConsumo: jest.fn(),
  showEvaluacionConsumo: jest.fn(),
}));

jest.mock('utilities/pages/evaluacion/consumo/formState', () => ({
  createInitialEvaluacionCatalogos: jest.fn(() => ({
    monedas: [],
    categorias: [],
    tipos_ingreso: [],
    productos: [],
    niveles_discrecionalidad: [],
    max_veces_sueldo_consumo: 1,
  })),
  normalizeEvaluacionCatalogos: jest.fn((source = {}) => ({
    monedas: [],
    categorias: [],
    tipos_ingreso: [],
    productos: [],
    niveles_discrecionalidad: [],
    max_veces_sueldo_consumo: 1,
    ...source,
  })),
  applyEvaluacionConsumoDerivedFields: jest.fn((form, catalogos) => ({
    ...form,
    _catalogos: catalogos,
  })),
}));

jest.mock('utilities/pages/evaluacion/consumo/transformers', () => ({
  mapApiToForm: jest.fn((source = {}) => ({
    id: source.id ?? null,
    admision_id: source.admision_id ?? '',
    producto_id: source.producto_id ?? '',
  })),
}));

describe('useEvaluacionConsumoBootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getCatalogosEvaluacionConsumo.mockResolvedValue({
      data: {
        productos: [{ id: 7, nombre: 'Producto demo' }],
      },
    });
    getAdmisionesElegiblesConsumo.mockResolvedValue({
      data: [{ id: 11, solicitante_nombre: 'Cliente Demo' }],
    });
    showEvaluacionConsumo.mockResolvedValue({
      data: {
        id: 9,
        producto_id: 7,
        contexto: {
          is_prospecto: false,
          historial_interno: { visible: true, rows: [] },
          historial_externo: { deudas: [], protestos: [] },
          excepciones: [],
        },
      },
    });
  });

  it('loads only catalogs on store bootstrap and defers eligible admissions until requested', async () => {
    const setAlert = jest.fn();
    const setForm = jest.fn();

    const { result } = renderHook(() => useEvaluacionConsumoBootstrap({
      id: null,
      isEditMode: false,
      setAlert,
      setForm,
    }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(getCatalogosEvaluacionConsumo).toHaveBeenCalledTimes(1);
    expect(getAdmisionesElegiblesConsumo).not.toHaveBeenCalled();
    expect(showEvaluacionConsumo).not.toHaveBeenCalled();

    await act(async () => {
      await result.current.loadAdmisionesElegibles();
    });

    expect(getAdmisionesElegiblesConsumo).toHaveBeenCalledTimes(1);
    expect(result.current.admisiones).toEqual([{ id: 11, solicitante_nombre: 'Cliente Demo' }]);
    expect(result.current.admisionesLoading).toBe(false);

    await act(async () => {
      await result.current.loadAdmisionesElegibles();
    });

    expect(getAdmisionesElegiblesConsumo).toHaveBeenCalledTimes(1);
    expect(setAlert).not.toHaveBeenCalled();
  });

  it('loads catalogs and detail on edit bootstrap without requesting eligible admissions', async () => {
    const setAlert = jest.fn();
    const setForm = jest.fn();

    const { result } = renderHook(() => useEvaluacionConsumoBootstrap({
      id: 9,
      isEditMode: true,
      setAlert,
      setForm,
    }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(getCatalogosEvaluacionConsumo).toHaveBeenCalledTimes(1);
    expect(showEvaluacionConsumo).toHaveBeenCalledWith(9);
    expect(getAdmisionesElegiblesConsumo).not.toHaveBeenCalled();
    expect(setForm).toHaveBeenCalledTimes(1);
    expect(setAlert).not.toHaveBeenCalled();
  });
});
