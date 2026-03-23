export const PRODUCTO_TIPO_OPTIONS = [
  { value: 'CONSUMO', label: 'Solo Consumo' },
  { value: 'PYME', label: 'Solo Pyme' },
  { value: 'AMBOS', label: 'Consumo y Pyme' },
];

export const PERIODICIDAD_OPTIONS = [
  { id: 1, key: 'SEMANAL', nombre: 'SEMANAL', label: 'Semanal', dias: 7 },
  { id: 2, key: 'CATORCENAL', nombre: 'CATORCENAL', label: 'Catorcenal', dias: 14 },
  { id: 3, key: 'MENSUAL', nombre: 'MENSUAL', label: 'Mensual', dias: 30 },
];

export const DEFAULT_PERIODICIDAD = PERIODICIDAD_OPTIONS[0];