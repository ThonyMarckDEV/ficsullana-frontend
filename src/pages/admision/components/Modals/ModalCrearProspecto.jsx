import React, { memo } from 'react';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import DireccionDomiciliariaFields from 'components/Shared/Formularios/DireccionDomiciliariaFields';
import { ADMISION_COPY_ALERTS } from 'utilities/pages/admision/copy';
import ProspectoPersonalSection from './prospecto/ProspectoPersonalSection';
import ProspectoContactoSection from './prospecto/ProspectoContactoSection';
import DiscardChangesConfirmModal from './prospecto/DiscardChangesConfirmModal';
import useProspectoForm from '../../../../utilities/pages/admision/useProspectoForm';

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-fic-red outline-none text-sm';
const labelClass = 'block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide';
const errorClass = 'text-[11px] text-red-600 mt-1';
const MemoDireccionDomiciliariaFields = memo(DireccionDomiciliariaFields);

const ModalCrearProspecto = ({ isOpen, onClose, onSuccess }) => {
  const {
    formData,
    loading,
    alert,
    touched,
    showCloseConfirm,
    documentoLength,
    maxBirthDate,
    minBirthDate,
    validationErrors,
    exceptionMessages,
    formHasErrors,
    setAlert,
    handleClose,
    handleCancelCloseConfirm,
    handleConfirmClose,
    handleBlur,
    handleChange,
    handleCarnetToggle,
    handleDireccionBlur,
    handleDireccionChange,
    handleCelularBlur,
    handleCelularChange,
    handleCorreoBlur,
    handleCorreoChange,
    handleSubmit,
  } = useProspectoForm({ onClose, onSuccess });

  const fieldClass = (hasError) => `${inputClass}${hasError ? ' border-red-500 focus:ring-red-500' : ''}`;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up">
        <div className="bg-fic-red p-4 flex justify-between items-center">
          <h3 className="text-white font-black uppercase tracking-wide">NUEVO PROSPECTO DE CLIENTE</h3>
          <button onClick={handleClose} className="text-white hover:bg-white/20 rounded-full p-1">
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />
          {exceptionMessages.length > 0 ? (
            <AlertMessage
              type="info"
              message={ADMISION_COPY_ALERTS.PROSPECTO.EXCEPCION_INFO}
              details={exceptionMessages}
            />
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <ProspectoPersonalSection
              formData={formData}
              touched={touched}
              validationErrors={validationErrors}
              documentoLength={documentoLength}
              minBirthDate={minBirthDate}
              maxBirthDate={maxBirthDate}
              labelClass={labelClass}
              errorClass={errorClass}
              fieldClass={fieldClass}
              onChange={handleChange}
              onBlur={handleBlur}
              onCarnetToggle={handleCarnetToggle}
            />

            <section className="space-y-4">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide border-b pb-2">2. Dirección</h4>
              <MemoDireccionDomiciliariaFields
                data={formData.prospecto_direccion}
                handleChange={handleDireccionChange}
                handleBlur={handleDireccionBlur}
                errors={validationErrors.prospecto_direccion}
                touched={touched.prospecto_direccion}
                inputClass={`${inputClass} uppercase`}
                labelClass={labelClass}
              />
            </section>

            <ProspectoContactoSection
              formData={formData}
              touched={touched}
              validationErrors={validationErrors}
              labelClass={labelClass}
              errorClass={errorClass}
              fieldClass={fieldClass}
              onCelularChange={handleCelularChange}
              onCelularBlur={handleCelularBlur}
              onCorreoChange={handleCorreoChange}
              onCorreoBlur={handleCorreoBlur}
            />

            <div className="pt-4 flex justify-end gap-3 border-t">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200 text-sm">
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={loading || formHasErrors}
                className="px-6 py-2 bg-fic-yellow text-fic-dark font-black uppercase rounded shadow hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Guardando...' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <DiscardChangesConfirmModal
        isOpen={showCloseConfirm}
        onCancel={handleCancelCloseConfirm}
        onConfirm={handleConfirmClose}
      />
    </div>
  );
};

export default ModalCrearProspecto;