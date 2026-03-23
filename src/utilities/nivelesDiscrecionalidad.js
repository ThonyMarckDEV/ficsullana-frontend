export const TIPO_EVALUACION_OPTIONS = [
  { value: 'CONSUMO', label: 'Evaluación Consumo' },
];

export const resolveTipoEvaluacionLabel = (value) => (
  TIPO_EVALUACION_OPTIONS.find((item) => item.value === String(value || '').toUpperCase())?.label || 'N/A'
);

export const formatNivelDiscrecionalidadRange = (nivel) => ({
  monto: `S/ ${nivel?.monto_min ?? '-'} - S/ ${nivel?.monto_max ?? '-'}`,
  cuotas: `${nivel?.cuotas_min ?? '-'} - ${nivel?.cuotas_max ?? '-'}`,
  tasa: `${nivel?.tasa_min ?? '-'}% - ${nivel?.tasa_max ?? '-'}%`,
});

export const formatNivelDiscrecionalidadEstado = (estado) => (estado ? 'ACTIVO' : 'INACTIVO');