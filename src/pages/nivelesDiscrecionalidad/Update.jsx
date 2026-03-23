import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import NivelDiscrecionalidadForm from 'components/Shared/Formularios/NivelDiscrecionalidad/NivelDiscrecionalidadForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { showNivelDiscrecionalidad, updateNivelDiscrecionalidad } from 'services/nivelDiscrecionalidadService';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await showNivelDiscrecionalidad(id);
        const nivel = response.data || response;

        setFormData({
          tipo_evaluacion: nivel.tipo_evaluacion || 'CONSUMO',
          rol_autorizador_id: nivel.rol_autorizador_id ? String(nivel.rol_autorizador_id) : '',
          rol_autorizador_nombre: nivel.rol_autorizador?.nombre || '',
          monto_min: nivel.monto_min !== undefined && nivel.monto_min !== null ? String(nivel.monto_min) : '',
          monto_max: nivel.monto_max !== undefined && nivel.monto_max !== null ? String(nivel.monto_max) : '',
          cuotas_min: nivel.cuotas_min !== undefined && nivel.cuotas_min !== null ? String(nivel.cuotas_min) : '',
          cuotas_max: nivel.cuotas_max !== undefined && nivel.cuotas_max !== null ? String(nivel.cuotas_max) : '',
          tasa_min: nivel.tasa_min !== undefined && nivel.tasa_min !== null ? String(nivel.tasa_min) : '',
          tasa_max: nivel.tasa_max !== undefined && nivel.tasa_max !== null ? String(nivel.tasa_max) : '',
          estado: nivel.estado ? '1' : '0',
        });
      } catch (error) {
        setAlert(handleApiError(error, 'No se pudo cargar el nivel de discrecionalidad.'));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

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
      await updateNivelDiscrecionalidad(id, {
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

      setAlert({ type: 'success', message: 'Nivel de discrecionalidad actualizado correctamente.' });
      setTimeout(() => navigate('/niveles-discrecionalidad/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al actualizar el nivel de discrecionalidad.'));
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
        title="Editar Nivel de Discrecionalidad"
        subtitle={`Actualizando rol: ${formData.rol_autorizador_nombre || 'Sin rol'}`}
        icon={PencilSquareIcon}
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

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/niveles-discrecionalidad/listar')}
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