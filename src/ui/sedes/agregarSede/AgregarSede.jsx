import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSede } from 'services/sedeService';
import SedeForm from 'components/Shared/Formularios/Sede/SedeForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler'; 
import PageHeader from 'components/Shared/Headers/PageHeader';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

const AgregarSede = () => {
  const navigate = useNavigate();
  
  // Solo mantenemos el objeto sede
  const [formData, setFormData] = useState({
    sede: { nombre: '', direccion: '', codigo_sunat: '' }
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Actualizamos directamente el objeto sede
    setFormData(prev => ({ 
        ...prev, 
        sede: { ...prev.sede, [name]: value } 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await createSede(formData);
      
      setAlert({
        type: 'success',
        message: response.message || 'Sede registrada exitosamente.'
      });
      
      // Ajusta la ruta de redirección según tus rutas definidas en App.jsx
      setTimeout(() => navigate('/sedes/listar'), 2000);

    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar la sede'));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-6">

      <PageHeader 
        title="Apertura de Sede"
        subtitle="Configuración de nueva unidad de negocio"
        icon={BuildingOffice2Icon}
        buttonText="← Volver al listado"
        buttonLink="/sedes/listar"
      />

      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        
        {/* Card Sede (Ahora ocupa todo el ancho disponible) */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2 border-b pb-4">
                🏢 Datos de la Nueva Sede
            </h2>
            <SedeForm data={formData.sede} handleChange={handleChange} />
            
            <div className="mt-8 flex justify-end">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Guardando...' : 'Registrar Sede'}
                </button>
            </div>
        </div>

      </form>
    </div>
  );
};

export default AgregarSede;