import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import ActividadNoSensibleForm from 'components/Shared/Formularios/ActividadNoSensible/ActividadNoSensibleForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { showActividadNoSensible, updateActividadNoSensible } from 'services/actividadNoSensibleService';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await showActividadNoSensible(id);
        const actividadNoSensible = response.data || response;

        setFormData({
          actividad_no_sensible: {
            sector: (actividadNoSensible.sector || '').toUpperCase(),
            actividad: (actividadNoSensible.actividad || '').toUpperCase(),
            margen_maximo: actividadNoSensible.margen_maximo !== undefined && actividadNoSensible.margen_maximo !== null
              ? String(actividadNoSensible.margen_maximo)
              : '',
          },
        });
      } catch (error) {
        setAlert(handleApiError(error, 'No se pudo cargar la actividad no sensible.'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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
      await updateActividadNoSensible(id, formData);
      setAlert({ type: 'success', message: 'Actividad no sensible actualizada correctamente.' });
      setTimeout(() => navigate('/actividades-no-sensibles/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al actualizar la actividad no sensible.'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!formData) {
    return (
      <div className="container mx-auto p-6">
        <AlertMessage type="error" message="Error crítico" details="No se pudieron cargar los datos." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Actividad No Sensible"
        subtitle={`Actualizando: ${formData.actividad_no_sensible.actividad}`}
        icon={PencilSquareIcon}
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

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/actividades-no-sensibles/listar')}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-fic-yellow text-fic-dark px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-yellow-500 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Update;