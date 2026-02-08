import React, { memo, useCallback, useMemo, useState } from 'react';
import { createProspecto } from 'services/prospectoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import DireccionDomiciliariaFields from 'components/Shared/Formularios/DireccionDomiciliariaFields';
import { buildAddressLine } from 'utilities/addressFormatter';
import {
  ADDRESS_FIELD_KEYS,
  buildInitialFormData,
  buildInitialTouched,
  getMaxBirthDate,
  hasAnyError,
  isDirtyForm,
  validateProspectoForm,
} from './prospectoFormValidation';

const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-fic-red outline-none text-sm';
const labelClass = 'block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide';
const errorClass = 'text-[11px] text-red-600 mt-1';
const MemoDireccionDomiciliariaFields = memo(DireccionDomiciliariaFields);

const toUpper = (value = '') => String(value).toUpperCase();

const ModalCrearProspecto = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(buildInitialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [touched, setTouched] = useState(buildInitialTouched);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const documentoLength = formData.esCarnetExtranjeria ? 9 : 8;
  const maxBirthDate = useMemo(() => getMaxBirthDate(), []);

  const validationErrors = useMemo(
    () => validateProspectoForm(formData, documentoLength, maxBirthDate),
    [formData, documentoLength, maxBirthDate]
  );
  const formHasErrors = useMemo(() => hasAnyError(validationErrors), [validationErrors]);
  const hasUnsavedChanges = useMemo(() => isDirtyForm(formData), [formData]);

  const resetForm = useCallback(() => {
    setFormData(buildInitialFormData());
    setTouched(buildInitialTouched());
    setAlert(null);
    setShowCloseConfirm(false);
  }, []);

  const markAllTouched = useCallback(() => {
    setTouched({
      dni: true,
      nombres: true,
      apellido_paterno: true,
      apellido_materno: true,
      fecha_nacimiento: true,
      prospecto_direccion: Object.fromEntries(ADDRESS_FIELD_KEYS.map((key) => [key, true])),
      prospecto_contacto: { celular: true },
    });
  }, []);

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges && !loading) {
      setShowCloseConfirm(true);
      return;
    }

    onClose();
    resetForm();
  }, [hasUnsavedChanges, loading, onClose, resetForm]);

  const handleCancelCloseConfirm = useCallback(() => {
    setShowCloseConfirm(false);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setShowCloseConfirm(false);
    onClose();
    resetForm();
  }, [onClose, resetForm]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === 'dni') {
      if (!/^\d*$/.test(value)) return;
      setFormData((prev) => ({ ...prev, dni: value }));
      return;
    }

    if (name === 'nombres' || name === 'apellido_paterno' || name === 'apellido_materno') {
      if (!/^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value)) return;
      setFormData((prev) => ({ ...prev, [name]: toUpper(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCarnetToggle = useCallback((e) => {
    const checked = e.target.checked;

    setFormData((prev) => {
      const nextDni = !checked && String(prev.dni || '').length > 8 ? String(prev.dni).slice(0, 8) : prev.dni;
      return {
        ...prev,
        esCarnetExtranjeria: checked,
        dni: nextDni,
      };
    });

    setTouched((prev) => ({ ...prev, dni: true }));
  }, []);

  const handleDireccionBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      prospecto_direccion: {
        ...prev.prospecto_direccion,
        [name]: true,
      },
    }));
  }, []);

  const handleDireccionChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      prospecto_direccion: {
        ...prev.prospecto_direccion,
        [name]: toUpper(value),
      },
    }));
  }, []);

  const handleCelularBlur = useCallback(() => {
    setTouched((prev) => ({
      ...prev,
      prospecto_contacto: {
        ...prev.prospecto_contacto,
        celular: true,
      },
    }));
  }, []);

  const handleCelularChange = useCallback((e) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value)) return;

    setFormData((prev) => ({
      ...prev,
      prospecto_contacto: {
        ...prev.prospecto_contacto,
        celular: value,
      },
    }));
  }, []);

  const fieldClass = (hasError) => `${inputClass}${hasError ? ' border-red-500 focus:ring-red-500' : ''}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    markAllTouched();

    if (formHasErrors) {
      setAlert({ type: 'warning', message: 'Completa correctamente todos los campos obligatorios.' });
      return;
    }

    setLoading(true);

    const celular = String(formData.prospecto_contacto.celular || '').trim();
    const payload = {
      ...formData,
      nombres: toUpper(formData.nombres),
      apellido_paterno: toUpper(formData.apellido_paterno),
      apellido_materno: toUpper(formData.apellido_materno),
      prospecto_direccion: {
        ...Object.fromEntries(
          Object.entries(formData.prospecto_direccion).map(([key, val]) => [key, toUpper(val)])
        ),
        direccion: toUpper(buildAddressLine(formData.prospecto_direccion)),
      },
      prospecto_contacto: {
        celular,
      },
    };

    try {
      const response = await createProspecto(payload);
      onSuccess(response.data);
      onClose();
      resetForm();
    } catch (error) {
      setAlert(handleApiError(error, 'Error al guardar prospecto'));
    } finally {
      setLoading(false);
    }
  };

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

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide border-b pb-2">1. Datos Personales</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>DNI / CE</label>
                  <input
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass(touched.dni && Boolean(validationErrors.dni))}
                    maxLength={documentoLength}
                    minLength={documentoLength}
                    placeholder={formData.esCarnetExtranjeria ? '9 DÍGITOS (CE)' : '8 DÍGITOS (DNI)'}
                    required
                  />
                  {touched.dni && validationErrors.dni ? <p className={errorClass}>{validationErrors.dni}</p> : null}
                  <label className="mt-2 inline-flex items-center gap-2 text-[11px] font-bold text-slate-600 cursor-pointer uppercase">
                    <input
                      type="checkbox"
                      name="esCarnetExtranjeria"
                      checked={Boolean(formData.esCarnetExtranjeria)}
                      onChange={handleCarnetToggle}
                      className="w-4 h-4 rounded text-fic-red focus:ring-fic-red"
                    />
                    Carnet de Extranjería (CE)
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Fecha de Nacimiento</label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={fieldClass(touched.fecha_nacimiento && Boolean(validationErrors.fecha_nacimiento))}
                    max={maxBirthDate}
                    required
                  />
                  {touched.fecha_nacimiento && validationErrors.fecha_nacimiento ? (
                    <p className={errorClass}>{validationErrors.fecha_nacimiento}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass}>Nombres</label>
                  <input
                    name="nombres"
                    value={formData.nombres}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${fieldClass(touched.nombres && Boolean(validationErrors.nombres))} uppercase`}
                    required
                  />
                  {touched.nombres && validationErrors.nombres ? <p className={errorClass}>{validationErrors.nombres}</p> : null}
                </div>

                <div>
                  <label className={labelClass}>Apellido Paterno</label>
                  <input
                    name="apellido_paterno"
                    value={formData.apellido_paterno}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${fieldClass(touched.apellido_paterno && Boolean(validationErrors.apellido_paterno))} uppercase`}
                    required
                  />
                  {touched.apellido_paterno && validationErrors.apellido_paterno ? (
                    <p className={errorClass}>{validationErrors.apellido_paterno}</p>
                  ) : null}
                </div>

                <div>
                  <label className={labelClass}>Apellido Materno</label>
                  <input
                    name="apellido_materno"
                    value={formData.apellido_materno}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`${fieldClass(touched.apellido_materno && Boolean(validationErrors.apellido_materno))} uppercase`}
                    required
                  />
                  {touched.apellido_materno && validationErrors.apellido_materno ? (
                    <p className={errorClass}>{validationErrors.apellido_materno}</p>
                  ) : null}
                </div>
              </div>
            </section>

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

            <section className="space-y-3">
              <h4 className="text-sm font-black text-slate-700 uppercase tracking-wide border-b pb-2">3. Contacto</h4>
              <div>
                <label className={labelClass}>Celular</label>
                <input
                  name="celular"
                  value={formData.prospecto_contacto.celular}
                  onChange={handleCelularChange}
                  onBlur={handleCelularBlur}
                  className={fieldClass(touched.prospecto_contacto.celular && Boolean(validationErrors.prospecto_contacto.celular))}
                  maxLength={9}
                  placeholder="9XXXXXXXX"
                  required
                />
                {touched.prospecto_contacto.celular && validationErrors.prospecto_contacto.celular ? (
                  <p className={errorClass}>{validationErrors.prospecto_contacto.celular}</p>
                ) : null}
              </div>
            </section>

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

      {showCloseConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 p-5 animate-fade-in-up">
            <h4 className="text-sm font-black uppercase text-slate-800 tracking-wide">Descartar Cambios</h4>
            <p className="text-sm text-slate-600 mt-2">
              Hay datos sin guardar. Si cierras, se perderá la información ingresada.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelCloseConfirm}
                className="px-3 py-2 text-xs font-bold uppercase rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirmClose}
                className="px-3 py-2 text-xs font-bold uppercase rounded bg-fic-red text-white hover:bg-red-700"
              >
                Descartar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalCrearProspecto;
