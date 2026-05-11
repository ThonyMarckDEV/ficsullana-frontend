import {
  buildAvalDireccion,
  buildAvalFullName,
  createAvalState,
  hasAvalContent,
  hasAvales,
  mapAvalLookupToState,
} from 'utilities/pages/evaluacion/consumo/avalFactory';

describe('avalFactory', () => {
  it('builds full name and fallback address from loose aval data', () => {
    expect(buildAvalFullName({
      nombres: 'Juan',
      apellido_paterno: 'Perez',
      apellido_materno: 'Lopez',
    })).toBe('Juan Perez Lopez');

    expect(buildAvalDireccion({
      tipoVia: 'URBANO',
      nombreVia: 'AV PERU',
      numeroMzLt: '123',
      urbanizacion: 'CENTRO',
      distrito: 'SULLANA',
      provincia: 'SULLANA',
      departamento: 'PIURA',
    })).toBe('URBANO AV PERU, 123, CENTRO, SULLANA, SULLANA, PIURA');
  });

  it('creates aval state with normalized document type and computed direction', () => {
    const aval = createAvalState({
      es_carnet_extranjeria: true,
      numero_documento: 123456789,
      nombres: 'Juana',
      apellido_paterno: 'Perez',
      apellido_materno: 'Diaz',
      tipoVia: 'URBANO',
      nombreVia: 'AV GRAU',
      numeroMzLt: '45',
      urbanizacion: 'CENTRO',
      distrito: 'SULLANA',
      provincia: 'SULLANA',
      departamento: 'PIURA',
    });

    expect(aval.client_id).toMatch(/^aval-\d+$/);
    expect(aval.tipo_documento).toBe('CE');
    expect(aval.is_existing).toBe(false);
    expect(aval.direccion).toBe('URBANO AV GRAU, 45, CENTRO, SULLANA, SULLANA, PIURA');
  });

  it('maps aval lookup records into existing non-manual state', () => {
    const aval = mapAvalLookupToState({
      id: 9,
      es_carnet_extranjeria: false,
      numero_documento: '12345678',
      nombres: 'Carlos',
      apellido_paterno: 'Ruiz',
      apellido_materno: 'Lopez',
      tipo_vivienda: 'PROPIA',
      contacto: {
        telefono_fijo: '12345678',
        telefono_movil: '912345678',
      },
      direccion: {
        referencia_domiciliaria: 'Frente al parque',
        tipoVia: 'URBANO',
        nombreVia: 'AV BOLOGNESI',
        numeroMzLt: '777',
        urbanizacion: 'CENTRO',
        direccion: 'AV BOLOGNESI 777',
        departamento: 'PIURA',
        provincia: 'SULLANA',
        distrito: 'SULLANA',
      },
      garantias: [
        {
          id: 22,
          descripcion: 'Garantia maestra',
        },
      ],
    });

    expect(aval.aval_id).toBe('9');
    expect(aval.selected_label).toBe('Carlos Ruiz Lopez');
    expect(aval.is_existing).toBe(true);
    expect(aval.manual_mode).toBe(false);
    expect(aval.telefono_movil).toBe('912345678');
    expect(aval.direccion).toBe('AV BOLOGNESI 777');
    expect(aval.garantias_registradas).toHaveLength(1);
    expect(aval.garantias_registradas[0].id).toBe(22);
  });

  it('detects content and validates aval collection presence', () => {
    expect(hasAvalContent(createAvalState())).toBe(false);
    expect(hasAvalContent(createAvalState({ aval_id: '11' }))).toBe(true);
    expect(hasAvales([])).toBe(false);
    expect(hasAvales([createAvalState({ nombres: 'Activo' })])).toBe(true);
  });
});
