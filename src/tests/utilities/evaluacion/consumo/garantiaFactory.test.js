import {
  AVAL_GARANTIA_VALUE,
  SIMPLE_GARANTIA_VALUE,
  createAvalGarantiaRow,
  createGarantiaRow,
  createIngresoRow,
  getActiveAvalSlots,
  hasGarantiaContent,
  normalizeAvalSlot,
  parseRangoTasa,
} from 'utilities/pages/evaluacion/consumo/garantiaFactory';

describe('garantiaFactory', () => {
  it('normalizes aval slots inside valid range only', () => {
    expect(normalizeAvalSlot('1')).toBe(1);
    expect(normalizeAvalSlot(3)).toBe(3);
    expect(normalizeAvalSlot('0')).toBeNull();
    expect(normalizeAvalSlot('9')).toBeNull();
    expect(normalizeAvalSlot('abc')).toBeNull();
  });

  it('creates aval guarantee rows with forced class and normalized slot', () => {
    const row = createAvalGarantiaRow({
      aval_slot: '2',
      descripcion: 'Garantia aval',
    });

    expect(row.client_id).toMatch(/^aval-garantia-\d+$/);
    expect(row.clase_garantia).toBe(AVAL_GARANTIA_VALUE);
    expect(row.aval_slot).toBe('2');
    expect(row.descripcion).toBe('Garantia aval');
  });

  it('detects content without treating metadata-only rows as valid guarantees', () => {
    expect(hasGarantiaContent(createGarantiaRow())).toBe(false);
    expect(hasGarantiaContent(createGarantiaRow({
      clase_garantia: SIMPLE_GARANTIA_VALUE,
      usar_direccion_solicitante: true,
    }))).toBe(false);
    expect(hasGarantiaContent(createGarantiaRow({
      moneda_id: '1',
      descripcion: 'Garantia simple',
    }))).toBe(true);
  });

  it('returns unique sorted active aval slots and preserves default ingreso row shape', () => {
    const slots = getActiveAvalSlots([
      createGarantiaRow({ clase_garantia: 'AVAL', aval_slot: '3', descripcion: 'A' }),
      createGarantiaRow({ clase_garantia: 'AVAL', aval_slot: '1', descripcion: 'B' }),
      createGarantiaRow({ clase_garantia: 'AVAL', aval_slot: '3', descripcion: 'C' }),
      createGarantiaRow({ clase_garantia: 'SIMPLE', descripcion: 'Simple' }),
    ]);

    expect(slots).toEqual([1, 3]);
    expect(createIngresoRow()).toEqual({
      tipo_ingreso_id: '',
      ingreso: '',
      veces_sueldo: '',
      monto_maximo_otorgar: 0,
    });
  });

  it('parses display range labels safely', () => {
    expect(parseRangoTasa('10% - 15,5%')).toEqual({
      min: 10,
      max: 15.5,
      label: '10% - 15.5%',
    });
    expect(parseRangoTasa('sin rango')).toEqual({
      min: null,
      max: null,
      label: 'sin rango',
    });
  });
});
