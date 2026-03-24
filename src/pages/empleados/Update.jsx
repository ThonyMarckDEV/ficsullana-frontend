import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showEmpleado, updateEmpleado } from 'services/empleadoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import PageHeader from 'components/Shared/Headers/PageHeader';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import {
    applyEmpleadoChange,
    buildEmpleadoPayload,
    createInitialEmpleadoForm,
    mapEmpleadoEmails,
    normalizeEmpleadoApiResponse,
} from 'utilities/pages/empleados/form';

import DatosForm from 'components/Shared/Formularios/Empleado/DatosForm';
import CuentasBancariasMultiples from 'components/Shared/Formularios/CuentasBancariasMultiples';
import CuentaForm from 'components/Shared/Formularios/Empleado/CuentaForm';

const Update = ({ backPath }) => { 
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState(null);
    const [rolIdRedirect, setRolIdRedirect] = useState(null);
    const [isCuentaAccesoValida, setIsCuentaAccesoValida] = useState(true);

    // Estado inicial idéntico a AgregarEmpleado
    const [formData, setFormData] = useState(() => createInitialEmpleadoForm());

    const [initialSedeName, setInitialSedeName] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await showEmpleado(id);
                const normalizedEmpleado = normalizeEmpleadoApiResponse(res.data);
                setRolIdRedirect(normalizedEmpleado.rolIdRedirect);
                setInitialSedeName(normalizedEmpleado.initialSedeName);
                setFormData(normalizedEmpleado.formData);

            } catch (err) {
                setAlert(handleApiError(err, 'Error cargando datos del empleado.'));
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleChange = (e, section) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => applyEmpleadoChange(prev, { section, name, value, type, checked }));
    };

    const handleCuentasBancariasChange = (cuentas) => {
        setFormData(prev => ({ ...prev, empleado_cuentas_bancarias: cuentas }));
    };

   const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isCuentaAccesoValida) {
            setAlert({
                type: 'error',
                message: 'La nueva contraseña no cumple validación. Debe tener mínimo 8 caracteres, un carácter especial y confirmación correcta.'
            });
            return;
        }

        setLoading(true);
        setAlert(null);
        
        try {
            const payload = buildEmpleadoPayload(formData, {
                includeSedeId: true,
                includePassword: true,
                optionalPassword: true,
            });
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
            
            <AlertMessage            
                type={alert?.type} 
                message={alert?.message} 
                details={alert?.details} 
                onClose={() => setAlert(null)} 
            />

            <form onSubmit={handleSubmit} className="w-full max-w-[98%] mx-auto">
                <div className="grid grid-cols-12 gap-6">
                    
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                            <DatosForm 
                                data={datosParaFormulario}
                                emails={formData.empleado_datos_contacto.correos}
                                onEmailsChange={(nextEmails) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        empleado_datos_contacto: {
                                            ...prev.empleado_datos_contacto,
                                            ...mapEmpleadoEmails(nextEmails),
                                        }
                                    }))
                                }
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
                             <CuentasBancariasMultiples 
                                data={formData.empleado_cuentas_bancarias}
                                onChange={handleCuentasBancariasChange}
                             />
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm sticky top-4">
                            <h2 className="text-sm font-black text-slate-700 uppercase mb-4 border-b pb-2">Acceso</h2>
                            <CuentaForm 
                                data={{...formData, email: formData.empleado_datos_contacto.correo}} 
                                handleChange={(e) => handleChange(e)} 
                                onValidationChange={setIsCuentaAccesoValida}
                                isEdit={true} 
                            />
                            <div className="mt-6 flex flex-col gap-2">
                                <button type="submit" disabled={loading || !isCuentaAccesoValida} className="w-full py-2.5 bg-fic-red text-white rounded font-bold uppercase text-xs shadow hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
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

export default Update;