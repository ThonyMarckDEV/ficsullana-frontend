import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import NivelDiscrecionalidadForm from 'components/Shared/Formularios/NivelDiscrecionalidad/NivelDiscrecionalidadForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { createNivelDiscrecionalidad } from 'services/nivelDiscrecionalidadService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const initialFormData = {
  tipo_evaluacion: 'CONSUMO',
  rol_autorizador_id: '',
  rol_autorizador_nombre: '',
  monto_min: '',
  monto_max: '',
  cuotas_min: '',
  cuotas_max: '',
  tasa_min: '',
  tasa_max: '',
  estado: '1',
};

const Store = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRolSelect = (rol) => {
    setFormData((prev) => ({
      ...prev,
      rol_autorizador_id: rol?.id ? String(rol.id) : '',
      rol_autorizador_nombre: rol?.nombre || '',
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await createNivelDiscrecionalidad({
        tipo_evaluacion: formData.tipo_evaluacion,
        rol_autorizador_id: Number(formData.rol_autorizador_id),
        monto_min: Number(formData.monto_min),
        monto_max: Number(formData.monto_max),
        cuotas_min: Number(formData.cuotas_min),
        cuotas_max: Number(formData.cuotas_max),
        tasa_min: Number(formData.tasa_min),
        tasa_max: Number(formData.tasa_max),
        estado: formData.estado === '1',
      });

      setAlert({ type: 'success', message: response.message || 'Nivel de discrecionalidad registrado correctamente.' });
      setTimeout(() => navigate('/niveles-discrecionalidad/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el nivel de discrecionalidad.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Nuevo Nivel de Discrecionalidad"
        subtitle="Reglas de autorización para evaluaciones"
        icon={ShieldCheckIcon}
        buttonText="← Volver al listado"
        buttonLink="/niveles-discrecionalidad/listar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <NivelDiscrecionalidadForm
            data={formData}
            handleChange={handleChange}
            onRolSelect={handleRolSelect}
          />

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Registrar Nivel'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Store;