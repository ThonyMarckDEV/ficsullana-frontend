import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEntidadFinanciera } from 'services/entidadFinancieraService';
import EntidadFinancieraForm from 'components/Shared/Formularios/EntidadFinanciera/EntidadFinancieraForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';

const AgregarEntidadFinanciera = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    entidad: { nombre: '', tipo: '', longitudes_cuenta: [], estado: true }
  });

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

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
      const response = await createEntidadFinanciera(formData);
      setAlert({ type: 'success', message: response.message || 'Entidad registrada exitosamente.' });
      setTimeout(() => navigate('/entidades-financieras/listar'), 1500);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar la entidad'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Nueva Entidad Financiera"
        subtitle="Gestión de bancos y cajas"
        icon={BuildingLibraryIcon}
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

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Registrar Entidad'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AgregarEntidadFinanciera;