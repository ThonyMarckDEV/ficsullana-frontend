import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showArea, updateArea } from 'services/areaService';
import AreaForm from '../components/AreaForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditarArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await showArea(id);
        const area = response.data || response;

        setFormData({
          area: {
            nombre_area: area.nombre_area || '',
            descripcion: area.descripcion || ''
          }
        });
      } catch (e) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información del área.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      area: { ...prev.area, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await updateArea(id, formData);
      setAlert({ type: 'success', message: 'Área actualizada correctamente.' });
      setTimeout(() => navigate('/areas/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar el área'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  if (!formData) {
    return (
      <div className="container mx-auto p-6">
        <AlertMessage
          type="error"
          message="Error crítico"
          details="No se pudieron cargar los datos."
        />
        <button onClick={() => navigate(-1)} className="mt-4 text-fic-red font-bold">Volver</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Editar Área"
        subtitle={`Actualizando: ${formData.area.nombre_area}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/areas/listar"
      />

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-4">
            🧩 Datos del Área
          </h2>
          <AreaForm data={formData.area} handleChange={handleChange} />

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/areas/listar')}
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

export default EditarArea;