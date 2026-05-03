import { act, renderHook } from '@testing-library/react';
import { createAvalState, createGarantiaRow } from 'utilities/pages/evaluacion/consumo/transformers';
import useEvaluacionConsumoActions, { applyGarantiaDireccionToggle } from 'pages/evaluacion/consumo/hooks/useEvaluacionConsumoActions';

describe('applyGarantiaDireccionToggle', () => {
  it('fills applicant address when a simple guarantee uses applicant address', () => {
    const result = applyGarantiaDireccionToggle({
      direccion_snapshot: 'JR LIMA 123',
      avales: [],
    }, {
      clase_garantia: 'SIMPLE',
      direccion: '',
      usar_direccion_solicitante: false,
    }, true);

    expect(result.usar_direccion_solicitante).toBe(true);
    expect(result.direccion).toBe('JR LIMA 123');
  });

  it('fills linked aval address when an aval guarantee uses linked aval address', () => {
    const result = applyGarantiaDireccionToggle({
      direccion_snapshot: 'JR LIMA 123',
      avales: [
        {
          tipoVia: 'CALLE',
          nombreVia: 'MERCURIO',
          numeroMzLt: '45',
          urbanizacion: 'CENTRO',
          distrito: 'SULLANA',
          provincia: 'SULLANA',
          departamento: 'PIURA',
        },
      ],
    }, {
      clase_garantia: 'AVAL',
      aval_slot: '1',
      direccion: '',
      usar_direccion_solicitante: false,
    }, true);

    expect(result.usar_direccion_solicitante).toBe(true);
    expect(result.direccion).toBe('CALLE MERCURIO, 45, CENTRO, SULLANA, SULLANA, PIURA');
  });
});

describe('useEvaluacionConsumoActions', () => {
  it('adds a new guarantee to the requested active aval slot', () => {
    let formState = {
      garantias: [
        createGarantiaRow({
          clase_garantia: 'AVAL',
          aval_slot: '1',
          descripcion: 'Garantia aval uno',
        }),
        createGarantiaRow({
          clase_garantia: 'AVAL',
          aval_slot: '2',
          descripcion: 'Garantia aval dos',
        }),
      ],
      avales: [
        createAvalState({ manual_mode: true, numero_documento: '12345678' }),
        createAvalState({ manual_mode: true, numero_documento: '87654321' }),
      ],
    };

    const setForm = jest.fn((updater) => {
      formState = typeof updater === 'function' ? updater(formState) : updater;
    });

    const { result } = renderHook(() => useEvaluacionConsumoActions({
      id: null,
      isEditMode: false,
      navigate: jest.fn(),
      form: formState,
      setForm,
      setAlert: jest.fn(),
      setSaving: jest.fn(),
      catalogos: {},
      admisiones: [],
      selectedProductoRange: {},
      deriveForm: (nextForm) => nextForm,
      loadAdmisionContext: jest.fn(),
      setContexto: jest.fn(),
      canEdit: true,
      canMakeDecision: false,
      onRequestAvalModalOpen: jest.fn(),
    }));

    act(() => {
      result.current.addAvalGarantiaRow(2);
    });

    const avalDosGarantias = formState.garantias.filter((row) => row.aval_slot === '2');

    expect(avalDosGarantias).toHaveLength(2);
    expect(avalDosGarantias[1].clase_garantia).toBe('AVAL');
    expect(formState.avales).toHaveLength(2);
    expect(formState.requiere_aval).toBe(true);
  });

  it('applies the aval modal draft in one form update', () => {
    let formState = {
      garantias: [
        createGarantiaRow({
          clase_garantia: 'SIMPLE',
          descripcion: 'Garantia solicitante',
        }),
        createGarantiaRow({
          clase_garantia: 'AVAL',
          aval_slot: '1',
          descripcion: 'Garantia anterior',
        }),
      ],
      avales: [
        createAvalState({ manual_mode: true, numero_documento: '12345678' }),
      ],
    };

    const setForm = jest.fn((updater) => {
      formState = typeof updater === 'function' ? updater(formState) : updater;
    });

    const { result } = renderHook(() => useEvaluacionConsumoActions({
      id: null,
      isEditMode: false,
      navigate: jest.fn(),
      form: formState,
      setForm,
      setAlert: jest.fn(),
      setSaving: jest.fn(),
      catalogos: {},
      admisiones: [],
      selectedProductoRange: {},
      deriveForm: (nextForm) => nextForm,
      loadAdmisionContext: jest.fn(),
      setContexto: jest.fn(),
      canEdit: true,
      canMakeDecision: false,
      onRequestAvalModalOpen: jest.fn(),
    }));

    act(() => {
      result.current.applyAvalModalDraft(1, createAvalState({
        manual_mode: true,
        numero_documento: '87654321',
        nombres: 'JUAN',
        tipoVia: 'CALLE',
        nombreVia: 'LIMA',
        numeroMzLt: '100',
        distrito: 'SULLANA',
        provincia: 'SULLANA',
        departamento: 'PIURA',
      }), [
        createGarantiaRow({
          clase_garantia: 'AVAL',
          aval_slot: '1',
          descripcion: 'Garantia nueva',
          usar_direccion_solicitante: true,
        }),
      ]);
    });

    expect(setForm).toHaveBeenCalledTimes(1);
    expect(formState.avales[0].numero_documento).toBe('87654321');
    expect(formState.garantias).toHaveLength(2);
    expect(formState.garantias[0].clase_garantia).toBe('SIMPLE');
    expect(formState.garantias[1].descripcion).toBe('Garantia nueva');
    expect(formState.garantias[1].direccion).toBe('CALLE LIMA, 100, SULLANA, SULLANA, PIURA');
  });
});
