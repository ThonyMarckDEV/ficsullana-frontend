import { useCallback, useMemo, useState } from 'react';
import { createProspecto } from 'services/prospectoService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { buildAddressLine } from 'utilities/addressFormatter';
import {
  ADDRESS_FIELD_KEYS,
  buildInitialFormData,
  buildInitialTouched,
  getMinBirthDate,
  getMaxBirthDate,
  getProspectoExceptionMessages,
  hasAnyError,
  isDirtyForm,
  validateProspectoForm,
} from './prospectoFormValidation';

const toUpper = (value = '') => String(value).toUpperCase();

const useProspectoForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState(buildInitialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [touched, setTouched] = useState(buildInitialTouched);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const documentoLength = formData.esCarnetExtranjeria ? 9 : 8;
  const maxBirthDate = useMemo(() => getMaxBirthDate(), []);
  const minBirthDate = useMemo(() => getMinBirthDate(), []);

  const validationErrors = useMemo(
    () => validateProspectoForm(formData, documentoLength, maxBirthDate, minBirthDate),
    [formData, documentoLength, maxBirthDate, minBirthDate]
  );
  const exceptionMessages = useMemo(
    () => getProspectoExceptionMessages(formData, maxBirthDate, minBirthDate),
    [formData, maxBirthDate, minBirthDate]
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
      fecha_caducidad_dni: true,
      prospecto_direccion: Object.fromEntries(ADDRESS_FIELD_KEYS.map((key) => [key, true])),
      prospecto_contacto: { celular: true, correo: true },
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

  const handleCorreoBlur = useCallback(() => {
    setTouched((prev) => ({
      ...prev,
      prospecto_contacto: {
        ...prev.prospecto_contacto,
        correo: true,
      },
    }));
  }, []);

  const handleCorreoChange = useCallback((e) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      prospecto_contacto: {
        ...prev.prospecto_contacto,
        correo: value,
      },
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setAlert(null);
    markAllTouched();

    if (formHasErrors) {
      setAlert({ type: 'warning', message: 'Completa correctamente todos los campos obligatorios.' });
      return;
    }

    setLoading(true);

    const celular = String(formData.prospecto_contacto.celular || '').trim();
    const correo = String(formData.prospecto_contacto.correo || '').trim().toLowerCase();
    const payload = {
      ...formData,
      nombres: toUpper(formData.nombres),
      apellido_paterno: toUpper(formData.apellido_paterno),
      apellido_materno: toUpper(formData.apellido_materno),
      fecha_caducidad_dni: formData.fecha_caducidad_dni,
      prospecto_direccion: {
        ...Object.fromEntries(
          Object.entries(formData.prospecto_direccion).map(([key, val]) => [key, toUpper(val)])
        ),
        direccion: toUpper(buildAddressLine(formData.prospecto_direccion)),
      },
      prospecto_contacto: {
        celular,
        correo: correo || null,
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
  }, [formData, formHasErrors, markAllTouched, onClose, onSuccess, resetForm]);

  return {
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
  };
};

export default useProspectoForm;