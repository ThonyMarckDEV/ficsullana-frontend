import {
  buildAvalGroups,
  mapGarantiaLookupToRow,
  normalizeAvalCollections,
} from 'utilities/pages/evaluacion/consumo/avalWorkflow';
import { createAvalState, createGarantiaRow } from 'utilities/pages/evaluacion/consumo/transformers';

describe('aval workflow utilities', () => {
  it('normalizes aval slots and removes orphan aval entries', () => {
    const result = normalizeAvalCollections([
      createGarantiaRow({
        client_id: 'gar-1',
        clase_garantia: 'AVAL',
        aval_slot: '2',
        descripcion: 'Garantia aval',
      }),
      createGarantiaRow({
        client_id: 'gar-2',
        clase_garantia: 'SIMPLE',
        descripcion: 'Garantia simple',
      }),
    ], [
      createAvalState({ client_id: 'aval-1', manual_mode: true, nombres: 'Orfano' }),
      createAvalState({ client_id: 'aval-2', manual_mode: true, nombres: 'Activo' }),
    ]);

    expect(result.garantias[0].aval_slot).toBe('1');
    expect(result.avales).toHaveLength(1);
    expect(result.avales[0].nombres).toBe('Activo');
    expect(result.requiresAval).toBe(true);
  });

  it('builds complete aval groups for existing avals with valid guarantees', () => {
    const groups = buildAvalGroups({
      garantias: [
        createGarantiaRow({
          client_id: 'gar-1',
          clase_garantia: 'AVAL',
          aval_slot: '1',
          garantia_id: '15',
          moneda_id: '1',
          documento_garantia: 'DECLARACION_JURADA',
          tipo_garantia: 'BIEN',
          descripcion: 'Garantia registrada',
          direccion: 'AV UNO',
          monto_garantias: '1500.00',
          valor_comercial: '1500.00',
        }),
      ],
      avales: [
        createAvalState({
          aval_id: '9',
          is_existing: true,
          selected_label: 'Juan Perez',
          numero_documento: '12345678',
          nombres: 'Juan',
          apellido_paterno: 'Perez',
          apellido_materno: 'Lopez',
          garantias_registradas: [{ id: 15, descripcion: 'Garantia registrada' }],
        }),
      ],
      canEdit: true,
    });

    expect(groups).toHaveLength(1);
    expect(groups[0].isComplete).toBe(true);
    expect(groups[0].modeLabel).toBe('Aval existente');
    expect(groups[0].lookupEnabled).toBe(true);
    expect(groups[0].lookupOptions).toHaveLength(1);
    expect(groups[0].status.code).toBe('complete');
  });

  it('maps a selected master guarantee into the aval guarantee row state', () => {
    const row = mapGarantiaLookupToRow({
      id: 22,
      moneda_id: 3,
      documento_garantia: 'DECLARACION_JURADA',
      tipo_garantia: 'BIEN',
      descripcion: 'Garantia maestra',
      direccion: 'JR DOS 456',
      valor_bien: '1800.00',
      ficha_registral: 'FICHA-123',
      fecha_ultima_evaluacion: '2026-04-18',
    }, createGarantiaRow({
      client_id: 'gar-4',
      clase_garantia: 'AVAL',
      aval_slot: '1',
    }));

    expect(row.garantia_id).toBe('22');
    expect(row.moneda_id).toBe('3');
    expect(row.monto_garantias).toBe('1800.00');
    expect(row.descripcion).toBe('Garantia maestra');
    expect(row.ficha_registral).toBe('FICHA-123');
  });
});
