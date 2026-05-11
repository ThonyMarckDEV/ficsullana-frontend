import React from 'react';
import {
  BanknotesIcon,
  BuildingOffice2Icon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  HomeModernIcon,
  MapPinIcon,
  ScaleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { InfoBlock } from 'pages/admision/components/Modals/detail/DetailShared';
import ExcepcionesSection from '../../sections/ExcepcionesSection';
import HistorialExternoSection from '../../sections/HistorialExternoSection';
import HistorialInternoSection from '../../sections/HistorialInternoSection';
import {
  AvalCard,
  EmptyState,
  GarantiaCard,
  InfoPanel,
  IngresosTable,
  TextPanel,
} from './DetailUiBlocks';
import {
  boolToYesNo,
  moneyOrNA,
  percentOrNA,
  textOrNA,
} from './detailFormatters';

const PoliticaProductoPanel = ({ data }) => {
  if (!data?.requiere_discrecionalidad) {
    return null;
  }

  return (
    <InfoPanel title="Discrecionalidad" columns="md:grid-cols-3" soft accent="amber" Icon={ChartBarSquareIcon}>
      <InfoBlock label="Tasa de interés" value={percentOrNA(data?.tasa_interes_solicitada || data?.propuesta)} />
      <InfoBlock
        label="Nivel"
        value={textOrNA(data?.nivel_discrecionalidad_resuelto?.rol_autorizador?.nombre || 'SIN REGLA APLICABLE')}
      />
      <InfoBlock label="Motivos" value={textOrNA(data?.motivos)} />
    </InfoPanel>
  );
};

export const ResumenSection = ({ data, productoRange }) => (
  <div className="space-y-4">
    <InfoPanel title="Operación" columns="md:grid-cols-2 xl:grid-cols-4" soft accent="amber" Icon={ChartBarSquareIcon}>
      <InfoBlock label="Moneda" value={textOrNA(data?.moneda?.nombre)} />
      <InfoBlock label="Monto" value={moneyOrNA(data?.monto)} />
      <InfoBlock label="Producto" value={textOrNA(data?.producto?.nombre)} />
      <InfoBlock label="Clase préstamo" value={textOrNA(data?.clase_prestamo_snapshot)} />
      <InfoBlock label="Frecuencia" value={textOrNA(data?.tipo_frecuencia)} />
      <InfoBlock label="Valor frecuencia" value={textOrNA(data?.valor_frecuencia)} />
      <InfoBlock label="N° cuotas" value={textOrNA(data?.numero_cuotas)} />
      <InfoBlock label="Rango tasa" value={textOrNA(productoRange?.label)} />
      <InfoBlock label="Tasa propuesta" value={percentOrNA(data?.propuesta)} />
      <InfoBlock label="Cuota" value={moneyOrNA(data?.cuota)} />
      <InfoBlock label="Tasa solicitada" value={percentOrNA(data?.tasa_interes_solicitada)} />
      <InfoBlock label="Expuesto RCC" value={boolToYesNo(Boolean(data?.expuesto_rcc))} />
    </InfoPanel>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <TextPanel title="Plan de inversión" value={data?.plan_inversion} accent="orange" Icon={DocumentTextIcon} />
      <TextPanel title="Dirección del solicitante" value={data?.direccion_snapshot} accent="amber" Icon={MapPinIcon} />
    </div>

    <PoliticaProductoPanel data={data} />

    <TextPanel title="Comentario de decisión" value={data?.decision_comentario} accent="orange" Icon={ShieldCheckIcon} />
  </div>
);

export const GarantiasSection = ({ garantias }) => (
  garantias.length > 0 ? (
    <div className="space-y-4">
      {garantias.map((garantia, index) => (
        <GarantiaCard key={garantia?.id || `solicitante-${index}`} garantia={garantia} index={index} />
      ))}
    </div>
  ) : (
    <EmptyState message="No se registraron garantías del solicitante." />
  )
);

export const AvalesSection = ({ avales }) => (
  avales.length > 0 ? (
    <div className="space-y-4">
      {avales.map((aval, index) => (
        <AvalCard key={aval?.id || aval?.aval_id || `aval-${index}`} aval={aval} index={index} />
      ))}
    </div>
  ) : (
    <EmptyState message="No se registraron avales." />
  )
);

export const FinanzasSection = ({ data, ingresos }) => (
  <div className="space-y-4">
    <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <BanknotesIcon className="h-4 w-4 text-fic-red" />
        <p className="text-xs font-black uppercase tracking-[0.08em] text-fic-red">Ingresos principales</p>
      </div>
      <IngresosTable ingresos={ingresos} />
    </div>

    <InfoPanel title="Totales de ingresos" columns="md:grid-cols-2 xl:grid-cols-4" accent="orange" Icon={BanknotesIcon}>
      <InfoBlock label="Ingreso total" value={moneyOrNA(data?.ingreso_total)} />
      <InfoBlock label="Monto máximo total" value={moneyOrNA(data?.monto_maximo_total)} />
      <InfoBlock label="Ingreso neto" value={moneyOrNA(data?.ingreso_neto)} />
      <InfoBlock label="Deuda total" value={moneyOrNA(data?.deuda_total)} />
    </InfoPanel>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <InfoPanel title="Otros ingresos" columns="md:grid-cols-2" accent="amber" Icon={ChartBarSquareIcon}>
        <InfoBlock label="Sector" value={textOrNA(data?.otros_ingresos_sector_snapshot)} />
        <InfoBlock label="Actividad" value={textOrNA(data?.otros_ingresos_actividad_snapshot || data?.otros_ingresos_tipo_negocio)} />
        <InfoBlock label="Margen máximo" value={percentOrNA(data?.otros_ingresos_margen_maximo_snapshot)} />
        <InfoBlock label="Ventas" value={moneyOrNA(data?.otros_ingresos_ventas)} />
        <InfoBlock label="Costo" value={moneyOrNA(data?.otros_ingresos_costo)} />
        <InfoBlock label="Gasto" value={moneyOrNA(data?.otros_ingresos_gasto)} />
        <InfoBlock label="Utilidad" value={moneyOrNA(data?.otros_ingresos_utilidad)} />
      </InfoPanel>

      <InfoPanel title="Análisis financiero" columns="md:grid-cols-2" soft accent="red" Icon={ScaleIcon}>
        <InfoBlock label="Sumatoria cuotas" value={moneyOrNA(data?.sumatoria_cuotas)} />
        <InfoBlock label="N° IFIS" value={textOrNA(data?.numero_ifis)} />
        <InfoBlock label="Apalancamiento" value={textOrNA(data?.apalancamiento)} />
        <InfoBlock label="Capacidad endeudamiento" value={percentOrNA(data?.capacidad_endeudamiento)} />
      </InfoPanel>
    </div>

    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <InfoPanel title="Boletas" columns="md:grid-cols-2" accent="orange" Icon={ClipboardDocumentListIcon}>
        <InfoBlock label="Boleta básica" value={moneyOrNA(data?.boleta_basica)} />
        <InfoBlock label="Variable mes 1" value={moneyOrNA(data?.boleta_variable_mes_1)} />
        <InfoBlock label="Variable mes 2" value={moneyOrNA(data?.boleta_variable_mes_2)} />
        <InfoBlock label="Variable mes 3" value={moneyOrNA(data?.boleta_variable_mes_3)} />
      </InfoPanel>

      <InfoPanel title="Gastos unidad familiar" columns="md:grid-cols-2" soft accent="amber" Icon={HomeModernIcon}>
        <InfoBlock label="Alimentación" value={moneyOrNA(data?.gasto_alimentacion)} />
        <InfoBlock label="Servicios" value={moneyOrNA(data?.gasto_servicios)} />
        <InfoBlock label="Educación" value={moneyOrNA(data?.gasto_educacion)} />
        <InfoBlock label="Movilidad" value={moneyOrNA(data?.gasto_movilidad)} />
        <InfoBlock label="Imprevistos" value={moneyOrNA(data?.gasto_imprevistos)} />
        <InfoBlock label="Total gasto unidad" value={moneyOrNA(data?.total_gasto_unidad)} />
        <InfoBlock label="Obligaciones" value={moneyOrNA(data?.gasto_obligaciones)} />
        <InfoBlock label="Otros egresos" value={moneyOrNA(data?.gasto_otros_egresos)} />
      </InfoPanel>
    </div>
  </div>
);

export const CriteriosSection = ({ data }) => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
    <TextPanel title="Entorno" value={data?.criterio_entorno} accent="red" Icon={BuildingOffice2Icon} />
    <TextPanel title="Dirección" value={data?.criterio_direccion} accent="amber" Icon={MapPinIcon} />
    <TextPanel title="Capacidad de pago" value={data?.criterio_capacidad_pago} accent="orange" Icon={BanknotesIcon} />
    <TextPanel title="Moral de pago" value={data?.criterio_moral_pago} accent="red" Icon={ShieldCheckIcon} />
    <TextPanel title="Situación financiera" value={data?.criterio_situacion_financiera} accent="amber" Icon={ChartBarSquareIcon} />
    <TextPanel title="Plan de inversión" value={data?.criterio_plan_inversion} accent="orange" Icon={DocumentTextIcon} />
    <TextPanel title="Colaterales" value={data?.criterio_colaterales} accent="red" Icon={HomeModernIcon} />
    <TextPanel title="Condiciones" value={data?.criterio_condiciones} accent="amber" Icon={ScaleIcon} />
  </div>
);

export const HistorialSection = ({ contexto }) => (
  <div className="space-y-4">
    <HistorialInternoSection contexto={contexto} />
    <HistorialExternoSection contexto={contexto} />
  </div>
);

export const ExcepcionesDetailSection = ({ contexto }) => (
  <ExcepcionesSection contexto={contexto} />
);
