import React, { useEffect, useMemo, useState } from 'react';
import { resolverExcepcionAdmision, updateEstado } from 'services/admisionService';
import { useAuth } from 'context/AuthContext';
import {
  ADMISION_COPY_COMMON,
  ADMISION_COPY_DETAIL_MODAL,
  ADMISION_COPY_EXCEPTION_MODAL,
} from 'utilities/pages/admision/copy';
import FinancialDecisionModal from './FinancialDecisionModal';
import AdmisionDetailHeader from './detail/AdmisionDetailHeader';
import AdmisionDetailTabs from './detail/AdmisionDetailTabs';
import AdmisionResumenTab from './detail/AdmisionResumenTab';
import AdmisionExcepcionesTab from './detail/AdmisionExcepcionesTab';
import AdmisionFinancieroTab from './detail/AdmisionFinancieroTab';
import AdmisionAuditoriaTab from './detail/AdmisionAuditoriaTab';
import AdmisionExportContent from './detail/AdmisionExportContent';
import { buildAdmisionViewModel } from '../../../../utilities/pages/admision/viewModel';

const AdmisionDetailModal = ({
  isOpen,
  onClose,
  loading = false,
  data = null,
  onUpdateSuccess,
}) => {
  const [activeTab, setActiveTab] = useState('resumen');
  const { checkPermission } = useAuth();
  const [currentData, setCurrentData] = useState(data);

  const [nuevoEstado, setNuevoEstado] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [financialComment, setFinancialComment] = useState('');
  const [showFinancialDecisionModal, setShowFinancialDecisionModal] = useState(false);
  const [financialDecisionError, setFinancialDecisionError] = useState('');

  const [exceptionComment, setExceptionComment] = useState('');
  const [resolvingAction, setResolvingAction] = useState(null);
  const [resolveExceptionError, setResolveExceptionError] = useState('');

  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('resumen');
      setNuevoEstado('');
      setUpdateError(null);
      setFinancialComment('');
      setFinancialDecisionError('');
      setShowFinancialDecisionModal(false);
      setExceptionComment('');
      setResolveExceptionError('');
      setResolvingAction(null);
    }
  }, [isOpen, data?.id]);

  const exportContainerId = 'admision-detail-export-content';

  const viewModel = useMemo(
    () => buildAdmisionViewModel(currentData),
    [currentData]
  );

  const exceptionState = Number(currentData?.excepcion_estado || 0);
  const hasExceptionDetected = Boolean(currentData?.excepcion_detectada);
  const hasExceptionPending = hasExceptionDetected && exceptionState === 1;
  const financialEnabled = !hasExceptionDetected || exceptionState === 2;

  const canManageState = checkPermission('admisiones.gestionar.estado');
  const canApproveException = checkPermission('admisiones.excepciones.aprobar');
  const canRejectException = checkPermission('admisiones.excepciones.rechazar');
  const canReviewExceptions = canApproveException || canRejectException;
  const isResolvingException = Boolean(resolvingAction);
  const isExceptionCommentEmpty = exceptionComment.trim() === '';

  const availableTabs = useMemo(
    () => ADMISION_COPY_DETAIL_MODAL.TABS.filter((tab) => tab.id !== 'financiero' || financialEnabled),
    [financialEnabled]
  );

  useEffect(() => {
    if (!financialEnabled && activeTab === 'financiero') {
      setActiveTab('excepciones');
    }
  }, [activeTab, financialEnabled]);

  const handleResolveException = async (accion) => {
    if (!viewModel.id) return;

    const comentario = exceptionComment.trim();
    if (!comentario) {
      setResolveExceptionError(ADMISION_COPY_EXCEPTION_MODAL.REVIEW.COMENTARIO_REQUERIDO);
      return;
    }

    setResolvingAction(accion);
    setResolveExceptionError('');

    try {
      const response = await resolverExcepcionAdmision(viewModel.id, { accion, comentario });
      setCurrentData(response?.data || currentData);
      setExceptionComment('');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      setResolveExceptionError(
        error?.response?.data?.details ||
        error?.response?.data?.message ||
        ADMISION_COPY_EXCEPTION_MODAL.REVIEW.ERROR_PROCESAR
      );
    } finally {
      setResolvingAction(null);
    }
  };

  const handleOpenFinancialDecision = () => {
    if (!nuevoEstado) return;
    setFinancialDecisionError('');
    setShowFinancialDecisionModal(true);
  };

  const handleGuardarEstado = async () => {
    if (!nuevoEstado || !viewModel.id) return;

    const comentario = financialComment.trim();
    if (!comentario) {
      setFinancialDecisionError(ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.COMENTARIO_REQUERIDO);
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setFinancialDecisionError('');

    try {
      const payload = {
        estado: parseInt(nuevoEstado, 10),
        comentario_financiero: comentario,
      };

      const response = await updateEstado(viewModel.id, payload);
      setCurrentData(response?.data || currentData);
      setShowFinancialDecisionModal(false);
      setFinancialComment('');
      setNuevoEstado('');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      const message = error?.response?.data?.details
        || error?.response?.data?.message
        || ADMISION_COPY_EXCEPTION_MODAL.FINANCIAL.ERROR_PROCESAR;
      setUpdateError(message);
      setFinancialDecisionError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-fic-dark/80 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <AdmisionDetailHeader
          loading={loading}
          currentData={currentData}
          exportContainerId={exportContainerId}
          onClose={onClose}
        />

        <AdmisionDetailTabs
          tabs={availableTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="p-5 overflow-y-auto space-y-5 bg-white">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fic-red" />
            </div>
          ) : (
            <>
              {activeTab === 'resumen' && (
                <AdmisionResumenTab viewModel={viewModel} />
              )}

              {activeTab === 'excepciones' && (
                <AdmisionExcepcionesTab
                  viewModel={viewModel}
                  hasExceptionPending={hasExceptionPending}
                  canReviewExceptions={canReviewExceptions}
                  canRejectException={canRejectException}
                  canApproveException={canApproveException}
                  isResolvingException={isResolvingException}
                  isExceptionCommentEmpty={isExceptionCommentEmpty}
                  exceptionComment={exceptionComment}
                  resolveExceptionError={resolveExceptionError}
                  resolvingAction={resolvingAction}
                  onExceptionCommentChange={(value) => {
                    setExceptionComment(value);
                    setResolveExceptionError('');
                  }}
                  onResolveException={handleResolveException}
                />
              )}

              {activeTab === 'financiero' && (
                <AdmisionFinancieroTab
                  viewModel={viewModel}
                  canManageState={canManageState}
                  nuevoEstado={nuevoEstado}
                  isUpdating={isUpdating}
                  updateError={updateError}
                  onNuevoEstadoChange={setNuevoEstado}
                  onOpenFinancialDecision={handleOpenFinancialDecision}
                />
              )}

              {activeTab === 'auditoria' && (
                <AdmisionAuditoriaTab viewModel={viewModel} />
              )}
            </>
          )}

          <AdmisionExportContent
            exportContainerId={exportContainerId}
            currentData={currentData}
            viewModel={viewModel}
          />
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-fic-dark text-white font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase tracking-wide text-sm"
          >
            {ADMISION_COPY_COMMON.ACTIONS.CERRAR}
          </button>
        </div>
      </div>

      <FinancialDecisionModal
        isOpen={showFinancialDecisionModal}
        loading={isUpdating}
        decision={nuevoEstado}
        comment={financialComment}
        error={financialDecisionError}
        onCommentChange={(value) => {
          setFinancialComment(value);
          setFinancialDecisionError('');
        }}
        onClose={() => {
          if (isUpdating) return;
          setShowFinancialDecisionModal(false);
          setFinancialDecisionError('');
        }}
        onConfirm={handleGuardarEstado}
      />
    </div>
  );
};

export default AdmisionDetailModal;