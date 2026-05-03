import { useMemo } from 'react';
import {
  evaluateOtrosIngresosUtilidadLimit,
  recalculateIngresos,
  resolveNivelDiscrecionalidad,
} from 'utilities/pages/evaluacion/consumo/calculations';
import { buildAvalGroups } from 'utilities/pages/evaluacion/consumo/avalWorkflow';
import {
  findTipoIngresoIdsByKey,
  TIPO_INGRESO_KEYS,
} from 'utilities/pages/evaluacion/consumo/tipoIngreso';
import { resolveProductoConfiguracion } from 'utilities/productos';

const useEvaluacionConsumoSelectors = ({ form, catalogos, admisiones, canEdit }) => {
  const selectedAdmision = useMemo(
    () => admisiones.find((item) => Number(item.id) === Number(form.admision_id)) || null,
    [admisiones, form.admision_id]
  );

  const selectedProducto = useMemo(
    () => (catalogos.productos || []).find((item) => Number(item.id) === Number(form.producto_id)) || null,
    [catalogos.productos, form.producto_id]
  );

  const selectedProductoRange = useMemo(
    () => resolveProductoConfiguracion(selectedProducto, {
      tipoFrecuencia: form.tipo_frecuencia,
      monto: form.monto,
      numeroCuotas: form.numero_cuotas,
    }),
    [form.monto, form.numero_cuotas, form.tipo_frecuencia, selectedProducto]
  );

  const selectedNivelDiscrecionalidad = useMemo(
    () => resolveNivelDiscrecionalidad(catalogos.niveles_discrecionalidad || [], {
      tipoEvaluacion: 'CONSUMO',
      monto: form.monto,
      numeroCuotas: form.numero_cuotas,
      tasa: form.propuesta || form.tasa_interes_solicitada,
    }),
    [catalogos.niveles_discrecionalidad, form.monto, form.numero_cuotas, form.propuesta, form.tasa_interes_solicitada]
  );

  const dependienteFormalTipoIngresoIds = useMemo(
    () => new Set(findTipoIngresoIdsByKey(
      catalogos.tipos_ingreso || [],
      TIPO_INGRESO_KEYS.DEPENDIENTE_FORMAL
    )),
    [catalogos.tipos_ingreso]
  );

  const showBoletasSection = useMemo(
    () => (form.ingresos || []).some((row) => dependienteFormalTipoIngresoIds.has(Number(row?.tipo_ingreso_id))),
    [dependienteFormalTipoIngresoIds, form.ingresos]
  );

  const totals = useMemo(() => {
    const calc = recalculateIngresos(form.ingresos || []);
    return {
      ingresoTotal: calc.ingresoTotal,
      montoMaximoTotal: calc.montoMaximoTotal,
    };
  }, [form.ingresos]);

  const otrosIngresosLimit = useMemo(() => evaluateOtrosIngresosUtilidadLimit({
    ingresoTotalPrincipal: totals.ingresoTotal,
    utilidad: form.otros_ingresos_utilidad,
  }), [form.otros_ingresos_utilidad, totals.ingresoTotal]);

  const avalGroups = useMemo(() => buildAvalGroups({
    garantias: form.garantias || [],
    avales: form.avales || [],
    canEdit,
  }), [canEdit, form.avales, form.garantias]);

  return {
    selectedAdmision,
    selectedProducto,
    selectedProductoRange,
    selectedNivelDiscrecionalidad,
    dependienteFormalTipoIngresoIds,
    showBoletasSection,
    totals,
    otrosIngresosLimit,
    avalGroups,
  };
};

export default useEvaluacionConsumoSelectors;
