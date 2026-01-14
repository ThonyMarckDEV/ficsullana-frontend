import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAsesor, updateAsesor } from 'services/asesorService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';

import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import DatosAsesorForm from '../components/formularios/DatosAsesorForm';
import CuentaAsesorForm from '../components/formularios/CuentaAsesorForm';
import ContactosForm from '../components/formularios/ContactosAsesorForm';

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
      datos: { 
          nombre: '', 
          apellidoPaterno: '', 
          apellidoMaterno: '', 
          dni: '', 
          fechaNacimiento: '' 
      },
      asesor: { 
          username: '', 
          password: '', 
          password_confirmation: '', 
          sede_id: '' 
      },
      contactos: { 
          telefonoMovil: '', 
          telefonoFijo: '', 
          correo: '' 
      }
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showAsesor(id);
        
        const { datos, username, sede_id, contactos } = response.data; 

        const contactoData = (contactos && contactos.length > 0) 
            ? contactos[0] 
            : {}; 
        
        setFormData({
            datos: cleanNulls(datos),
            asesor: { 
                username: username || '', 
                sede_id: sede_id || '', 
                password: '', 
                password_confirmation: '' 
            },
            contactos: cleanNulls(contactoData) 
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
    setAlert(null); // Limpiar alertas previas

    try {
      await updateAsesor(id, formData);
      
      setAlert({ 
        type: 'success', 
        message: 'Asesor actualizado correctamente' 
      });
      
      setTimeout(() => navigate('/admin/listar-asesores'), 1500);
      
    } catch (err) {
       // USAR LA UTILIDAD PARA ESTANDARIZAR EL ERROR
       setAlert(handleApiError(err, 'Error al actualizar el asesor'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">
        Editando Asesor: <span className="text-fic-red">{formData.datos.nombre} {formData.datos.apellidoPaterno}</span>
      </h1>
      
      {/* ALERTA (Mantiene 'details' para mostrar lista de errores) */}
      <AlertMessage 
        type={alert?.type} 
        message={alert?.message} 
        details={alert?.details} 
        onClose={() => setAlert(null)} 
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Datos Personales */}
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-fic-yellow">
            <DatosAsesorForm data={formData.datos} handleChange={(e) => handleChange(e, 'datos')} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cuenta de Usuario */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-slate-400">
                <CuentaAsesorForm data={formData.asesor} handleChange={(e) => handleChange(e, 'asesor')} isEdit={true} />
            </div>
            {/* Contactos */}
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-slate-400">
                <ContactosForm data={formData.contactos} handleChange={(e) => handleChange(e, 'contactos')} />
            </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate('/admin/listar-asesores')} className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-bold">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="px-8 py-2 bg-fic-red text-white rounded-lg hover:bg-red-700 font-bold shadow-lg">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarAsesor;