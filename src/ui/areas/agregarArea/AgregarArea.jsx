import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createArea } from 'services/areaService';
import AreaForm from '../components/AreaForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { Squares2X2Icon } from '@heroicons/react/24/outline';

const AgregarArea = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    area: { nombre_area: '', descripcion: '' }
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
      const response = await createArea(formData);
      setAlert({ type: 'success', message: response.message || 'Área registrada exitosamente.' });
      setTimeout(() => navigate('/areas/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar el área'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Nueva Área"
        subtitle="Gestión de áreas internas"
        icon={Squares2X2Icon}
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

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Registrar Área'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgregarArea;