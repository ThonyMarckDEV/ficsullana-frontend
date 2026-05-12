import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExceptionSelectionModal from '../components/Modals/ExceptionSelectionModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import ConfirmModal from 'components/Shared/Modals/ConfirmModal';
import { useAuth } from 'context/AuthContext';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { ADMISION_COPY_EXCEPTION_MODAL } from 'utilities/pages/admision/copy';
import useUpdateAdmisionForm from '../hooks/useUpdateAdmisionForm';
import ExpedienteInfoCard from '../components/Update/ExpedienteInfoCard';
import UpdateConfigurationCard from '../components/Update/UpdateConfigurationCard';
import UpdateFinancialEvaluationCard from '../components/Update/UpdateFinancialEvaluationCard';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkPermission } = useAuth();
  const [submitConfirmOpen, setSubmitConfirmOpen] = useState(false);

  const {
    loading,
    alert,
    setAlert,
    showExceptionModal,
    setShowExceptionModal,
    exceptionReason,
    setExceptionReason,
    exceptionRules,
    exceptionSelectionMap,
    header,
    deudas,
    setDeudas,
    protestos,
    setProtestos,
    capitalPendienteFicsullana,
    capitalLoading,
    handleHeaderChange,
    handleSubmit,
    handleConfirmException,
    handleToggleExceptionRule,
  } = useUpdateAdmisionForm({ id, navigate, checkPermission });

  if (loading) return <LoadingScreen />;

  const tipoSolicitante = header.tipoPersona.includes('PROSPECTO') ? 'PROSPECTO' : 'CLIENTE';

  return (
    <div className="w-full px-4 lg:px-8 xl:px-12 py-6">
      <PageHeader
        title={`Editar Admisión #${id}`}
        subtitle={`Solicitante: ${header.solicitanteName}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/gestion/listar-admisiones"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitConfirmOpen(true);
        }}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-1 space-y-6">
          <ExpedienteInfoCard header={header} />
          <UpdateConfigurationCard
            header={header}
            onHeaderChange={handleHeaderChange}
          />
        </div>

        <div className="w-full">
          <UpdateFinancialEvaluationCard
            deudas={deudas}
            setDeudas={setDeudas}
            protestos={protestos}
            setProtestos={setProtestos}
            tipoPrestamo={header.tipo_prestamo}
            solicitanteDni={header.solicitanteDni}
            tipoSolicitante={tipoSolicitante}
            capitalPendienteFicsullana={capitalPendienteFicsullana}
            capitalLoading={capitalLoading}
            loading={loading}
          />
        </div>
        
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
        subtitle={ADMISION_COPY_EXCEPTION_MODAL.SELECTION.SUBTITLE_UPDATE}
      />

      {submitConfirmOpen ? (
        <ConfirmModal
          title="Actualizar admisión"
          message={`¿Deseas actualizar la admisión #${id}?`}
          confirmText="Actualizar"
          cancelText="Cancelar"
          onConfirm={async () => {
            setSubmitConfirmOpen(false);
            await handleSubmit({ preventDefault: () => {} });
          }}
          onCancel={() => setSubmitConfirmOpen(false)}
        />
      ) : null}
    </div>
  );
};

export default Update;
