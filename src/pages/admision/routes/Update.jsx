import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ExceptionSelectionModal from '../components/Modals/ExceptionSelectionModal';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
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
    estados,
  } = useUpdateAdmisionForm({ id, navigate, checkPermission });

  if (loading) return <LoadingScreen />;

  const tipoSolicitante = header.tipoPersona.includes('PROSPECTO') ? 'PROSPECTO' : 'CLIENTE';

  return (
    <div className="w-full px-4 lg:px-8 xl:px-12 2xl:px-16 py-6">
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

      <form onSubmit={handleSubmit} className="w-full max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <ExpedienteInfoCard header={header} />
          <UpdateConfigurationCard
            header={header}
            estados={estados}
            onHeaderChange={handleHeaderChange}
          />
        </div>

        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
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
    </div>
  );
};

export default Update;