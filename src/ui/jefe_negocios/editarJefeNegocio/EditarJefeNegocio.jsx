import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showJefeNegocio, updateJefeNegocio } from 'services/jefeNegocioService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import DatosForm from 'components/Shared/Formularios/DatosForm';
import CuentaForm from 'components/Shared/Formularios/CuentaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const cleanNulls = (obj) => {
  if (!obj) return {};
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => { if (newObj[key] === null) newObj[key] = ''; });
  return newObj;
};

const EditarJefeNegocio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
      datos_empleado: { nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', telefono: '' },
      jefe_negocio: { username: '', password: '', password_confirmation: '', sede_id: '' }
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showJefeNegocio(id);
        const { datos_empleado, username, sede_id } = response.data; 
        setFormData({
            datos_empleado: cleanNulls(datos_empleado),
            jefe_negocio: { username: username || '', sede_id: sede_id || '', password: '', password_confirmation: '' }
        });
      } catch (err) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información.' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await updateJefeNegocio(id, formData);
      setAlert({ type: 'success', message: 'Jefe de Negocio actualizado correctamente' });
      setTimeout(() => navigate('/listar-jefes-negocio'), 1500);
    } catch (err) {
       setAlert(handleApiError(err, 'Error al actualizar'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">

      <PageHeader 
        title="Editar Jefe de Negocio"
        subtitle={`Editando Jefe: ${formData.datos_empleado.nombre || ''} ${formData.datos_empleado.apellidoPaterno  || ''} ${formData.datos_empleado.apellidoMaterno  || ''}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/listar-jefes-negocio"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 border-t-4 border-fic-yellow">
            <DatosForm data={formData.datos_empleado} handleChange={(e) => handleChange(e, 'datos_empleado')} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 border-t-4 border-slate-400 max-w-2xl">
            <CuentaForm data={formData.jefe_negocio} handleChange={(e) => handleChange(e, 'jefe_negocio')} isEdit={true} />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate('/listar-jefes-negocio')} className="px-6 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold transition-colors">Cancelar</button>
          <button type="submit" disabled={loading} className="px-8 py-2 bg-fic-red text-white rounded-lg hover:bg-red-700 font-black uppercase shadow-lg transition-all">{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
        </div>
      </form>
    </div>
  );
};
export default EditarJefeNegocio;