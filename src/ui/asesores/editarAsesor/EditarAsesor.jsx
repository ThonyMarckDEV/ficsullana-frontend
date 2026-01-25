import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAsesor, updateAsesor } from 'services/asesorService'; 

import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

import DatosAsesorForm from 'components/Shared/Formularios/DatosForm';
import CuentaForm from 'components/Shared/Formularios/CuentaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const cleanNulls = (obj) => {
  if (!obj) return {};
  const newObj = { ...obj };
  Object.keys(newObj).forEach(key => { if (newObj[key] === null) newObj[key] = ''; });
  return newObj;
};

const EditarAsesor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
      datos_empleado: { nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', telefono: '' },
      asesor: { username: '', password: '', password_confirmation: '', sede_id: '' }
  });

  const [initialSedeName, setInitialSedeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showAsesor(id);
        
        const { datos_empleado, username, sede_id, sede } = response.data; 
        
        setFormData({
            datos_empleado: cleanNulls(datos_empleado),
            asesor: { username: username || '', sede_id: sede_id || '', password: '', password_confirmation: '' }
        });

        // Configuramos el nombre inicial para el buscador
        if (sede && sede.nombre) {
            setInitialSedeName(sede.nombre);
        }

      } catch (err) {
        setAlert({ type: 'error', message: 'No se pudo cargar la información del asesor.' });
        console.error(err);
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

  // Manejador simplificado: Recibe directamente el ID (no un evento)
  const handleSedeChange = (newSedeId) => {
      setFormData(prev => ({
          ...prev,
          asesor: { ...prev.asesor, sede_id: newSedeId }
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);
    try {
      await updateAsesor(id, formData);
      setAlert({ type: 'success', message: 'Asesor actualizado correctamente' });
      setTimeout(() => navigate('/personal/listar-asesores'), 1500);
    } catch (err) {
       setAlert(handleApiError(err, 'Error al actualizar el asesor'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">

      <PageHeader 
        title="Editar Asesor"
        subtitle={`Editando a: ${formData.datos_empleado.nombre} ${formData.datos_empleado.apellidoPaterno}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/personal/listar-asesores"
      />
      
      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit}>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* IZQUIERDA: DATOS + SEDE */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 border-t-4 border-fic-yellow h-full">
                    <DatosAsesorForm 
                        data={formData.datos_empleado} 
                        handleChange={(e) => handleChange(e, 'datos_empleado')}
                        isEdit={true}
                        
                        // Pasamos datos para el combobox
                        currentSedeId={formData.asesor.sede_id}
                        initialSedeName={initialSedeName}
                        onSedeChange={handleSedeChange}
                    />
                </div>
            </div>

            {/* DERECHA: CUENTA */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 border-t-4 border-slate-400 sticky top-6">
                    <div className="flex items-center gap-2 mb-6 border-b pb-2">
                        <UserCircleIcon className="w-6 h-6 text-slate-500" />
                        <h2 className="text-xl font-black text-slate-700">Acceso al Sistema</h2>
                    </div>
                    
                    <CuentaForm 
                        data={formData.asesor} 
                        handleChange={(e) => handleChange(e, 'asesor')} 
                        isEdit={true} 
                    />

                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full py-3 bg-fic-red text-white rounded-lg hover:bg-red-700 font-black uppercase shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/personal/listar-asesores')} 
                            className="w-full py-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </form>
    </div>
  );
};

export default EditarAsesor;