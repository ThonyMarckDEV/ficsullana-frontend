import { resolveProductoConfiguracion } from 'utilities/productos';
import { formatEvaluacionConsumoState } from './status';

const NA = 'N/A';

const isBlank = (value) => value === null || value === undefined || value === '';

const formatDateTime = (value) => {
  if (isBlank(value)) return NA;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return NA;

  return parsed.toLocaleString('es-PE');
};

export const normalizeEvaluacionConsumoPrintPayload = (response) => {
  const payload = response?.data || response;
  const evaluacion = payload?.evaluacion || null;

  if (!evaluacion?.id) {
    throw new Error('El backend no devolvió una evaluación válida para impresión.');
  }

  return {
    ...payload,
    evaluacion,
  };
};

export const buildEvaluacionConsumoPrintView = (record) => {
  if (!record) return null;

  const source = record?.evaluacion || record;

  const productoRange = resolveProductoConfiguracion(source?.producto, {
    tipoFrecuencia: source?.tipo_frecuencia,
    monto: source?.monto,
    numeroCuotas: source?.numero_cuotas,
  });

  return {
    raw: source,
    metadata: record?.evaluacion
      ? {
          generadoAt: record.generado_at,
          generadoPor: record.generado_por,
          documento: record.documento,
        }
      : null,
    id: source.id,
    estado: formatEvaluacionConsumoState(source.estado),
    fechaEvaluacion: formatDateTime(source.fecha_evaluacion),
    agencia: source?.sede?.nombre || NA,
    usuario: source?.usuario?.username || NA,
    perfil: source?.rol?.nombre || NA,
    decisionComentario: source.decision_comentario || NA,
    cliente: source.solicitante_nombre_snapshot,
    dni: source.solicitante_dni_snapshot,
    direccion: source.direccion_snapshot || NA,
    categoria: source?.categoria?.nombre || NA,
    antiguedadLaboral: source.antiguedad_laboral_texto || NA,
    planInversion: source?.plan_inversion || NA,
    moneda: source?.moneda?.nombre || NA,
    monto: source.monto,
    clasePrestamo: source.clase_prestamo_snapshot,
    tipoFrecuencia: source.tipo_frecuencia,
    valorFrecuencia: source.valor_frecuencia,
    numeroCuotas: source.numero_cuotas,
    propuesta: source.propuesta,
    cuota: source.cuota,
    rangoTasa: productoRange?.label || NA,
    producto: source?.producto?.nombre || NA,
    expuestoRcc: source.expuesto_rcc ? 'SI' : 'NO',
    tasaSolicitada: source.tasa_interes_solicitada,
    discrecionalidad: source?.nivel_discrecionalidad_resuelto?.rol_autorizador?.nombre || 'SIN REGLA APLICABLE',
    motivos: source.motivos || NA,
    ingresoTotal: source.ingreso_total,
    montoMaximoTotal: source.monto_maximo_total,
    ingresos: source.ingresos || [],
    garantiasSolicitante: source.garantias_solicitante || [],
    avales: source.avales || [],
    contexto: source.contexto || {},
    otrosIngresosSector: source.otros_ingresos_sector_snapshot || NA,
    otrosIngresosActividad: source.otros_ingresos_actividad_snapshot || source.otros_ingresos_tipo_negocio || NA,
    otrosIngresosMargenMaximo: source.otros_ingresos_margen_maximo_snapshot,
    otrosIngresosTipoNegocio: source.otros_ingresos_tipo_negocio || NA,
    otrosIngresosVentas: source.otros_ingresos_ventas,
    otrosIngresosCosto: source.otros_ingresos_costo,
    otrosIngresosGasto: source.otros_ingresos_gasto,
    otrosIngresosUtilidad: source.otros_ingresos_utilidad,
    ingresoNeto: source.ingreso_neto,
    sumatoriaCuotas: source.sumatoria_cuotas,
    deudaTotal: source.deuda_total,
    numeroIfis: source.numero_ifis,
    apalancamiento: source.apalancamiento,
    capacidadEndeudamiento: source.capacidad_endeudamiento,
    boletaBasica: source.boleta_basica,
    boletaVariableMes1: source.boleta_variable_mes_1,
    boletaVariableMes2: source.boleta_variable_mes_2,
    boletaVariableMes3: source.boleta_variable_mes_3,
    gastoAlimentacion: source.gasto_alimentacion,
    gastoServicios: source.gasto_servicios,
    gastoEducacion: source.gasto_educacion,
    gastoMovilidad: source.gasto_movilidad,
    gastoImprevistos: source.gasto_imprevistos,
    totalGastoUnidad: source.total_gasto_unidad,
    gastoObligaciones: source.gasto_obligaciones,
    gastoOtrosEgresos: source.gasto_otros_egresos,
    criterioEntorno: source.criterio_entorno || NA,
    criterioDireccion: source.criterio_direccion || NA,
    criterioCapacidadPago: source.criterio_capacidad_pago || NA,
    criterioMoralPago: source.criterio_moral_pago || NA,
    criterioSituacionFinanciera: source.criterio_situacion_financiera || NA,
    criterioPlanInversion: source.criterio_plan_inversion || NA,
    criterioColaterales: source.criterio_colaterales || NA,
    criterioCondiciones: source.criterio_condiciones || NA,
    resolucionModificadaAt: source.resolucion_modificada_at,
    resolucionModificadaPor: source.resolucion_modificada_por,
  };
};
