import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRol, getPermisosDisponibles } from 'services/rolService';
import RolForm from 'components/Shared/Formularios/Rol/RolForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler'; 
import PageHeader from 'components/Shared/Headers/PageHeader';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

// Importar el contexto
import { useAuth } from 'context/AuthContext';

const Store = () => {
  const navigate = useNavigate();
  
  // Extraer refreshSession
  const { refreshSession } = useAuth(); 
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    permisos: [] 
  });
  
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const loadPermisos = async () => {
      try {
        const response = await getPermisosDisponibles();
        setPermisosDisponibles(response.data || response); 
      } catch (err) {
        setAlert(handleApiError(err , 'No se pudieron cargar los permisos del sistema.'));
      }
    };
    loadPermisos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermisoChange = (permisoId) => {
    setFormData(prev => {
      const exists = prev.permisos.includes(permisoId);
      if (exists) {
        return { ...prev, permisos: prev.permisos.filter(id => id !== permisoId) };
      } else {
        return { ...prev, permisos: [...prev.permisos, permisoId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.permisos.length === 0) {
        setAlert({ type: 'info', message: 'Debes seleccionar al menos un permiso.' });
        return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const payload = {
        rol: { nombre: formData.nombre, descripcion: formData.descripcion },
        permisos: formData.permisos
      };

      const response = await createRol(payload);
      
      // ACTUALIZAR EL CONTEXTO GLOBAL
      // Esto recarga la lista de roles en el Sidebar inmediatamente
      await refreshSession();

      setAlert({
        type: 'success',
        message: response.message || 'Rol registrado exitosamente.'
      });
      
      setTimeout(() => navigate('/roles/listar'), 2000);

    } catch (err) {
      setAlert(handleApiError(err, 'Error al registrar el rol'));
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="container mx-auto p-6">
      
      <PageHeader 
        title="Nuevo Rol"
        subtitle="Definición de accesos y perfiles"
        icon={ShieldCheckIcon}
        buttonText="← Volver al listado"
        buttonLink="/roles/listar"
      />

      <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        
        <div className="mt-6">
            <RolForm 
                data={formData} 
                handleChange={handleChange} 
                permisosDisponibles={permisosDisponibles}
                handlePermisoChange={handlePermisoChange}
            />

            <div className="mt-8 flex justify-end pt-6 border-t border-slate-200">
                <button 
                    type="submit" 
                    disabled={loading} 
                    className="bg-fic-red text-white px-8 py-3 rounded-xl font-black uppercase shadow-lg shadow-fic-red/30 hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Guardando...
                        </>
                    ) : (
                        'Crear Rol'
                    )}
                </button>
            </div>
        </div>
      </form>
      
    </div>
  );
};

export default Store;