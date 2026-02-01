import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showEntidadFinanciera, updateEntidadFinanciera } from 'services/entidadFinancieraService';
import EntidadFinancieraForm from 'components/Shared/Formularios/EntidadFinanciera/EntidadFinancieraForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditarEntidadFinanciera = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await showEntidadFinanciera(id);
        const entidad = response.data || response;

        setFormData({
          entidad: {
            nombre: entidad.nombre || '',
            tipo: entidad.tipo || '',
            longitudes_cuenta: entidad.longitudes_cuenta || [],
            estado: entidad.estado ?? true,
          }
        });
      } catch (e) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información de la entidad.' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      await updateEntidadFinanciera(id, formData);
      setAlert({ type: 'success', message: 'Entidad actualizada correctamente.' });
      setTimeout(() => navigate('/entidades-financieras/listar'), 1500);
    } catch (err) {
      setAlert(handleApiError(err, 'Error al actualizar la entidad'));
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
        title="Editar Entidad Financiera"
        subtitle={`Actualizando: ${formData.entidad.nombre}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/entidades-financieras/listar"
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
            🏦 Datos de la Entidad
          </h2>
          <EntidadFinancieraForm data={formData.entidad} handleChange={handleChange} />

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/entidades-financieras/listar')}
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

export default EditarEntidadFinanciera;