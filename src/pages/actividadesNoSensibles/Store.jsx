import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import ActividadNoSensibleForm from 'components/Shared/Formularios/ActividadNoSensible/ActividadNoSensibleForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { createActividadNoSensible } from 'services/actividadNoSensibleService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const Store = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    actividad_no_sensible: {
      sector: '',
      actividad: '',
      margen_maximo: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = name === 'sector' || name === 'actividad'
      ? value.toUpperCase()
      : value;

    setFormData((prev) => ({
      ...prev,
      actividad_no_sensible: {
        ...prev.actividad_no_sensible,
        [name]: normalizedValue,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await createActividadNoSensible(formData);
      setAlert({ type: 'success', message: response.message || 'Actividad no sensible registrada exitosamente.' });
      setTimeout(() => navigate('/actividades-no-sensibles/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar la actividad no sensible.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Nueva Actividad No Sensible"
        subtitle="Catalogo operativo para otros ingresos"
        icon={RectangleStackIcon}
        buttonText="← Volver al listado"
        buttonLink="/actividades-no-sensibles/listar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <ActividadNoSensibleForm data={formData.actividad_no_sensible} handleChange={handleChange} />

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Registrar Actividad'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Store;