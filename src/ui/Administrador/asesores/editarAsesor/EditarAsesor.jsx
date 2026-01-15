import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAsesor, updateAsesor } from 'services/asesorService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import DatosAsesorForm from '../components/formularios/DatosAsesorForm';
import CuentaAsesorForm from '../components/formularios/CuentaAsesorForm';

const cleanNulls = (obj) => {
  if (!obj) return {};
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => {
    if (newObj[key] === null) newObj[key] = '';
  });
  return newObj;
};

const EditarAsesor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
      datos_empleado: { 
          nombre: '', 
          apellidoPaterno: '', 
          apellidoMaterno: '', 
          dni: '', 
          fechaNacimiento: '',
          sexo: '',
          estadoCivil: '',
          direccion: '',
          telefono: ''
      },
      asesor: { 
          username: '', 
          password: '', 
          password_confirmation: '', 
          sede_id: '' 
      }
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showAsesor(id);
        
        const { datos_empleado, username, sede_id } = response.data; 
        
        setFormData({
            datos_empleado: cleanNulls(datos_empleado),
            asesor: { 
                username: username || '', 
                sede_id: sede_id || '', 
                password: '', 
                password_confirmation: '' 
            }
        });
      } catch (err) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información del asesor.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      await updateAsesor(id, formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Asesor actualizado correctamente' 
      });
      
      setTimeout(() => navigate('/admin/listar-asesores'), 1500);
      
    } catch (err) {
       setAlert(handleApiError(err, 'Error al actualizar el asesor'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-black text-slate-800 mb-6 uppercase tracking-tighter">
        Editando Asesor: <span className="text-fic-red">{formData.datos_empleado.nombre} {formData.datos_empleado.apellidoPaterno} {formData.datos_empleado.apellidoMaterno}</span>
      </h1>
      
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Datos Personales y de Contacto (Unificados en el nuevo DatosAsesorForm) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 border-t-4 border-fic-yellow">
            <DatosAsesorForm data={formData.datos_empleado} handleChange={(e) => handleChange(e, 'datos_empleado')} />
        </div>

        {/* Cuenta de Usuario */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 border-t-4 border-slate-400 max-w-2xl">
            <CuentaAsesorForm data={formData.asesor} handleChange={(e) => handleChange(e, 'asesor')} isEdit={true} />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button 
            type="button" 
            onClick={() => navigate('/admin/listar-asesores')} 
            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-2 bg-fic-red text-white rounded-lg hover:bg-red-700 font-black uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarAsesor;