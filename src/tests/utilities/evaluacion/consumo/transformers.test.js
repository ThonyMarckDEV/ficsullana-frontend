import { mapApiToForm, mapFormToPayload } from 'utilities/pages/evaluacion/consumo/transformers';

describe('evaluacion consumo transformers', () => {
  it('groups mixed guarantees into applicant guarantees and avales payload', () => {
    const payload = mapFormToPayload({
      admision_id: '1',
      categoria_id: '1',
      antiguedad_laboral_texto: '12 meses',
      plan_inversion: 'Compra',
      moneda_id: '1',
      monto: '1500',
      tipo_frecuencia: 'MENSUAL',
      numero_cuotas: '6',
      propuesta: '12',
      producto_id: '1',
      motivos: 'Motivo',
      ingresos: [
        {
          tipo_ingreso_id: '1',
          ingreso: '1200',
          veces_sueldo: '1',
        },
      ],
      garantias: [
        {
          client_id: 'g-1',
          moneda_id: '1',
          clase_garantia: 'SIMPLE',
          documento_garantia: 'DECLARACION_JURADA',
          tipo_garantia: 'BIEN',
          descripcion: 'Garantia solicitante',
          direccion: 'AV UNO',
          usar_direccion_solicitante: false,
          monto_garantias: '1500.00',
          valor_comercial: '1800.00',
          valor_realizacion: '1700.00',
          ficha_registral: '',
          fecha_ultima_evaluacion: '',
        },
        {
          client_id: 'g-2',
          moneda_id: '1',
          clase_garantia: 'AVAL',
          aval_slot: 2,
          documento_garantia: 'DECLARACION_JURADA',
          tipo_garantia: 'BIEN',
          descripcion: 'Garantia aval 2',
          direccion: 'AV DOS',
          usar_direccion_solicitante: false,
          monto_garantias: '1600.00',
          valor_comercial: '1900.00',
          valor_realizacion: '1700.00',
          ficha_registral: '',
          fecha_ultima_evaluacion: '',
        },
      ],
      avales: [
        {},
        {
          manual_mode: true,
          tipo_documento: 'DNI',
          numero_documento: '12345678',
          nombres: 'Juan',
          apellido_paterno: 'Perez',
          apellido_materno: 'Lopez',
          tipo_vivienda: 'PROPIA',
          telefono_fijo: '',
          telefono_movil: '912345678',
          referencia_domiciliaria: 'Frente',
          tipoVia: 'URBANO',
          nombreVia: 'AV DOS',
          numeroMzLt: '123',
          urbanizacion: 'CENTRO',
          direccion: 'AV DOS 123',
          departamento: 'PIURA',
          provincia: 'SULLANA',
          distrito: 'SULLANA',
        },
      ],
    });

    expect(payload.garantias_solicitante).toHaveLength(1);
    expect(payload.avales).toHaveLength(1);
    expect(payload.avales[0].garantias).toHaveLength(1);
    expect(payload.avales[0].numero_documento).toBe('12345678');
  });

  it('maps api aval guarantees back to mixed guarantee rows with slot references', () => {
    const form = mapApiToForm({
      id: 10,
      admision_id: 1,
      categoria_id: 1,
      moneda_id: 1,
      estado: 'PENDIENTE',
      ingresos: [],
      garantias_solicitante: [
        {
          moneda_id: 1,
          clase_garantia: 'SIMPLE',
          documento_garantia: 'DECLARACION_JURADA',
          tipo_garantia: 'BIEN',
          descripcion: 'Simple',
          direccion: 'AV UNO',
          monto_garantias: '1500.00',
          valor_comercial: '1800.00',
        },
      ],
      avales: [
        {
          aval_id: 5,
          numero_documento: '12345678',
          nombres: 'Juan',
          apellido_paterno: 'Perez',
          apellido_materno: 'Lopez',
          telefono_movil: '912345678',
          referencia_domiciliaria: 'Frente',
          tipoVia: 'URBANO',
          nombreVia: 'AV DOS',
          numeroMzLt: '123',
          urbanizacion: 'CENTRO',
          direccion: 'AV DOS 123',
          departamento: 'PIURA',
          provincia: 'SULLANA',
          distrito: 'SULLANA',
          garantias: [
            {
              moneda_id: 1,
              clase_garantia: 'AVAL',
              documento_garantia: 'DECLARACION_JURADA',
              tipo_garantia: 'BIEN',
              descripcion: 'Aval 1',
              direccion: 'AV DOS',
              monto_garantias: '1600.00',
              valor_comercial: '1900.00',
            },
          ],
        },
      ],
    });

    expect(form.garantias).toHaveLength(2);
    expect(form.garantias[1].clase_garantia).toBe('AVAL');
    expect(form.garantias[1].aval_slot).toBe('1');
    expect(form.avales).toHaveLength(1);
  });
});
