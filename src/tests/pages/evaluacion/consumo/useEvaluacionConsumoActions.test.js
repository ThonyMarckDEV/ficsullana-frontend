import { act, renderHook } from '@testing-library/react';
import { createAvalState, createGarantiaRow } from 'utilities/pages/evaluacion/consumo/transformers';
import useEvaluacionConsumoActions, { applyGarantiaDireccionToggle } from 'pages/evaluacion/consumo/hooks/useEvaluacionConsumoActions';
import { enviarRevisionEvaluacionConsumo, updateEvaluacionConsumo } from 'services/evaluacionConsumoService';

jest.mock('services/evaluacionConsumoService', () => ({
  createEvaluacionConsumo: jest.fn(),
  enviarRevisionEvaluacionConsumo: jest.fn(),
  updateEstadoEvaluacionConsumo: jest.fn(),
  updateEvaluacionConsumo: jest.fn(),
}));

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

  it('sends an editable evaluation to review and refreshes form state', async () => {
    let formState = {
      id: 8,
      estado: 'PENDIENTE',
      ingresos: [],
      garantias: [],
    };

    const setForm = jest.fn((updater) => {
      formState = typeof updater === 'function' ? updater(formState) : updater;
    });
    const setAlert = jest.fn();
    const setSaving = jest.fn();
    const setContexto = jest.fn();

    enviarRevisionEvaluacionConsumo.mockResolvedValue({
      message: 'Evaluación enviada a revisión correctamente.',
      data: {
        id: 8,
        estado: 'EN_REVISION',
        decision_comentario: 'Falta sustento.',
        ingresos: [],
        garantias_solicitante: [],
        avales: [],
        contexto: { historial_interno: { visible: false, rows: [] } },
      },
    });

    const { result } = renderHook(() => useEvaluacionConsumoActions({
      id: 8,
      isEditMode: true,
      navigate: jest.fn(),
      form: formState,
      setForm,
      setAlert,
      setSaving,
      catalogos: {},
      admisiones: [],
      selectedProductoRange: {},
      deriveForm: (nextForm) => nextForm,
      loadAdmisionContext: jest.fn(),
      setContexto,
      canEdit: true,
      canMakeDecision: false,
      onRequestAvalModalOpen: jest.fn(),
    }));

    await act(async () => {
      await result.current.handleSendToReview();
    });

    expect(enviarRevisionEvaluacionConsumo).toHaveBeenCalledWith(8);
    expect(formState.estado).toBe('EN_REVISION');
    expect(formState.decision_comentario).toBe('Falta sustento.');
    expect(setContexto).toHaveBeenCalled();
    expect(setAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Evaluación enviada a revisión correctamente.',
    });
    expect(setSaving).toHaveBeenNthCalledWith(1, true);
    expect(setSaving).toHaveBeenLastCalledWith(false);
  });

  it('redirects to the list after updating an evaluation', async () => {
    const navigate = jest.fn();
    const setForm = jest.fn();
    const setAlert = jest.fn();
    const setSaving = jest.fn();
    const setContexto = jest.fn();
    const form = {
      admision_id: '20',
      categoria_id: '1',
      antiguedad_laboral_texto: '2 años',
      plan_inversion: 'Capital de trabajo',
      moneda_id: '1',
      monto: '1000',
      tipo_frecuencia: 'MENSUAL',
      numero_cuotas: '12',
      propuesta: '3',
      cuota: '100',
      producto_id: '1',
      motivos: 'Motivo de prueba',
      criterio_entorno: 'Correcto',
      criterio_direccion: 'Correcto',
      criterio_capacidad_pago: 'Correcto',
      criterio_moral_pago: 'Correcto',
      criterio_situacion_financiera: 'Correcto',
      criterio_plan_inversion: 'Correcto',
      criterio_colaterales: 'Correcto',
      criterio_condiciones: 'Correcto',
      ingresos: [{ tipo_ingreso_id: '1', ingreso: '1500', veces_sueldo: '1' }],
      garantias: [],
      avales: [],
      ingreso_neto: '1200',
      apalancamiento: '2',
      capacidad_endeudamiento: '30',
    };

    updateEvaluacionConsumo.mockResolvedValue({
      message: 'Evaluación consumo actualizada correctamente.',
      data: {
        id: 8,
        ...form,
        contexto: { historial_interno: { visible: false, rows: [] } },
      },
    });

    const { result } = renderHook(() => useEvaluacionConsumoActions({
      id: 8,
      isEditMode: true,
      navigate,
      form,
      setForm,
      setAlert,
      setSaving,
      catalogos: {},
      admisiones: [],
      selectedProductoRange: { hasConfiguraciones: false },
      deriveForm: (nextForm) => nextForm,
      loadAdmisionContext: jest.fn(),
      setContexto,
      canEdit: true,
      canMakeDecision: false,
      onRequestAvalModalOpen: jest.fn(),
    }));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(updateEvaluacionConsumo).toHaveBeenCalledWith(8, expect.objectContaining({
      admision_id: 20,
      monto: 1000,
    }));
    expect(setAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'Evaluación consumo actualizada correctamente.',
    });
    expect(navigate).toHaveBeenCalledWith('/evaluacion/consumo/listar');
    expect(setSaving).toHaveBeenLastCalledWith(false);
  });

  it.each(['EN_REVISION', 'APROBADO', 'RECHAZADO'])(
    'does not send non-editable %s evaluations to review',
    async (estado) => {
      const setSaving = jest.fn();

      const { result } = renderHook(() => useEvaluacionConsumoActions({
        id: 8,
        isEditMode: true,
        navigate: jest.fn(),
        form: { id: 8, estado },
        setForm: jest.fn(),
        setAlert: jest.fn(),
        setSaving,
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

      let response;
      await act(async () => {
        response = await result.current.handleSendToReview();
      });

      expect(response).toBeNull();
      expect(enviarRevisionEvaluacionConsumo).not.toHaveBeenCalled();
      expect(setSaving).not.toHaveBeenCalled();
    }
  );
});
