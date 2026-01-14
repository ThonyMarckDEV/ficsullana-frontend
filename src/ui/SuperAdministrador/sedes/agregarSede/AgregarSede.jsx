import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSede } from 'services/sedeService';
import SedeForm from '../components/SedeForm';
import AdminForm from '../components/AdminForm';
import AlertMessage from 'components/Shared/Errors/AlertMessage';

const AgregarSede = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sede: { nombre: '', direccion: '', codigo_sunat: '' },
    admin: { nombre: '', apellidoPaterno: '', dni: '', username: '', password: '' }
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e, section) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createSede(formData);
      setAlert(response);
      setTimeout(() => navigate('/superadmin/listar-sedes'), 2000);
    } catch (error) { setAlert(error); } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6 border-b-2 border-fic-red pb-4">
        <h1 className="text-3xl font-black text-fic-dark">Apertura de Sede</h1>
        <button onClick={() => navigate('/superadmin/listar-sedes')} className="font-bold text-slate-500 hover:text-fic-red">← Volver</button>
      </div>
      <AlertMessage type={alert?.type} message={alert?.message} onClose={() => setAlert(null)} />
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100"><SedeForm data={formData.sede} handleChange={handleChange} /></div>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100"><AdminForm data={formData.admin} handleChange={handleChange} /></div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={loading} className="bg-fic-red text-white px-10 py-3 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all">
            {loading ? 'Guardando...' : 'Registrar Sede y Admin'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgregarSede;