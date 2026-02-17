import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import ModalCrearProspecto from '../components/Modals/ModalCrearProspecto';
import ExceptionSelectionModal from '../components/Modals/ExceptionSelectionModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { ADMISION_COPY_EXCEPTION_MODAL } from 'utilities/pages/admision/copy';
import useStoreAdmisionForm from '../hooks/useStoreAdmisionForm';
import StoreSolicitanteSection from '../components/Store/StoreSolicitanteSection';
import StoreFinancialSection from '../components/Store/StoreFinancialSection';

const Store = () => {
  const navigate = useNavigate();
  const { checkPermission } = useAuth();

  const {
    loading,
    alert,
    setAlert,
    isModalProspectoOpen,
    setIsModalProspectoOpen,
    showExceptionModal,
    setShowExceptionModal,
    exceptionReason,
    setExceptionReason,
    exceptionRules,
    exceptionSelectionMap,
    header,
    setHeader,
    clienteSelected,
    prospectoSelected,
    deudas,
    setDeudas,
    protestos,
    setProtestos,
    capitalPendienteFicsullana,
    capitalLoading,
    isSolicitanteSelected,
    handleTipoSolicitanteChange,
    onSelectCliente,
    onSelectProspecto,
    handleProspectoCreado,
    handleConfirmException,
    handleToggleExceptionRule,
    handleSubmit,
    getTipoPrestamoLabel,
  } = useStoreAdmisionForm({ navigate, checkPermission });

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-4 lg:p-6">
      <PageHeader
        title="Nueva Admisión"
        subtitle="Evaluación de historial financiero y capacidad crediticia"
        icon={ClipboardDocumentCheckIcon}
        buttonText="← Listado de Admisiones"
        buttonLink="/gestion/listar-admisiones"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <ModalCrearProspecto
        isOpen={isModalProspectoOpen}
        onClose={() => setIsModalProspectoOpen(false)}
        onSuccess={handleProspectoCreado}
      />

      <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto space-y-6">
        <StoreSolicitanteSection
          header={header}
          clienteSelected={clienteSelected}
          prospectoSelected={prospectoSelected}
          onTipoSolicitanteChange={handleTipoSolicitanteChange}
          onSelectCliente={onSelectCliente}
          onSelectProspecto={onSelectProspecto}
          onOpenProspectoModal={() => setIsModalProspectoOpen(true)}
          onObservacionesChange={(e) => setHeader((prev) => ({ ...prev, observaciones: e.target.value }))}
          getTipoPrestamoLabel={getTipoPrestamoLabel}
        />

        <StoreFinancialSection
          isSolicitanteSelected={isSolicitanteSelected}
          deudas={deudas}
          setDeudas={setDeudas}
          protestos={protestos}
          setProtestos={setProtestos}
          header={header}
          clienteSelected={clienteSelected}
          prospectoSelected={prospectoSelected}
          capitalPendienteFicsullana={capitalPendienteFicsullana}
          capitalLoading={capitalLoading}
          loading={loading}
          onCancel={() => navigate('/gestion/listar-admisiones')}
        />
      </form>

      <ExceptionSelectionModal
        isOpen={showExceptionModal}
        reason={exceptionReason}
        onReasonChange={setExceptionReason}
        rules={exceptionRules}
        selectionMap={exceptionSelectionMap}
        onToggleRule={handleToggleExceptionRule}
        onClose={() => setShowExceptionModal(false)}
        onConfirm={handleConfirmException}
        loading={loading}
        subtitle={ADMISION_COPY_EXCEPTION_MODAL.SELECTION.SUBTITLE}
      />
    </div>
  );
};

export default Store;