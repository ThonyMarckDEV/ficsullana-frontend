import {
  buildDecisionPlanAdjustmentPayload,
  validateDecisionPlanAdjustments,
} from 'utilities/pages/evaluacion/consumo/decisionPayload';

describe('decisionPayload', () => {
  it('syncs propuesta, tasa and tasa_interes_solicitada from the decision rate', () => {
    const payload = buildDecisionPlanAdjustmentPayload({
      monto: '1200.00',
      tipo_frecuencia: 'SEMANAL',
      numero_cuotas: '6',
      propuesta: '12.50',
      tasa: '10.00',
      tasa_interes_solicitada: '10.00',
      cuota: '999.99',
    });

    expect(payload).toEqual({
      monto: '1200.00',
      tipo_frecuencia: 'SEMANAL',
      numero_cuotas: 6,
      propuesta: '12.50',
      tasa: '12.50',
      tasa_interes_solicitada: '12.50',
    });
    expect(payload).not.toHaveProperty('cuota');
  });

  it('validates required and numeric fields without blocking product-policy exceptions', () => {
    const errors = validateDecisionPlanAdjustments({
      monto: '1200.00',
      tipo_frecuencia: 'SEMANAL',
      numero_cuotas: '6',
      propuesta: '9.50',
    }, {
      min: 10,
      max: 20,
      exactMatch: false,
      hasConfiguraciones: true,
      helperText: 'No existe una configuración activa.',
    });

    expect(errors).toEqual([]);
  });

  it('blocks invalid numeric decision adjustments before calling update-estado', () => {
    const errors = validateDecisionPlanAdjustments({
      monto: '0',
      tipo_frecuencia: 'MENSUAL',
      numero_cuotas: '2.5',
      propuesta: 'abc',
    }, {
      min: null,
      max: null,
      exactMatch: true,
      hasConfiguraciones: false,
    });

    expect(errors).toEqual([
      'El monto debe ser mayor a 0 para registrar la decisión.',
      'El número de cuotas debe ser un entero mayor a 0 para registrar la decisión.',
      'La tasa debe ser mayor a 0 para registrar la decisión.',
    ]);
  });

  it('falls back to tasa when legacy forms have no propuesta and still sends one final rate', () => {
    const payload = buildDecisionPlanAdjustmentPayload({
      monto: '2400',
      tipo_frecuencia: 'MENSUAL',
      numero_cuotas: '12',
      propuesta: '',
      tasa: '18.25',
      tasa_interes_solicitada: '15.00',
    });

    expect(payload.propuesta).toBe('18.25');
    expect(payload.tasa).toBe('18.25');
    expect(payload.tasa_interes_solicitada).toBe('18.25');
    expect(payload).not.toHaveProperty('cuota');
  });
});
