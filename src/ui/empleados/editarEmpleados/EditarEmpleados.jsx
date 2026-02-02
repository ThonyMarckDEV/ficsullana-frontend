import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showEmpleado, updateEmpleado } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DatosForm from 'components/Shared/Formularios/Empleado/DatosForm';
import FormularioBancoInicial from 'components/Shared/Formularios/CuentasBancarias';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';

const EditarEmpleado = ({ backPath }) => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [rolIdRedirect, setRolIdRedirect] = useState(null);

    // Estado inicial idéntico a AgregarEmpleado
    const [formData, setFormData] = useState({
        // Datos Personales
        datos_empleado: { 
            nombre: '', apellidoPaterno: '', apellidoMaterno: '', dni: '', 
            fechaNacimiento: '', fechaIngreso: '', sexo: '', estadoCivil: '',
            direccion: '', departamento: '', provincia: '', distrito: '',
            area_id: ''
        },
        // Contacto
        empleado_datos_contacto: {
            telefono: '',
            correo: ''
        },
        // Banco 
        empleado_cuentas_bancarias: {
            entidad_financiera_id: '', 
            numero_cuenta: '',
            cci: ''
        },
        // Login
        username: '', 
        sede_id: '', 
        password: '', 
        password_confirmation: ''
    });

    const [initialSedeName, setInitialSedeName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await showEmpleado(id);
                const { 
                    datos_empleado, 
                    empleado_datos_contacto, 
                    empleado_cuentas_bancarias, 
                    username, 
                    sede, 
                    rol_id 
                } = res.data;

                setRolIdRedirect(rol_id); 

                const bancoState = empleado_cuentas_bancarias ? {
                    entidad_financiera_id: empleado_cuentas_bancarias.entidad_financiera_id,
                    numero_cuenta: empleado_cuentas_bancarias.numero_cuenta,
                    cci: empleado_cuentas_bancarias.cci
                } : { entidad_financiera_id: '', numero_cuenta: '', cci: '' };

                const contactoState = {
                    telefono: empleado_datos_contacto?.telefono || '',
                    correo: empleado_datos_contacto?.correo || ''
                };

                setFormData({
                    datos_empleado: { 
                        nombre: datos_empleado.nombre, 
                        apellidoPaterno: datos_empleado.apellidoPaterno, 
                        apellidoMaterno: datos_empleado.apellidoMaterno, 
                        dni: datos_empleado.dni, 
                        fechaNacimiento: datos_empleado.fechaNacimiento,
                        fechaIngreso: datos_empleado.fechaIngreso,
                        sexo: datos_empleado.sexo,
                        estadoCivil: datos_empleado.estadoCivil,
                        direccion: datos_empleado.direccion,
                        departamento: datos_empleado.departamento,
                        provincia: datos_empleado.provincia,
                        distrito: datos_empleado.distrito,
                        area_id: datos_empleado.area_id,
                        area: datos_empleado.area
                    },
                    empleado_datos_contacto: contactoState,
                    empleado_cuentas_bancarias: bancoState, 
                    username: username || '',
                    sede_id: sede?.id || '',
                    password: '',
                    password_confirmation: ''
                });

                if (sede) setInitialSedeName(sede.nombre);

            } catch (err) {
                setAlert({ type: 'error', message: 'Error cargando datos del empleado.' });
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e, section) => {
        const { name, value } = e.target;

        if (name === 'telefono' && section === 'datos_empleado') {
             setFormData(prev => ({ 
                ...prev, 
                empleado_datos_contacto: { ...prev.empleado_datos_contacto, telefono: value } 
            }));
            return;
        }

        if (name === 'email' || name === 'correo') {
            setFormData(prev => ({ 
               ...prev, 
               empleado_datos_contacto: { ...prev.empleado_datos_contacto, correo: value }
           }));
           return;
       }

        if (section) setFormData(p => ({ ...p, [section]: { ...p[section], [name]: value } }));
        else setFormData(p => ({ ...p, [name]: value }));
    };

   const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);
        
        try {
            const datosLimpios = { ...formData.datos_empleado };
            
            delete datosLimpios.area; 

            const payload = { 
                datos_empleado: datosLimpios,
                empleado_datos_contacto: formData.empleado_datos_contacto,
                username: formData.username,
                sede_id: formData.sede_id,
                empleado_cuentas_bancarias: formData.empleado_cuentas_bancarias
            };

            if (formData.password) {
                payload.password = formData.password;
                payload.password_confirmation = formData.password_confirmation;
            }
            
            if (!payload.empleado_cuentas_bancarias.entidad_financiera_id) {
                delete payload.empleado_cuentas_bancarias; 
            }
            
            await updateEmpleado(id, payload);
            setAlert({ type: 'success', message: 'Actualizado correctamente.' });
            setTimeout(() => navigate(rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath || '/home'), 1500);
        } catch (err) {
            setAlert(handleApiError(err, 'Error al actualizar'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    const datosParaFormulario = {
        ...formData.datos_empleado,
        telefono: formData.empleado_datos_contacto.telefono
    };

    return (
        <div className="w-full px-6 py-4">
            <PageHeader title="Editar Personal" subtitle={`${formData.datos_empleado.nombre} ${formData.datos_empleado.apellidoPaterno}`} icon={PencilSquareIcon} buttonText="Volver" buttonLink={rolIdRedirect ? `/personal/listar/${rolIdRedirect}` : backPath} />
            <AlertMessage {...alert} onClose={() => setAlert(null)} />

            <form onSubmit={handleSubmit} className="w-full max-w-[98%] mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                            <DatosForm 
                                data={datosParaFormulario}
                                email={formData.empleado_datos_contacto.correo}
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
                                data={formData.empleado_cuentas_bancarias}
                                handleChange={(e) => handleChange(e, 'empleado_cuentas_bancarias')} 
                             />
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-4">
                            <h2 className="text-sm font-black text-slate-700 uppercase mb-4 border-b pb-2">Acceso</h2>
                            <CuentaForm 
                                data={{...formData, email: formData.empleado_datos_contacto.correo}} 
                                handleChange={(e) => handleChange(e)} 
                                isEdit={true} 
                            />
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

export default EditarEmpleado;