import { validateEvaluacionConsumoForm } from 'utilities/pages/evaluacion/consumo/validators';

const createGarantia = (clase = 'SIMPLE', overrides = {}) => ({
  client_id: 'gar-1',
  moneda_id: '1',
  clase_garantia: clase,
  aval_slot: clase === 'AVAL' ? 1 : '',
  documento_garantia: 'DECLARACION_JURADA',
  tipo_garantia: 'BIEN',
  descripcion: 'Garantia valida',
  direccion: 'AV PERU 123',
  usar_direccion_solicitante: false,
  monto_garantias: '1500.00',
  valor_comercial: '1800.00',
  valor_realizacion: '1700.00',
  ficha_registral: '',
  fecha_ultima_evaluacion: '',
  ...overrides,
});

const createAval = (overrides = {}) => ({
  client_id: 'aval-1',
  aval_id: '',
  selected_label: '',
  is_existing: false,
  manual_mode: true,
  tipo_documento: 'DNI',
  numero_documento: '12345678',
  apellido_paterno: 'Perez',
  apellido_materno: 'Lopez',
  nombres: 'Juan',
  telefono_fijo: '12345678',
  telefono_movil: '912345678',
  tipo_vivienda: 'PROPIA',
  referencia_domiciliaria: 'Frente al parque',
  tipoVia: 'URBANO',
  nombreVia: 'AV PERU',
  numeroMzLt: '123',
  urbanizacion: 'CENTRO',
  direccion: 'URBANO AV PERU, 123, CENTRO, SULLANA, SULLANA, PIURA',
  departamento: 'PIURA',
  provincia: 'SULLANA',
  distrito: 'SULLANA',
  ...overrides,
});

const createBaseForm = () => ({
  admision_id: '1',
  categoria_id: '1',
  antiguedad_laboral_texto: '24 meses',
  plan_inversion: 'Compra',
  moneda_id: '1',
  monto: '1500',
  tipo_frecuencia: 'MENSUAL',
  numero_cuotas: '6',
  propuesta: '12.5',
  cuota: '277.75',
  producto_id: '1',
  motivos: 'Solicitud regular',
  ingresos: [
    {
      tipo_ingreso_id: '1',
      ingreso: '1200',
      veces_sueldo: '1',
    },
  ],
  garantias: [createGarantia('SIMPLE')],
  avales: [],
  otros_ingresos_utilidad: '',
  actividad_no_sensible_id: '',
  ingreso_neto: '1200.00',
  apalancamiento: '1.00',
  capacidad_endeudamiento: '40.00',
  boleta_basica: '',
  boleta_variable_mes_1: '',
  boleta_variable_mes_2: '',
  boleta_variable_mes_3: '',
  gasto_alimentacion: '0',
  gasto_servicios: '0',
  gasto_educacion: '0',
  gasto_movilidad: '0',
  gasto_imprevistos: '0',
  criterio_entorno: 'Entorno evaluado.',
  criterio_direccion: 'Direccion validada.',
  criterio_capacidad_pago: 'Capacidad suficiente.',
  criterio_moral_pago: 'Moral de pago favorable.',
  criterio_situacion_financiera: 'Situacion financiera estable.',
  criterio_plan_inversion: 'Plan de inversion coherente.',
  criterio_colaterales: 'Colaterales suficientes.',
  criterio_condiciones: 'Condiciones aceptables.',
});

describe('validateEvaluacionConsumoForm', () => {
  it('rejects an invalid aval slot assignment', () => {
    const errors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      garantias: [
        createGarantia('AVAL', { client_id: 'g-4', aval_slot: 4 }),
      ],
      avales: [createAval()],
    }, { maxVecesSueldo: 2 });

    expect(errors).toContain('Garantía 1: debe vincularse a un aval.');
  });

  it('rejects applicant guarantees with an invalid class for a simple row', () => {
    const errors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      garantias: [createGarantia('AVAL', { aval_slot: '' })],
      avales: [createAval()],
    }, { maxVecesSueldo: 2 });

    expect(errors).toContain('Garantía 1: debe vincularse a un aval.');
  });

  it('rejects financial ratios beyond the configured limits', () => {
    const errors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      ingreso_neto: '1000.00',
      apalancamiento: '10.01',
      capacidad_endeudamiento: '87.01',
    }, { maxVecesSueldo: 2 });

    expect(errors).toContain('El apalancamiento no puede ser mayor a 10.00.');
    expect(errors).toContain('La capacidad de endeudamiento no puede ser mayor a 87.00%.');
  });

  it('allows exact financial limits and blocks only real net-income violations', () => {
    const exactLimitErrors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      ingreso_neto: '1000.00',
      apalancamiento: '10.00',
      capacidad_endeudamiento: '87.00',
    }, { maxVecesSueldo: 2 });

    expect(exactLimitErrors).not.toContain('El apalancamiento no puede ser mayor a 10.00.');
    expect(exactLimitErrors).not.toContain('La capacidad de endeudamiento no puede ser mayor a 87.00%.');

    const blockedErrors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      ingreso_neto: '-0.01',
      apalancamiento: '',
      capacidad_endeudamiento: '',
    }, { maxVecesSueldo: 2 });

    expect(blockedErrors).toContain('El ingreso neto debe ser mayor que 0.00 luego de descontar los gastos de unidad familiar.');
  });

  it('requires aval data when a guarantee is linked to an aval slot', () => {
    const errors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      garantias: [createGarantia('AVAL', { aval_slot: 1 })],
      avales: [],
    }, { maxVecesSueldo: 2 });

    expect(errors).toContain('Aval 1: debe seleccionar un aval existente o registrar uno nuevo.');
    expect(errors).toContain('Aval 1: documento es obligatorio.');
  });

  it('allows multiple guarantees linked to the same aval', () => {
    const errors = validateEvaluacionConsumoForm({
      ...createBaseForm(),
      garantias: [
        createGarantia('AVAL', { client_id: 'g-1', aval_slot: 1 }),
        createGarantia('AVAL', { client_id: 'g-2', aval_slot: 1 }),
      ],
      avales: [createAval()],
    }, { maxVecesSueldo: 2 });

    expect(errors).not.toContain('Aval 1: debe registrar al menos una garantía.');
  });
});
