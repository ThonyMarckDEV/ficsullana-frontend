import React, { useEffect, useMemo, useState } from 'react';
import {
  BanknotesIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  HashtagIcon,
} from '@heroicons/react/24/outline';
import { resolveProductoConfiguracion } from 'utilities/productos';
import {
  MetaChip,
  MetricCard,
  StatusBadge,
  TabBar,
} from './detail/DetailUiBlocks';
import {
  AvalesSection,
  CriteriosSection,
  ExcepcionesDetailSection,
  FinanzasSection,
  GarantiasSection,
  HistorialSection,
  ResumenSection,
} from './detail/EvaluacionConsumoDetailSections';
import EvaluacionConsumoDecisionTab from './detail/EvaluacionConsumoDecisionTab';
import {
  formatDateOrNA,
  moneyOrNA,
  percentOrNA,
  textOrNA,
} from './detail/detailFormatters';

const EvaluacionConsumoDetailContent = ({
  data,
  showDecisionTab = false,
  canObserve = false,
  canApprove = false,
  canReject = false,
  onDecisionSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('resumen');

  const productoRange = useMemo(() => resolveProductoConfiguracion(data?.producto, {
    tipoFrecuencia: data?.tipo_frecuencia,
    monto: data?.monto,
    numeroCuotas: data?.numero_cuotas,
  }), [data?.producto, data?.tipo_frecuencia, data?.monto, data?.numero_cuotas]);

  const ingresos = Array.isArray(data?.ingresos) ? data.ingresos : [];
  const garantiasSolicitante = Array.isArray(data?.garantias_solicitante) ? data.garantias_solicitante : [];
  const avales = Array.isArray(data?.avales) ? data.avales : [];
  const excepciones = data?.contexto?.excepciones || [];
  const hasHistorialInterno = Boolean(data?.contexto?.historial_interno?.visible);
  const hasHistorialExterno = Boolean(
    (data?.contexto?.historial_externo?.deudas || []).length
    || (data?.contexto?.historial_externo?.protestos || []).length
  );

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'resumen', label: 'Resumen' },
      { id: 'garantias', label: `Garantías${garantiasSolicitante.length ? ` (${garantiasSolicitante.length})` : ''}` },
      { id: 'avales', label: `Avales${avales.length ? ` (${avales.length})` : ''}` },
      { id: 'finanzas', label: 'Evaluación de ingresos' },
      { id: 'criterios', label: 'Criterios' },
    ];

    if (hasHistorialInterno || hasHistorialExterno) {
      baseTabs.push({ id: 'historial', label: 'Historial crediticio' });
    }

    if (showDecisionTab) {
      baseTabs.push({ id: 'decision', label: 'Resolución de crédito' });
    }

    if (excepciones.length > 0) {
      baseTabs.push({ id: 'excepciones', label: `Excepciones (${excepciones.length})` });
    }

    return baseTabs;
  }, [
    avales.length,
    excepciones.length,
    garantiasSolicitante.length,
    hasHistorialExterno,
    hasHistorialInterno,
    showDecisionTab,
  ]);

  useEffect(() => {
    setActiveTab('resumen');
  }, [data?.id]);

  useEffect(() => {
    if (!tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'resumen');
    }
  }, [activeTab, tabs]);

  if (!data) return null;

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'garantias':
        return <GarantiasSection garantias={garantiasSolicitante} />;
      case 'avales':
        return <AvalesSection avales={avales} />;
      case 'finanzas':
        return <FinanzasSection data={data} ingresos={ingresos} />;
      case 'criterios':
        return <CriteriosSection data={data} />;
      case 'decision':
        return (
          <EvaluacionConsumoDecisionTab
            data={data}
            canObserve={canObserve}
            canApprove={canApprove}
            canReject={canReject}
            onDecisionSuccess={onDecisionSuccess}
          />
        );
      case 'historial':
        return <HistorialSection contexto={data?.contexto} />;
      case 'excepciones':
        return <ExcepcionesDetailSection contexto={data?.contexto} />;
      case 'resumen':
      default:
        return <ResumenSection data={data} productoRange={productoRange} />;
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge state={data?.estado} />
              <MetaChip label="Evaluación" value={`#${data?.id || 'N/A'}`} tone="slate" Icon={HashtagIcon} />
              <MetaChip label="Fecha" value={formatDateOrNA(data?.fecha_evaluacion, true)} tone="slate" Icon={CalendarDaysIcon} />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">{textOrNA(data?.solicitante_nombre_snapshot)}</h4>
              <p className="mt-1 text-sm text-slate-600">
                {textOrNA(data?.solicitante_dni_snapshot)} · {textOrNA(data?.sede?.nombre)} · {textOrNA(data?.usuario?.username)}
              </p>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 xl:w-[430px]">
            <MetricCard label="Monto" value={moneyOrNA(data?.monto)} tone="slate" Icon={BanknotesIcon} />
            <MetricCard label="Tasa propuesta" value={percentOrNA(data?.propuesta)} tone="slate" Icon={ChartBarSquareIcon} />
            <MetricCard label="N° cuotas" value={textOrNA(data?.numero_cuotas)} tone="slate" Icon={CalculatorIcon} />
            <MetricCard label="Valor cuota" value={moneyOrNA(data?.cuota)} tone="slate" Icon={BanknotesIcon} />
          </div>
        </div>
      </section>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        <div className="p-5 bg-white">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  );
};

export default EvaluacionConsumoDetailContent;
