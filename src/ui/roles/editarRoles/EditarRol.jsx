import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showRol, updateRol, getPermisosDisponibles } from 'services/rolService';
import RolForm from 'components/Shared/Formularios/Rol/RolForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useAuth } from 'context/AuthContext';

const EditarRol = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 2. Extraer refreshSession
  const { refreshSession } = useAuth();

  const [formData, setFormData] = useState(null);
  const [permisosDisponibles, setPermisosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [permisosRes, rolRes] = await Promise.all([
            getPermisosDisponibles(),
            showRol(id)
        ]);

        setPermisosDisponibles(permisosRes.data || permisosRes);
        
        const rolData = rolRes.data || rolRes;
        
        const permisosIds = rolData.permisos ? rolData.permisos.map(p => p.id) : [];

        setFormData({
            nombre: rolData.nombre,
            descripcion: rolData.descripcion || '',
            permisos: permisosIds
        });

      } catch (e) { 
        setAlert({ type: 'error', message: 'No se pudo cargar la información.' }); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermisoChange = (permisoId) => {
    setFormData(prev => {
      const exists = prev.permisos.includes(permisoId);
      return { 
        ...prev, 
        permisos: exists 
            ? prev.permisos.filter(id => id !== permisoId) 
            : [...prev.permisos, permisoId] 
      };
    });
  };

  const handleSubmit = async (e) => {
      e.preventDefault();

      setLoading(true);
      setAlert(null);

      try {
        const payload = {
            rol: { nombre: formData.nombre, descripcion: formData.descripcion },
            permisos: formData.permisos
        };

        await updateRol(id, payload);
        
        // ACTUALIZAR EL CONTEXTO GLOBAL
        // Actualiza permisos y nombres de roles en toda la app
        await refreshSession(); 
        
        setAlert({ type: 'success', message: 'Rol actualizado correctamente.' });
        setTimeout(() => navigate('/roles/listar'), 1500);

      } catch (err) {
        setAlert(handleApiError(err, 'Error al actualizar el rol'));
      } finally { 
        setLoading(false); 
      }
  };

  if (loading) return <LoadingScreen />;
  if (!formData) return <div className="p-6 text-red-500 font-bold">Error de carga.</div>;

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Editar Rol"
        subtitle={`Modificando: ${formData.nombre}`}
        icon={PencilSquareIcon}
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

           <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-slate-200">
                <button 
                    type="button" 
                    onClick={() => navigate('/roles/listar')} 
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

        </div>
      </form>
    </div>
  );
};

export default EditarRol;