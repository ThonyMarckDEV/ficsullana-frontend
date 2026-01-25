import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showAdministrador, updateAdministrador } from 'services/administradorService'; 
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import DatosAsesorForm from 'components/Shared/Formularios/DatosForm';
import CuentaForm from 'components/Shared/Formularios/CuentaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const EditarAdministrador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
      datos_empleado: { nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', telefono: '' },
      administrador: { username: '', password: '', password_confirmation: '', sede_id: '' }
  });

  const [initialSedeName, setInitialSedeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await showAdministrador(id);
        const { datos_empleado, username, sede_id, sede } = response.data; 
        
        setFormData({
            datos_empleado: datos_empleado || {},
            administrador: { username: username || '', sede_id: sede_id || '', password: '', password_confirmation: '' }
        });

        if (sede) setInitialSedeName(sede.nombre);
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

  const handleSedeChange = (id) => {
      setFormData(prev => ({ ...prev, administrador: { ...prev.administrador, sede_id: id } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAdministrador(id, formData);
      setAlert({ type: 'success', message: 'Administrador actualizado correctamente' });
      setTimeout(() => navigate('/personal/listar-administradores'), 1500);
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
        title="Editar Administrador"
        subtitle={`Perfil de: ${formData.datos_empleado.nombre}`}
        icon={PencilSquareIcon}
        buttonText="← Volver al listado"
        buttonLink="/personal/listar-administradores"
      />
      
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-fic-yellow">
                    <DatosAsesorForm 
                        data={formData.datos_empleado} 
                        handleChange={(e) => handleChange(e, 'datos_empleado')}
                        isEdit={true}
                        currentSedeId={formData.administrador.sede_id}
                        initialSedeName={initialSedeName}
                        onSedeChange={handleSedeChange}
                    />
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-slate-400 sticky top-6">
                    <div className="flex items-center gap-2 mb-6 border-b pb-2">
                        <UserCircleIcon className="w-6 h-6 text-slate-500" />
                        <h2 className="text-xl font-black text-slate-700">Acceso</h2>
                    </div>
                    <CuentaForm data={formData.administrador} handleChange={(e) => handleChange(e, 'administrador')} isEdit={true} />
                    <button type="submit" disabled={loading} className="w-full mt-8 py-3 bg-fic-red text-white rounded-lg font-black uppercase shadow-lg">
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </div>
      </form>
    </div>
  );
};

export default EditarAdministrador;