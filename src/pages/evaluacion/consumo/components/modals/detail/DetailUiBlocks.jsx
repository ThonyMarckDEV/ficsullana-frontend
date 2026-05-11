import React from 'react';
import {
  DocumentTextIcon,
  HomeModernIcon,
  IdentificationIcon,
  MapPinIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import { Badge, InfoBlock } from 'pages/admision/components/Modals/detail/DetailShared';
import {
  EVALUACION_CONSUMO_BADGE_STYLES,
  formatEvaluacionConsumoState,
  normalizeEvaluacionConsumoState,
} from 'utilities/pages/evaluacion/consumo/status';
import {
  formatShortDateOrNA,
  moneyOrNA,
  textOrNA,
} from './detailFormatters';

const ACCENT_STYLES = {
  red: {
    label: 'text-fic-red',
    chip: 'border-slate-200 bg-white',
    panelBorder: 'border-slate-200',
    panelBg: 'bg-white',
    panelSoftBg: 'bg-slate-50',
    metricCard: 'border-slate-200 bg-white',
  },
  amber: {
    label: 'text-slate-600',
    chip: 'border-slate-200 bg-white',
    panelBorder: 'border-slate-200',
    panelBg: 'bg-white',
    panelSoftBg: 'bg-slate-50',
    metricCard: 'border-slate-200 bg-white',
  },
  orange: {
    label: 'text-slate-600',
    chip: 'border-slate-200 bg-white',
    panelBorder: 'border-slate-200',
    panelBg: 'bg-white',
    panelSoftBg: 'bg-slate-50',
    metricCard: 'border-slate-200 bg-white',
  },
  slate: {
    label: 'text-slate-600',
    chip: 'border-slate-200 bg-white',
    panelBorder: 'border-slate-200',
    panelBg: 'bg-white',
    panelSoftBg: 'bg-slate-50',
    metricCard: 'border-slate-200 bg-white',
  },
};

const resolveAccent = (tone = 'red') => ACCENT_STYLES[tone] || ACCENT_STYLES.red;

export const StatusBadge = ({ state }) => {
  const normalizedState = normalizeEvaluacionConsumoState(state);

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase ${
        EVALUACION_CONSUMO_BADGE_STYLES[normalizedState] || 'bg-slate-100 text-slate-700 border-slate-200'
      }`}
    >
      {formatEvaluacionConsumoState(normalizedState)}
    </span>
  );
};

export const MetricCard = ({ label, value, tone = 'red', Icon = Squares2X2Icon }) => {
  const accent = resolveAccent(tone);

  return (
    <div className={`rounded-lg border p-3 ${accent.metricCard}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accent.label}`} />
        <p className={`text-[10px] font-black uppercase ${accent.label}`}>{label}</p>
      </div>
      <p className="mt-2 break-words text-base font-black text-slate-900">{value}</p>
    </div>
  );
};

export const MetaChip = ({ label, value, tone = 'slate', Icon = Squares2X2Icon }) => {
  const accent = resolveAccent(tone);

  return (
    <div className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 ${accent.chip}`}>
      <Icon className={`h-4 w-4 ${accent.label}`} />
      <span className={`text-[10px] font-black uppercase ${accent.label}`}>{label}</span>
      <span className="text-xs font-bold text-slate-800">{value}</span>
    </div>
  );
};

export const InfoPanel = ({
  title,
  children,
  columns = 'md:grid-cols-2 xl:grid-cols-3',
  soft = false,
  accent = 'red',
  Icon = Squares2X2Icon,
}) => {
  const accentStyles = resolveAccent(accent);

  return (
    <div className={`rounded-lg border p-4 ${accentStyles.panelBorder} ${soft ? accentStyles.panelSoftBg : accentStyles.panelBg}`}>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accentStyles.label}`} />
        <p className={`text-xs font-black uppercase ${accentStyles.label}`}>{title}</p>
      </div>
      <div className={`grid grid-cols-1 gap-4 ${columns}`}>
        {children}
      </div>
    </div>
  );
};

export const TextPanel = ({ title, value, accent = 'orange', Icon = DocumentTextIcon }) => {
  const accentStyles = resolveAccent(accent);

  return (
    <div className={`rounded-lg border p-4 ${accentStyles.panelBorder} ${accentStyles.panelBg}`}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${accentStyles.label}`} />
        <p className={`text-xs font-black uppercase ${accentStyles.label}`}>{title}</p>
      </div>
      <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{textOrNA(value)}</p>
    </div>
  );
};

export const EmptyState = ({ message }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-600">
    {message}
  </div>
);

export const TabBar = ({ tabs, activeTab, onChange }) => (
  <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        onClick={() => onChange(tab.id)}
        className={`rounded-md border px-3 py-1.5 text-xs font-black uppercase transition-colors ${
          activeTab === tab.id
            ? 'border-fic-red bg-white text-fic-red'
            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const GarantiaCard = ({ garantia, index, titlePrefix = 'Garantía' }) => (
  <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-black uppercase text-slate-600">{titlePrefix} {index + 1}</p>
        <p className="mt-1 text-sm font-semibold text-slate-600">{textOrNA(garantia?.tipo_garantia)}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge label={textOrNA(garantia?.clase_garantia)} tone={garantia?.clase_garantia === 'AVAL' ? 'dark' : 'slate'} />
        <Badge label={textOrNA(garantia?.moneda?.nombre || garantia?.moneda_id)} tone="slate" />
      </div>
    </div>

    <InfoPanel title="Datos de garantía" columns="md:grid-cols-2 xl:grid-cols-4" soft accent="amber" Icon={ShieldCheckIcon}>
      <InfoBlock label="Garantía registrada" value={textOrNA(garantia?.garantia?.descripcion || garantia?.garantia_id)} />
      <InfoBlock label="Documento" value={textOrNA(garantia?.documento_garantia)} />
      <InfoBlock label="Monto garantías" value={moneyOrNA(garantia?.monto_garantias)} />
      <InfoBlock label="Valor comercial" value={moneyOrNA(garantia?.valor_comercial)} />
      <InfoBlock label="Valor realización" value={moneyOrNA(garantia?.valor_realizacion)} />
      <InfoBlock label="Ficha registral" value={textOrNA(garantia?.ficha_registral)} />
      <InfoBlock label="Fecha última evaluación" value={formatShortDateOrNA(garantia?.fecha_ultima_evaluacion)} />
      <InfoBlock label="Moneda" value={textOrNA(garantia?.moneda?.nombre || garantia?.moneda_id)} />
    </InfoPanel>

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <TextPanel title="Descripción" value={garantia?.descripcion} accent="orange" Icon={DocumentTextIcon} />
      <TextPanel title="Dirección" value={garantia?.direccion} accent="amber" Icon={MapPinIcon} />
    </div>
  </article>
);

export const AvalCard = ({ aval, index }) => {
  const garantias = Array.isArray(aval?.garantias) ? aval.garantias : [];

  return (
    <article className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
      <InfoPanel title="Identidad" columns="md:grid-cols-2 xl:grid-cols-4" soft accent="red" Icon={IdentificationIcon}>
        <InfoBlock label="DNI" value={textOrNA(aval?.numero_documento)} />
        <InfoBlock label="Nombres" value={textOrNA(aval?.nombres)} />
        <InfoBlock label="Apellido paterno" value={textOrNA(aval?.apellido_paterno)} />
        <InfoBlock label="Apellido materno" value={textOrNA(aval?.apellido_materno)} />
      </InfoPanel>

      <InfoPanel title="Contacto" columns="md:grid-cols-2" soft accent="slate" Icon={IdentificationIcon}>
        <InfoBlock label="Teléfono fijo" value={textOrNA(aval?.telefono_fijo)} />
        <InfoBlock label="Teléfono móvil" value={textOrNA(aval?.telefono_movil)} />
      </InfoPanel>

      <InfoPanel title="Domicilio" columns="md:grid-cols-2 xl:grid-cols-4" accent="orange" Icon={HomeModernIcon}>
        <InfoBlock label="Tipo de vía" value={textOrNA(aval?.tipoVia)} />
        <InfoBlock label="Nombre de vía" value={textOrNA(aval?.nombreVia)} />
        <InfoBlock label="N/Mz/Lt" value={textOrNA(aval?.numeroMzLt)} />
        <InfoBlock label="Urbanización" value={textOrNA(aval?.urbanizacion)} />
        <InfoBlock label="Departamento" value={textOrNA(aval?.departamento)} />
        <InfoBlock label="Provincia" value={textOrNA(aval?.provincia)} />
        <InfoBlock label="Distrito" value={textOrNA(aval?.distrito)} />
        <InfoBlock label="Referencia domiciliaria" value={textOrNA(aval?.referencia_domiciliaria)} />
        <InfoBlock label="Tipo de vivienda" value={textOrNA(aval?.tipo_vivienda)} />
      </InfoPanel>

      <section className="space-y-3">
        <div className="flex items-center gap-3">
          <p className="text-xs font-black uppercase text-slate-600">Garantías del aval</p>
        </div>

        {garantias.length > 0 ? (
          <div className="space-y-3">
            {garantias.map((garantia, garantiaIndex) => (
              <GarantiaCard
                key={garantia?.id || `${index + 1}-${garantiaIndex}`}
                garantia={garantia}
                index={garantiaIndex}
                titlePrefix="Garantía aval"
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Este aval no tiene garantías registradas." />
        )}
      </section>
    </article>
  );
};

export const IngresosTable = ({ ingresos }) => {
  if (!ingresos.length) {
    return <EmptyState message="No se registraron ingresos principales." />;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-600">
          <tr>
            <th className="px-4 py-3 text-left">Tipo ingreso</th>
            <th className="px-4 py-3 text-left">Ingreso</th>
            <th className="px-4 py-3 text-left">Veces sueldo</th>
            <th className="px-4 py-3 text-left">Monto máx. otorgar</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {ingresos.map((row, index) => (
            <tr key={row?.id || index} className="hover:bg-slate-50/70">
              <td className="px-4 py-3 text-slate-700">
                {textOrNA(row?.tipo_ingreso?.nombre || row?.tipo_ingreso?.descripcion || row?.tipo_ingreso_id)}
              </td>
              <td className="px-4 py-3 text-slate-700">{moneyOrNA(row?.ingreso)}</td>
              <td className="px-4 py-3 text-slate-700">{textOrNA(row?.veces_sueldo)}</td>
              <td className="px-4 py-3 text-slate-700">{moneyOrNA(row?.monto_maximo_otorgar)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
