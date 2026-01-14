import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSede, updateSede } from 'services/sedeService';
import SedeForm from '../components/SedeForm';
import AdminForm from '../components/AdminForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const EditarSede = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await showSede(id);
        setFormData({
          sede: { 
            nombre: data.sede.nombre, 
            direccion: data.sede.direccion, 
            codigo_sunat: data.sede.codigo_sunat 
          },
          admin: { 
            nombre: data.admin.datos.nombre, 
            apellidoPaterno: data.admin.datos.apellidoPaterno, 
            dni: data.admin.datos.dni, 
            username: data.admin.username, 
            password: ''
          }
        });
      } catch (e) { 
        setAlert({ type: 'error', message: 'No se pudo cargar la información de la sede.' }); 
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
        const response = await updateSede(id, formData);
        setAlert({ 
            type: 'success', 
            message: response.message || 'Sede actualizada correctamente.' 
        });
        setTimeout(() => navigate('/superadmin/listar-sedes'), 1500);

      } catch (err) {
        setAlert(handleApiError(err, 'Error al actualizar la sede'));
      } finally { 
        setLoading(false); 
      }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-black text-fic-dark mb-6 border-b-2 border-fic-red pb-4">
        Editar Sede: <span className="text-slate-500">{formData?.sede.nombre}</span>
      </h1>
      
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARD 1: DATOS SEDE */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
                🏢 Datos de la Sede
            </h2>
            <SedeForm data={formData.sede} handleChange={handleChange} />
        </div>

        {/* CARD 2: DATOS ADMIN */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
            <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2 border-b pb-2">
                👤 Administrador Encargado
            </h2>
            <AdminForm data={formData.admin} handleChange={handleChange} isEdit={true} />
        </div>

        {/* BOTONES */}
        <div className="md:col-span-2 flex justify-end gap-4 mt-4">
          <button 
            type="button" 
            onClick={() => navigate('/superadmin/listar-sedes')} 
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
      </form>
    </div>
  );
};

export default EditarSede;