import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showUsuario, updateUsuario } from 'services/usuarioService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DatosAsesorForm from 'components/Shared/Formularios/Empleado/DatosForm';
import FormularioBancoInicial from 'components/Shared/Formularios/CuentasBancarias';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';

const EditarUsuario = ({ backPath }) => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [rolIdRedirect, setRolIdRedirect] = useState(null);

    const [formData, setFormData] = useState({
        datos_empleado: { 
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
            fechaNacimiento: '', fechaIngreso: '', sexo: '', estadoCivil: '',
            direccion: '', departamento: '', provincia: '', distrito: '',
            telefono: '', area_id: ''
        },
        formulario_bancario: {
            entidad_financiera_id: '', 
            numero_cuenta: '',
            cci: ''
        },
        username: '', email: '', sede_id: '', password: '', password_confirmation: ''
    });

    const [initialSedeName, setInitialSedeName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await showUsuario(id);
                const user = res.data;
                setRolIdRedirect(user.rol_id || user.rol?.id); 

                let bancosVisuales = { entidad_financiera_id: '', numero_cuenta: '', cci: '' };


                if (user.usuario_cuentas_bancarias && user.usuario_cuentas_bancarias.length > 0) {
                    const bancoData = user.usuario_cuentas_bancarias[0];
                    bancosVisuales = {
                        entidad_financiera_id: bancoData.entidad_financiera_id || bancoData.entidad_financiera?.id,
                        numero_cuenta: bancoData.numero_cuenta, 
                        cci: bancoData.cci
                    };
                }

                const { cuentaBancaria, cci, banco, ...perfilLimpio } = user.perfil || {};

                setFormData({
                    datos_empleado: { 
                        nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
                        ...perfilLimpio 
                    },
                    formulario_bancario: bancosVisuales, 
                    username: user.username || '',
                    email: user.email || '',
                    sede_id: user.sede?.id || '',
                    password: '',
                    password_confirmation: ''
                });

                if (user.sede) setInitialSedeName(user.sede.nombre);
            } catch (err) {
                setAlert({ type: 'error', message: 'Error cargando datos.' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        if (section) setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
        else setFormData(p => ({ ...p, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        
        try {
            const payload = { ...formData, usuario_cuentas_bancarias: [] };
            
            const { entidad_financiera_id, numero_cuenta, cci } = formData.formulario_bancario;
            
            if (entidad_financiera_id) {
                payload.usuario_cuentas_bancarias.push({ 
                    entidad_financiera_id: parseInt(entidad_financiera_id), 
                    numero_cuenta: numero_cuenta,
                    cci: cci 
                });
            }
            
            delete payload.formulario_bancario;

            await updateUsuario(id, payload);
            setAlert({ type: 'success', message: 'Actualizado correctamente.' });
            setTimeout(() => navigate(rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath || '/home'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    return (
        <div className="w-full px-6 py-4">
            <PageHeader title="Editar Personal" subtitle={`${formData.datos_empleado.nombre} ${formData.datos_empleado.apellidoPaterno}`} icon={PencilSquareIcon} buttonText="Volver" buttonLink={rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath} />
            <AlertMessage {...alert} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="w-full max-w-[98%] mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                            <DatosAsesorForm 
                                data={formData.datos_empleado} 
                                email={formData.email}
                                usuarioId={id}
                                handleRootChange={(e) => handleChange(e)}
                                handleChange={(e) => handleChange(e, 'datos_empleado')}
                                isEdit={true}
                                currentSedeId={formData.sede_id}
                                initialSedeName={initialSedeName}
                                onSedeChange={(newSedeId) => setFormData(p => ({ ...p, sede_id: newSedeId }))}
                            />
                        </div>
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                             <FormularioBancoInicial 
                                data={formData.formulario_bancario}
                                handleChange={(e) => handleChange(e, 'formulario_bancario')} 
                             />
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-4">
                            <h2 className="text-sm font-black text-slate-700 uppercase mb-4 border-b pb-2">Acceso</h2>
                            <CuentaForm data={formData} handleChange={(e) => handleChange(e)} isEdit={true} />
                            <div className="mt-6 flex flex-col gap-2">
                                <button type="submit" disabled={loading} className="w-full py-2.5 bg-fic-red text-white rounded font-bold uppercase text-xs shadow hover:bg-red-700 transition-all">
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                                <button type="button" onClick={() => navigate(-1)} className="w-full py-2.5 bg-slate-100 text-slate-600 rounded font-bold uppercase text-xs hover:bg-slate-200">
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