import {
  buildEvaluacionConsumoPrintView,
  normalizeEvaluacionConsumoPrintPayload,
} from 'utilities/pages/evaluacion/consumo/viewModel';

describe('evaluacion consumo print view model', () => {
  it('normalizes the backend print contract from wrapped and direct responses', () => {
    const payload = {
      documento: 'evaluacion_consumo',
      generado_at: '2026-05-05T12:00:00-05:00',
      evaluacion: { id: 8, estado: 'APROBADO' },
    };

    expect(normalizeEvaluacionConsumoPrintPayload({ data: payload })).toEqual(payload);
    expect(normalizeEvaluacionConsumoPrintPayload(payload)).toEqual(payload);
  });

  it('rejects print payloads without a backend evaluation id', () => {
    expect(() => normalizeEvaluacionConsumoPrintPayload({
      data: {
        documento: 'evaluacion_consumo',
        evaluacion: { estado: 'APROBADO' },
      },
    })).toThrow('El backend no devolvió una evaluación válida para impresión.');
  });

  it('uses safe empty values for invalid dates from the print payload', () => {
    const vm = buildEvaluacionConsumoPrintView({
      documento: 'evaluacion_consumo',
      generado_at: 'invalid-date',
      evaluacion: {
        id: 8,
        estado: 'APROBADO',
        fecha_evaluacion: 'invalid-date',
        ingresos: [],
        garantias_solicitante: [],
        avales: [],
        contexto: {},
      },
    });

    expect(vm.fechaEvaluacion).toBe('N/A');
  });
});
