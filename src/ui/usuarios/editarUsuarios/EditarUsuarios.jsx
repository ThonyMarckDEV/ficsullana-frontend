import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showUsuario, updateUsuario } from 'services/usuarioService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import DatosForm from 'components/Shared/Formularios/Empleado/DatosForm';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const EditarUsuario = ({ backPath }) => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    
    const [rolIdRedirect, setRolIdRedirect] = useState(null);

    const [formData, setFormData] = useState({
        datos_empleado: { 
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
            fechaNacimiento: '', sexo: '', estadoCivil: '', direccion: '', telefono: '' 
        },
        username: '',
        email: '',
        sede_id: '',
        password: '',
        password_confirmation: ''
    });

    const [initialSedeName, setInitialSedeName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await showUsuario(id);
                const user = res.data;
                
                setRolIdRedirect(user.rol_id || user.rol?.id); 

                setFormData({
                    datos_empleado: user.perfil || {},
                    username: user.username || '',
                    email: user.email || '',
                    sede_id: user.sede?.id || '',
                    password: '',
                    password_confirmation: ''
                });

                if (user.sede) {
                    setInitialSedeName(user.sede.nombre);
                }
            } catch (err) {
                setAlert({ type: 'error', message: 'No se pudo cargar la información del usuario.' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section) {
            setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
        } else {
            setFormData(p => ({ ...p, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        try {
            await updateUsuario(id, formData);
            setAlert({ type: 'success', message: 'Usuario actualizado correctamente.' });
            
            setTimeout(() => {
                if (rolIdRedirect) {
                    navigate(`/personal/listar/${rolIdRedirect}`);
                } else {
                    navigate('/home'); 
                }
            }, 1500);

        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar usuario'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="container mx-auto p-6">
            <PageHeader 
                title="Editar Personal" 
                subtitle={`Actualizando perfil de: ${formData.datos_empleado.nombre} ${formData.datos_empleado.apellidoPaterno}`} 
                icon={PencilSquareIcon} 
                buttonText="← Volver" 
                buttonLink={rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath} 
            />
            
            <AlertMessage {...alert} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-t-4 border-fic-red h-full">
                            <DatosForm 
                                data={formData.datos_empleado} 
                                handleChange={(e) => handleChange(e, 'datos_empleado')}
                                isEdit={true}
                                currentSedeId={formData.sede_id}
                                initialSedeName={initialSedeName}
                                onSedeChange={(newSedeId) => setFormData(p => ({ ...p, sede_id: newSedeId }))}
                            />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-t-4 border-fic-yellow sticky top-6">
                            <div className="flex items-center gap-2 mb-6 border-b pb-2">
                                <UserCircleIcon className="w-6 h-6 text-slate-500" />
                                <h2 className="text-xl font-black text-slate-700 uppercase tracking-tighter">Acceso</h2>
                            </div>
                            
                            <CuentaForm 
                                data={formData} 
                                handleChange={(e) => handleChange(e)} 
                                isEdit={true} 
                            />

                            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-3">
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="w-full py-3 bg-fic-red text-white rounded-lg hover:bg-red-700 font-black uppercase shadow-lg transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Guardando...' : 'Confirmar Cambios'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => navigate(rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath)} 
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

export default EditarUsuario;