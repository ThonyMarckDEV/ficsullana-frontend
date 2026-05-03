import {
  deriveEvaluacionConsumoFields,
  evaluateFinancialLimits,
} from 'utilities/pages/evaluacion/consumo/calculations';

describe('deriveEvaluacionConsumoFields', () => {
  it('recalculates household expenses, net income and debt ratios in one pass', () => {
    const result = deriveEvaluacionConsumoFields({
      tipo_frecuencia: 'MENSUAL',
      monto: '1000',
      numero_cuotas: '4',
      propuesta: '10',
      ingresos: [
        {
          tipo_ingreso_id: '2',
          ingreso: '1000',
          veces_sueldo: '1',
        },
      ],
      actividad_no_sensible_id: '7',
      otros_ingresos_margen_maximo_snapshot: '40',
      otros_ingresos_ventas: '500',
      otros_ingresos_gasto: '0',
      gasto_alimentacion: '100',
      gasto_servicios: '50',
      gasto_educacion: '25',
      gasto_movilidad: '25',
      gasto_imprevistos: '0',
      sumatoria_cuotas: '100',
      deuda_total: '500',
    }, {
      tiposIngreso: [
        {
          id: 2,
          descripcion: 'INDEPENDIENTE_INFORMAL',
          nombre: 'INDEPENDIENTE INFORMAL',
        },
      ],
      maxVecesSueldo: 2,
    });

    expect(result.total_gasto_unidad).toBe('200.00');
    expect(result.ingreso_neto).toBe('1000.00');
    expect(result.apalancamiento).toBe('1.50');
    expect(result.capacidad_endeudamiento).toBe('37.78');
    expect(result.tasa).toBe('10');
    expect(result.tasa_interes_solicitada).toBe('10');
  });

  it('discounts household expenses before calculating visible debt capacity limits', () => {
    const result = deriveEvaluacionConsumoFields({
      tipo_frecuencia: 'MENSUAL',
      monto: '2000',
      numero_cuotas: '8',
      propuesta: '15',
      ingresos: [
        {
          tipo_ingreso_id: '2',
          ingreso: '1500',
          veces_sueldo: '1',
        },
      ],
      actividad_no_sensible_id: '7',
      otros_ingresos_margen_maximo_snapshot: '40',
      otros_ingresos_ventas: '500',
      otros_ingresos_gasto: '0',
      gasto_alimentacion: '150',
      gasto_servicios: '100',
      gasto_educacion: '50',
      gasto_movilidad: '25',
      gasto_imprevistos: '25',
      sumatoria_cuotas: '884.12',
      deuda_total: '11500',
    }, {
      tiposIngreso: [
        {
          id: 2,
          descripcion: 'INDEPENDIENTE_INFORMAL',
          nombre: 'INDEPENDIENTE INFORMAL',
        },
      ],
      maxVecesSueldo: 2,
    });

    expect(result.total_gasto_unidad).toBe('350.00');
    expect(result.ingreso_neto).toBe('1350.00');
    expect(result.cuota).toBe('290.38');
    expect(result.apalancamiento).toBe('10.00');
    expect(result.capacidad_endeudamiento).toBe('87.00');
    expect(evaluateFinancialLimits(result)).toEqual({
      ingresoNetoInvalido: false,
      apalancamientoExcedido: false,
      capacidadEndeudamientoExcedida: false,
    });
  });

  it('flags only real financial limit violations', () => {
    expect(evaluateFinancialLimits({
      ingreso_neto: '0.00',
      apalancamiento: '10.01',
      capacidad_endeudamiento: '87.01',
    })).toEqual({
      ingresoNetoInvalido: true,
      apalancamientoExcedido: true,
      capacidadEndeudamientoExcedida: true,
    });
  });
});
