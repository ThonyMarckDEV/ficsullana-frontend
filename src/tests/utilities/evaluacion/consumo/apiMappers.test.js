import { mapApiToForm, mapFormToPayload } from 'utilities/pages/evaluacion/consumo/apiMappers';

describe('apiMappers', () => {
  it('maps legacy api payloads into mixed guarantees and aval rows', () => {
    const form = mapApiToForm({
      id: 33,
      admision_id: 12,
      categoria_id: 2,
      moneda_id: 1,
      estado: 'pendiente',
      ingresos: [],
      garantias: [
        {
          moneda_id: 1,
          clase_garantia: 'SIMPLE',
          descripcion: 'Garantia solicitante',
          direccion: 'AV UNO',
          monto_garantias: '1400.00',
          valor_comercial: '1600.00',
        },
        {
          moneda_id: 1,
          clase_garantia: 'AVAL',
          descripcion: 'Garantia aval',
          direccion: 'AV DOS',
          monto_garantias: '1800.00',
          valor_comercial: '2000.00',
        },
      ],
      aval_id: 7,
      aval: {
        aval_id: 7,
        numero_documento: '12345678',
        nombres: 'Juan',
        apellido_paterno: 'Perez',
        apellido_materno: 'Lopez',
        tipoVia: 'URBANO',
        nombreVia: 'AV DOS',
        numeroMzLt: '123',
        urbanizacion: 'CENTRO',
        distrito: 'SULLANA',
        provincia: 'SULLANA',
        departamento: 'PIURA',
      },
    });

    expect(form.estado).toBe('PENDIENTE');
    expect(form.requiere_aval).toBe(true);
    expect(form.garantias).toHaveLength(2);
    expect(form.garantias[1].aval_slot).toBe('1');
    expect(form.avales).toHaveLength(1);
    expect(form.avales[0].aval_id).toBe('7');
    expect(form.avales[0].selected_label).toBe('Juan Perez Lopez');
  });

  it('normalizes propuesta, tasa and tasa_interes_solicitada to one visible rate', () => {
    const form = mapApiToForm({
      propuesta: null,
      tasa: '14.75',
      tasa_interes_solicitada: '13.00',
      ingresos: [],
      garantias: [],
    });

    expect(form.propuesta).toBe('14.75');
    expect(form.tasa).toBe('14.75');
    expect(form.tasa_interes_solicitada).toBe('14.75');
  });

  it('serializes form payloads trimming text and preserving only active aval slots', () => {
    const payload = mapFormToPayload({
      admision_id: '1',
      categoria_id: '2',
      antiguedad_laboral_texto: '12 meses',
      plan_inversion: '  Compra de mercaderia  ',
      moneda_id: '1',
      monto: '1500',
      tipo_frecuencia: 'MENSUAL',
      numero_cuotas: '6',
      propuesta: '12.5',
      producto_id: '4',
      motivos: 'Motivo',
      actividad_no_sensible_id: '',
      otros_ingresos_tipo_negocio: '   ',
      otros_ingresos_ventas: '',
      otros_ingresos_costo: '',
      otros_ingresos_gasto: '',
      otros_ingresos_utilidad: '',
      ingreso_neto: '',
      boleta_basica: '',
      boleta_variable_mes_1: '',
      boleta_variable_mes_2: '',
      boleta_variable_mes_3: '',
      gasto_alimentacion: '',
      gasto_servicios: '',
      gasto_educacion: '',
      gasto_movilidad: '',
      gasto_imprevistos: '',
      criterio_entorno: '  Entorno  ',
      criterio_direccion: ' Direccion ',
      criterio_capacidad_pago: ' Capacidad ',
      criterio_moral_pago: ' Moral ',
      criterio_situacion_financiera: ' Situacion ',
      criterio_plan_inversion: ' Plan ',
      criterio_colaterales: ' Colaterales ',
      criterio_condiciones: ' Condiciones ',
      garantias: [
        {
          client_id: 'g-1',
          moneda_id: '1',
          clase_garantia: 'SIMPLE',
          documento_garantia: ' DJ ',
          tipo_garantia: ' BIEN ',
          descripcion: ' Garantia solicitante ',
          direccion: ' AV UNO ',
          usar_direccion_solicitante: false,
          monto_garantias: '1500.00',
          valor_comercial: '1800.00',
          valor_realizacion: '',
          ficha_registral: '',
          fecha_ultima_evaluacion: '',
        },
        {
          client_id: 'g-2',
          moneda_id: '1',
          clase_garantia: 'AVAL',
          aval_slot: '2',
          documento_garantia: ' DJ ',
          tipo_garantia: ' BIEN ',
          descripcion: ' Garantia aval ',
          direccion: ' AV DOS ',
          usar_direccion_solicitante: false,
          monto_garantias: '1700.00',
          valor_comercial: '1900.00',
          valor_realizacion: '',
          ficha_registral: '',
          fecha_ultima_evaluacion: '',
        },
        {
          client_id: 'g-3',
          moneda_id: '1',
          clase_garantia: 'AVAL',
          aval_slot: '2',
          documento_garantia: ' DJ ',
          tipo_garantia: ' VEHICULO ',
          descripcion: ' Segunda garantia aval ',
          direccion: ' AV TRES ',
          usar_direccion_solicitante: false,
          monto_garantias: '900.00',
          valor_comercial: '1100.00',
          valor_realizacion: '',
          ficha_registral: '',
          fecha_ultima_evaluacion: '',
        },
      ],
      avales: [
        {},
        {
          manual_mode: true,
          tipo_documento: 'CE',
          numero_documento: '123456789',
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
          direccion: '',
          departamento: 'PIURA',
          provincia: 'SULLANA',
          distrito: 'SULLANA',
        },
      ],
      ingresos: [
        {
          tipo_ingreso_id: '3',
          ingreso: '1000',
          veces_sueldo: '1.5',
        },
      ],
    });

    expect(payload.plan_inversion).toBe('Compra de mercaderia');
    expect(payload.criterio_entorno).toBe('Entorno');
    expect(payload.otros_ingresos_tipo_negocio).toBeNull();
    expect(payload.actividad_no_sensible_id).toBeNull();
    expect(payload.garantias_solicitante).toHaveLength(1);
    expect(payload.garantias_solicitante[0].valor_realizacion).toBeNull();
    expect(payload.garantias_solicitante[0].ficha_registral).toBeNull();
    expect(payload.avales).toHaveLength(1);
    expect(payload.avales[0].es_carnet_extranjeria).toBe(true);
    expect(payload.avales[0].garantias).toHaveLength(2);
    expect(payload.avales[0].garantias[0].valor_realizacion).toBeNull();
    expect(payload.avales[0].garantias[0].ficha_registral).toBeNull();
    expect(payload.avales[0].garantias.map((garantia) => garantia.descripcion)).toEqual([
      'Garantia aval',
      'Segunda garantia aval',
    ]);
    expect(payload.avales[0].direccion).toBe('URBANO AV DOS, 123, CENTRO, SULLANA, SULLANA, PIURA');
    expect(payload.ingresos[0]).toEqual({
      tipo_ingreso_id: 3,
      ingreso: 1000,
      veces_sueldo: 1.5,
    });
  });
});
