import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { useAuth } from 'context/AuthContext';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import AvalModal from './modals/AvalModal';
import SelectAdmisionModal from './modals/SelectAdmisionModal';
import EncabezadoSection from './sections/EncabezadoSection';
import DatosGeneralesSection from './sections/DatosGeneralesSection';
import PlanInversionSection from './sections/PlanInversionSection';
import GarantiasSolicitanteSection from './sections/GarantiasSolicitanteSection';
import ProductoSection from './sections/ProductoSection';
import DiscrecionalidadSection from './sections/DiscrecionalidadSection';
import IngresosPrincipalesSection from './sections/IngresosPrincipalesSection';
import OtrosIngresosSection from './sections/OtrosIngresosSection';
import ResumenDatosSection from './sections/ResumenDatosSection';
import AnalisisSobreendeudamientoSection from './sections/AnalisisSobreendeudamientoSection';
import BoletasSection from './sections/BoletasSection';
import GastosUnidadFamiliarSection from './sections/GastosUnidadFamiliarSection';
import CriteriosSection from './sections/CriteriosSection';
import AvalSection from './sections/AvalSection';
import HistorialInternoSection from './sections/HistorialInternoSection';
import HistorialExternoSection from './sections/HistorialExternoSection';
import ExcepcionesSection from './sections/ExcepcionesSection';
import useEvaluacionConsumoForm from '../hooks/useEvaluacionConsumoForm';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import { evaluateFinancialLimits } from 'utilities/pages/evaluacion/consumo/calculations';
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
    handleGarantiaChange,
    addGarantiaRow,
    removeGarantiaRow,
    toggleGarantiaDireccion,
    catalogos,
    admisiones,
    admisionesLoading,
    admisionesError,
    selectedProductoRange,
    selectedNivelDiscrecionalidad,
    contexto,
    contextLoading,
    showAdmisionPicker,
    setShowAdmisionPicker,
    handleOpenAdmisionPicker,
    isEditMode,
    isReadonly,
    canEdit,
    handleSelectAdmision,
    handleIngresoChange,
    addIngresoRow,
    removeIngresoRow,
    showBoletasSection,
    dependienteFormalTipoIngresoIds,
    handleSubmit,
    totals,
    otrosIngresosLimit,
    avalGroups,
    avalModalState,
    openAvalModal,
    closeAvalModal,
    cancelAvalModalExit,
    confirmAvalModalExit,
    markAvalModalDirty,
    applyAvalModalDraft,
  } = useEvaluacionConsumoForm({
    id: mode === 'update' ? id : null,
    navigate,
    checkPermission,
  });

  const token = jwtUtils.getAccessTokenFromCookie();
  const authDisplayUser = {
    ...user,
    sede: { nombre: jwtUtils.getNombreSede(token) || 'N/A' },
  };
  const hasAvalesActivos = avalGroups.length > 0;
  const activeAvalGroup = avalGroups.find((group) => group.slot === avalModalState.activeAvalSlot) || null;
  const financialBlockMessage = useMemo(() => {
    const financialLimits = evaluateFinancialLimits(form);

    return financialLimits.ingresoNetoInvalido
      ? EVAL_CONSUMO_COPY.FORM.FINANCIAL_BLOCK.INGRESO_NETO
      : financialLimits.apalancamientoExcedido
        ? EVAL_CONSUMO_COPY.FORM.FINANCIAL_BLOCK.APALANCAMIENTO
        : financialLimits.capacidadEndeudamientoExcedida
          ? EVAL_CONSUMO_COPY.FORM.FINANCIAL_BLOCK.CAPACIDAD_ENDEUDAMIENTO
          : '';
  }, [form]);

  const sectionNumbers = useMemo(() => {
    let currentSection = 1;

    return {
      encabezado: currentSection++,
      datosGenerales: currentSection++,
      producto: currentSection++,
      planInversion: currentSection++,
      discrecionalidad: currentSection++,
      ingresosPrincipales: currentSection++,
      boletas: showBoletasSection ? currentSection++ : null,
      otrosIngresos: currentSection++,
      gastosUnidadFamiliar: currentSection++,
      resumenDatos: currentSection++,
      criterios: currentSection++,
      garantias: currentSection++,
      aval: hasAvalesActivos ? currentSection++ : null,
      historialInterno: contexto?.historial_interno?.visible ? currentSection++ : null,
      historialExterno: currentSection++,
      excepciones: (contexto?.excepciones?.length ?? 0) > 0 ? currentSection++ : null,
      analisisSobreendeudamiento: currentSection++,
    };
  }, [
    contexto?.excepciones?.length,
    contexto?.historial_interno?.visible,
    hasAvalesActivos,
    showBoletasSection,
  ]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader
        title={isEditMode ? EVAL_CONSUMO_COPY.TITLES.UPDATE : EVAL_CONSUMO_COPY.TITLES.STORE}
        subtitle={EVAL_CONSUMO_COPY.FORM.SUBTITLE}
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
          onOpenAdmisionPicker={handleOpenAdmisionPicker}
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

        <GastosUnidadFamiliarSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          sectionNumber={sectionNumbers.gastosUnidadFamiliar}
        />

        <ResumenDatosSection
          form={form}
          sectionNumber={sectionNumbers.resumenDatos}
        />

        <CriteriosSection
          form={form}
          disabled={isReadonly}
          setField={setField}
          sectionNumber={sectionNumbers.criterios}
        />

        <GarantiasSolicitanteSection
          form={form}
          disabled={isReadonly}
          catalogos={catalogos}
          onGarantiaChange={handleGarantiaChange}
          onAddGarantia={addGarantiaRow}
          onRemoveGarantia={removeGarantiaRow}
          onToggleDireccionSolicitante={toggleGarantiaDireccion}
          onEditAval={openAvalModal}
          avalGroups={avalGroups}
          sectionNumber={sectionNumbers.garantias}
        />

        {hasAvalesActivos ? (
          <AvalSection
            avalGroups={avalGroups}
            onEditAval={openAvalModal}
            sectionNumber={sectionNumbers.aval}
          />
        ) : null}

        <HistorialInternoSection contexto={contexto} loading={contextLoading} sectionNumber={sectionNumbers.historialInterno} />

        <HistorialExternoSection contexto={contexto} loading={contextLoading} sectionNumber={sectionNumbers.historialExterno} />

        <ExcepcionesSection contexto={contexto} sectionNumber={sectionNumbers.excepciones} />

        <AnalisisSobreendeudamientoSection
          form={form}
          sectionNumber={sectionNumbers.analisisSobreendeudamiento}
        />

        <div className="flex flex-wrap justify-end gap-3">
          {financialBlockMessage ? (
            <div className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {financialBlockMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => navigate('/evaluacion/consumo/listar')}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold uppercase rounded hover:bg-slate-200"
          >
            {EVAL_CONSUMO_COPY.COMMON.CANCELAR}
          </button>

          {canEdit && (
            <button
              type="submit"
              disabled={saving || Boolean(financialBlockMessage)}
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
        loading={admisionesLoading}
        error={admisionesError}
        onSelect={handleSelectAdmision}
      />

      <AvalModal
        isOpen={avalModalState.isOpen}
        onClose={closeAvalModal}
        group={activeAvalGroup}
        disabled={isReadonly}
        catalogos={catalogos}
        onApplyDraft={applyAvalModalDraft}
        onDirtyChange={markAvalModalDirty}
        openReason={avalModalState.openReason}
        dirtyState={avalModalState.dirtyState}
        exitConfirmOpen={avalModalState.exitConfirmOpen}
        onCancelExit={cancelAvalModalExit}
        onConfirmExit={confirmAvalModalExit}
      />
    </div>
  );
};

export default EvaluacionConsumoFormPage;
