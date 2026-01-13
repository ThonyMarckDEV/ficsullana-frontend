import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showSede, updateSede } from 'services/sedeService';
import SedeForm from '../components/SedeForm';
import AdminForm from '../components/AdminForm';
import LoadingScreen from 'components/Shared/LoadingScreen';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const EditarSede = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await showSede(id);
        setFormData({
          sede: { nombre: data.sede.nombre, direccion: data.sede.direccion, codigo_sunat: data.sede.codigo_sunat },
          admin: { nombre: data.admin.datos.nombre, apellidoPaterno: data.admin.datos.apellidoPaterno, dni: data.admin.datos.dni, username: data.admin.username, password: '' }
        });
      } catch (e) { setAlert({ type: 'error', message: 'Error al cargar' }); } finally { setLoading(false); }
    };
    load();
  }, [id]);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSede(id, formData);
      setAlert({ type: 'success', message: 'Actualizado correctamente' });
      setTimeout(() => navigate('/admin/listar-sedes'), 1500);
    } catch (err) { setAlert({ type: 'error', message: 'Error al actualizar' }); } finally { setLoading(false); }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-black text-fic-dark mb-6 border-b-2 border-fic-red pb-4">Editar Sede: {formData?.sede.nombre}</h1>
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100"><SedeForm data={formData.sede} handleChange={handleChange} /></div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100"><AdminForm data={formData.admin} handleChange={handleChange} isEdit={true} /></div>
        <div className="md:col-span-2 flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/admin/listar-sedes')} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold">Cancelar</button>
          <button type="submit" disabled={loading} className="bg-fic-yellow text-fic-dark px-10 py-3 rounded-lg font-black uppercase shadow-lg hover:bg-yellow-500 transition-all">
            {loading ? 'Procesando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarSede;