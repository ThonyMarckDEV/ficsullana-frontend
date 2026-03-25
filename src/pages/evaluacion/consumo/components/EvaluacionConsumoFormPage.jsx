import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { useAuth } from 'context/AuthContext';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import SelectAdmisionModal from './modals/SelectAdmisionModal';
import EncabezadoSection from './sections/EncabezadoSection';
import DatosGeneralesSection from './sections/DatosGeneralesSection';
import PlanInversionSection from './sections/PlanInversionSection';
import ProductoSection from './sections/ProductoSection';
import DiscrecionalidadSection from './sections/DiscrecionalidadSection';
import IngresosPrincipalesSection from './sections/IngresosPrincipalesSection';
import OtrosIngresosSection from './sections/OtrosIngresosSection';
import ResumenDatosSection from './sections/ResumenDatosSection';
import AnalisisSobreendeudamientoSection from './sections/AnalisisSobreendeudamientoSection';
import BoletasSection from './sections/BoletasSection';
import GastosUnidadFamiliarSection from './sections/GastosUnidadFamiliarSection';
import CriteriosSection from './sections/CriteriosSection';
import HistorialInternoSection from './sections/HistorialInternoSection';
import HistorialExternoSection from './sections/HistorialExternoSection';
import ExcepcionesSection from './sections/ExcepcionesSection';
import DecisionSection from './sections/DecisionSection';
import useEvaluacionConsumoForm from '../hooks/useEvaluacionConsumoForm';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import jwtUtils from 'utilities/Token/jwtUtils';

const EvaluacionConsumoFormPage = ({ mode = 'store' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, checkPermission } = useAuth();

  const {
    loading,
    saving,
    alert,
    setAlert,
    form,
    setField,
    handleActividadNoSensibleSelect,
    catalogos,
    admisiones,
    selectedProductoRange,
    selectedNivelDiscrecionalidad,
    contexto,
    contextLoading,
    showAdmisionPicker,
    setShowAdmisionPicker,
    isEditMode,
    isReadonly,
    canEdit,
    canObserve,
    canApprove,
    canReject,
    handleSelectAdmision,
    handleIngresoChange,
    addIngresoRow,
    removeIngresoRow,
    showBoletasSection,
    dependienteFormalTipoIngresoIds,
    handleSubmit,
    handleDecision,
    totals,
    otrosIngresosLimit,
  } = useEvaluacionConsumoForm({
    id: mode === 'update' ? id : null,
    navigate,
    checkPermission,
  });

  if (loading) return <LoadingScreen />;

  const token = jwtUtils.getAccessTokenFromCookie();
  const authDisplayUser = {
    ...user,
    sede: { nombre: jwtUtils.getNombreSede(token) || 'N/A' },
  };

  let currentSection = 1;
  const sectionNumbers = {
    encabezado: currentSection++,
    datosGenerales: currentSection++,
    producto: currentSection++,
    planInversion: currentSection++,
    discrecionalidad: currentSection++,
    ingresosPrincipales: currentSection++,
    boletas: showBoletasSection ? currentSection++ : null,
    otrosIngresos: currentSection++,
    resumenDatos: currentSection++,
    analisisSobreendeudamiento: currentSection++,
    gastosUnidadFamiliar: currentSection++,
    criterios: currentSection++,
    historialInterno: contexto?.historial_interno?.visible ? currentSection++ : null,
    historialExterno: currentSection++,
    excepciones: (contexto?.excepciones?.length ?? 0) > 0 ? currentSection++ : null,
    decision: isEditMode ? currentSection++ : null,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={isEditMode ? EVAL_CONSUMO_COPY.TITLES.UPDATE : EVAL_CONSUMO_COPY.TITLES.STORE}
        subtitle="Formulario operativo de evaluación consumo"
        icon={ClipboardDocumentCheckIcon}
        buttonText={EVAL_CONSUMO_COPY.ACTIONS.VOLVER}
        buttonLink="/evaluacion/consumo/listar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <EncabezadoSection user={authDisplayUser} form={form} sectionNumber={sectionNumbers.encabezado} />

        <DatosGeneralesSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          catalogos={catalogos}
          canSelectAdmision={!isEditMode}
          onOpenAdmisionPicker={() => setShowAdmisionPicker(true)}
          sectionNumber={sectionNumbers.datosGenerales}
        />

        <ProductoSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          catalogos={catalogos}
          sectionNumber={sectionNumbers.producto}
        />

        <PlanInversionSection
          form={form}
          disabled={isReadonly || !form.producto_id}
          setField={setField}
          catalogos={catalogos}
          selectedProductoRange={selectedProductoRange}
          sectionNumber={sectionNumbers.planInversion}
        />

        <DiscrecionalidadSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          selectedNivelDiscrecionalidad={selectedNivelDiscrecionalidad}
          sectionNumber={sectionNumbers.discrecionalidad}
        />

        <IngresosPrincipalesSection
          form={form}
          disabled={isReadonly}
          totals={totals}
          catalogos={catalogos}
          onIngresoChange={handleIngresoChange}
          onAddIngreso={addIngresoRow}
          onRemoveIngreso={removeIngresoRow}
          dependienteFormalTipoIngresoIds={dependienteFormalTipoIngresoIds}
          sectionNumber={sectionNumbers.ingresosPrincipales}
        />

        {showBoletasSection ? (
          <BoletasSection
            form={form}
            disabled={isReadonly}
            setField={setField}
            sectionNumber={sectionNumbers.boletas}
          />
        ) : null}

        <OtrosIngresosSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          onActividadSelect={handleActividadNoSensibleSelect}
          otrosIngresosLimit={otrosIngresosLimit}
          sectionNumber={sectionNumbers.otrosIngresos}
        />

        <ResumenDatosSection
          form={form}
          sectionNumber={sectionNumbers.resumenDatos}
        />

        <AnalisisSobreendeudamientoSection form={form} sectionNumber={sectionNumbers.analisisSobreendeudamiento} />

        <GastosUnidadFamiliarSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          sectionNumber={sectionNumbers.gastosUnidadFamiliar}
        />

        <CriteriosSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          sectionNumber={sectionNumbers.criterios}
        />

        <HistorialInternoSection contexto={contexto} loading={contextLoading} sectionNumber={sectionNumbers.historialInterno} />

        <HistorialExternoSection contexto={contexto} loading={contextLoading} sectionNumber={sectionNumbers.historialExterno} />

        <ExcepcionesSection contexto={contexto} sectionNumber={sectionNumbers.excepciones} />

        {isEditMode ? (
          <DecisionSection
            sectionNumber={sectionNumbers.decision}
            currentState={form.estado}
            decisionComment={form.decision_comentario || ''}
            onDecisionCommentChange={(value) => setField('decision_comentario', value)}
            canObserve={canObserve}
            canApprove={canApprove}
            canReject={canReject}
            loading={saving}
            onDecision={handleDecision}
          />
        ) : null}

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/evaluacion/consumo/listar')}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-200"
          >
            Cancelar
          </button>

          {canEdit && (
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-fic-red text-white text-xs font-bold uppercase rounded hover:bg-red-700 disabled:opacity-50"
            >
              {saving
                ? 'Guardando...'
                : (isEditMode ? EVAL_CONSUMO_COPY.ACTIONS.ACTUALIZAR : EVAL_CONSUMO_COPY.ACTIONS.GUARDAR)}
            </button>
          )}
        </div>
      </form>

      <SelectAdmisionModal
        isOpen={showAdmisionPicker}
        onClose={() => setShowAdmisionPicker(false)}
        admisiones={admisiones}
        onSelect={handleSelectAdmision}
      />
    </div>
  );
};

export default EvaluacionConsumoFormPage;
