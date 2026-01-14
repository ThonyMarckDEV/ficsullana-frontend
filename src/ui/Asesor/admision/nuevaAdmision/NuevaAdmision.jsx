import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdmision } from 'services/admisionService';

// Componentes de Búsqueda
import ClienteSearchSelect from 'components/Shared/Comboboxes/ClienteSearchSelect';
import ProspectoSearchSelect from 'components/Shared/Comboboxes/ProspectoSearchSelect';

// Componentes de Admisión
import DeudasGrid from '../components/DeudasGrid';
import ProtestosGrid from '../components/ProtestosGrid';
import ModalCrearProspecto from '../components/Modals/ModalCrearProspecto';

import AlertMessage from 'components/Shared/Errors/AlertMessage';
import LoadingScreen from 'components/Shared/LoadingScreen';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const NuevaAdmision = () => {
    const navigate = useNavigate();
    
    // --- ESTADOS DE UI ---
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);
    const [isModalProspectoOpen, setIsModalProspectoOpen] = useState(false);

    // --- ESTADOS DE DATOS ---
    const [header, setHeader] = useState({
        cliente_id: null,     
        prospecto_id: null,
        tipo_solicitante: 'CLIENTE',
        tipo_prestamo: '', // <--- CORRECCIÓN: INICIA VACÍO
        observaciones: ''
    });

    const [clienteSelected, setClienteSelected] = useState(null);
    const [prospectoSelected, setProspectoSelected] = useState(null);

    const [deudas, setDeudas] = useState([]);
    const [protestos, setProtestos] = useState([]);

    // --- MANEJADORES DE SELECCIÓN ---

    const handleTipoSolicitanteChange = (e) => {
        const nuevoTipo = e.target.value;
        
        setHeader(prev => ({
            ...prev,
            tipo_solicitante: nuevoTipo,
            cliente_id: null,
            prospecto_id: null,
            // Si es prospecto es NUEVO fijo, si es cliente esperamos a que seleccione (VACÍO)
            tipo_prestamo: nuevoTipo === 'PROSPECTO' ? 'NUEVO' : '' 
        }));

        setClienteSelected(null);
        setProspectoSelected(null);
    };

    // --- LÓGICA AUTOMÁTICA (RCS/RSS/NUEVO) ---
    const onSelectCliente = (cliente) => {
        if (cliente) {
            // Leemos directamente del JSON que me mostraste
            const tipoSugerido = cliente.tipo_financiero; 

            setHeader(prev => ({ 
                ...prev, 
                cliente_id: cliente.id, 
                prospecto_id: null,
                tipo_prestamo: tipoSugerido // Asigna lo que viene del backend (ej: RSS)
            }));
            
            setClienteSelected(cliente);
            
            // Mensaje informativo
            let mensajeTipo = '';
            if (tipoSugerido === 'RCS') mensajeTipo = 'Deuda vigente detectada (RCS).';
            else if (tipoSugerido === 'RSS') mensajeTipo = 'Sin deuda activa (RSS).';
            else if (tipoSugerido === 'NUEVO') mensajeTipo = 'Sin historial previo.';
            
            setAlert({ type: 'info', message: `Cliente seleccionado. ${mensajeTipo}` });
        } else {
            // SI LIMPIA EL CLIENTE, LIMPIAMOS EL TIPO
            setHeader(prev => ({ ...prev, cliente_id: null, tipo_prestamo: '' }));
            setClienteSelected(null);
        }
    };

    const onSelectProspecto = (prospecto) => {
        if (prospecto) {
            setHeader(prev => ({ 
                ...prev, 
                prospecto_id: prospecto.id, 
                cliente_id: null,
                tipo_prestamo: 'NUEVO'
            }));
            setProspectoSelected(prospecto);
            setAlert({ type: 'warning', message: 'Prospecto seleccionado. Aplica solo a Primer Crédito.' });
        } else {
            setHeader(prev => ({ ...prev, prospecto_id: null, tipo_prestamo: '' }));
            setProspectoSelected(null);
        }
    };

    const handleProspectoCreado = (prospectoData) => {
        const nombreCompleto = `${prospectoData.nombres} ${prospectoData.apellido_paterno} ${prospectoData.apellido_materno}`;
        const prospectoObj = { 
            id: prospectoData.id, 
            nombre: nombreCompleto, 
            dni: prospectoData.dni 
        };
        onSelectProspecto(prospectoObj);
        setAlert({ type: 'success', message: 'Prospecto creado y asignado correctamente.' });
    };

    // --- SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        if (header.tipo_solicitante === 'CLIENTE' && !header.cliente_id) {
            setAlert({ type: 'error', message: 'Debe buscar y seleccionar un Cliente.' });
            setLoading(false); return;
        }
        if (header.tipo_solicitante === 'PROSPECTO' && !header.prospecto_id) {
            setAlert({ type: 'error', message: 'Debe buscar o crear un Prospecto.' });
            setLoading(false); return;
        }
        // VALIDAR QUE SE HAYA CALCULADO EL TIPO
        if (!header.tipo_prestamo) {
            setAlert({ type: 'error', message: 'Error: No se ha determinado el tipo de préstamo.' });
            setLoading(false); return;
        }

        const payload = {
            cliente_id: header.tipo_solicitante === 'CLIENTE' ? header.cliente_id : null,
            prospecto_id: header.tipo_solicitante === 'PROSPECTO' ? header.prospecto_id : null,
            tipo_prestamo: header.tipo_prestamo,
            observaciones: header.observaciones,
            deudas: deudas,
            protestos: protestos
        };

        try {
            const response = await createAdmision(payload);
            setAlert({ type: 'success', message: response.message || 'Evaluación registrada exitosamente.' });
            setTimeout(() => navigate('/asesor/listar-admisiones'), 2000);
        } catch (error) {
            setAlert(handleApiError(error, 'Error al registrar la admisión'));
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingScreen />;

    // Helper para mostrar texto bonito en el input bloqueado
    const getTipoPrestamoLabel = () => {
        if (!header.tipo_prestamo) return ''; // Muestra vacío si no hay selección
        if (header.tipo_prestamo === 'NUEVO') return 'NUEVO (Primer Crédito)';
        if (header.tipo_prestamo === 'RCS') return 'RCS (Recurrente con Saldo)';
        if (header.tipo_prestamo === 'RSS') return 'RSS (Recurrente sin Saldo)';
        return header.tipo_prestamo;
    };

    return (
        <div className="container mx-auto p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6 border-b-2 border-fic-red pb-4">
                <h1 className="text-3xl font-black text-fic-dark">Nueva Evaluación</h1>
                <button 
                    onClick={() => navigate('/asesor/listar-admisiones')} 
                    className="font-bold text-slate-500 hover:text-fic-red transition-colors"
                >
                    ← Volver
                </button>
            </div>

            <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

            <ModalCrearProspecto 
                isOpen={isModalProspectoOpen} 
                onClose={() => setIsModalProspectoOpen(false)} 
                onSuccess={handleProspectoCreado} 
            />

            <form onSubmit={handleSubmit} className="w-full max-w-[95%] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* --- COLUMNA IZQUIERDA: DATOS --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 sticky top-6">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2 flex items-center gap-2">
                            <UserPlusIcon className="w-5 h-5 text-fic-red"/> 1. Solicitante
                        </h2>
                        
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Persona</label>
                            <select 
                                value={header.tipo_solicitante} 
                                onChange={handleTipoSolicitanteChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-fic-red outline-none text-sm font-bold text-slate-700"
                            >
                                <option value="CLIENTE">Cliente Registrado</option>
                                <option value="PROSPECTO">Prospecto Nuevo</option>
                            </select>
                        </div>

                        {header.tipo_solicitante === 'CLIENTE' ? (
                            <div className="mb-4 animate-fade-in-down">
                                <ClienteSearchSelect 
                                    onSelect={onSelectCliente} 
                                    selectedId={header.cliente_id}
                                    initialName={clienteSelected?.nombre}
                                />
                            </div>
                        ) : (
                            <div className="mb-4 animate-fade-in-down">
                                <ProspectoSearchSelect 
                                    onSelect={onSelectProspecto} 
                                    selectedId={header.prospecto_id}
                                    initialName={prospectoSelected?.nombre}
                                    onOpenModal={() => setIsModalProspectoOpen(true)}
                                />
                            </div>
                        )}

                        {/* --- CAMPO TIPO DE PRÉSTAMO (BLOQUEADO/AUTOMÁTICO) --- */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Préstamo (Automático)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={getTipoPrestamoLabel()}
                                    placeholder="Seleccione un solicitante..."
                                    disabled
                                    className={`w-full px-3 py-2 border rounded-md bg-slate-200 text-slate-600 font-black text-sm cursor-not-allowed shadow-inner outline-none ${
                                        !header.tipo_prestamo ? 'italic text-slate-400 font-normal' : ''
                                    }`}
                                />
                                
                                {/* Indicador Visual (Bolita de color) */}
                                <div className="absolute right-3 top-2.5">
                                    {header.tipo_prestamo === 'RCS' && <span className="h-2 w-2 rounded-full bg-orange-500 inline-block animate-pulse"></span>}
                                    {header.tipo_prestamo === 'RSS' && <span className="h-2 w-2 rounded-full bg-green-500 inline-block animate-pulse"></span>}
                                    {header.tipo_prestamo === 'NUEVO' && <span className="h-2 w-2 rounded-full bg-blue-500 inline-block animate-pulse"></span>}
                                </div>
                            </div>

                            {/* Mensajes de Ayuda Contextual */}
                            {header.tipo_solicitante === 'PROSPECTO' && (
                                <p className="text-[10px] text-blue-600 mt-1 font-bold bg-blue-50 p-1 rounded border border-blue-100 flex items-center gap-1">
                                    🔒 Los prospectos siempre inician como NUEVO.
                                </p>
                            )}
                            
                            {header.tipo_solicitante === 'CLIENTE' && header.cliente_id && (
                                <p className={`text-[10px] mt-1 font-bold p-1 rounded border flex items-center gap-1 ${
                                    header.tipo_prestamo === 'RCS' 
                                        ? 'text-orange-700 bg-orange-50 border-orange-100' 
                                        : 'text-green-700 bg-green-50 border-green-100'
                                }`}>
                                    🔒 Calculado según historial del cliente.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Observaciones</label>
                            <textarea 
                                name="observaciones" 
                                value={header.observaciones} 
                                onChange={(e) => setHeader(prev => ({ ...prev, observaciones: e.target.value }))}
                                className="w-full px-3 py-2 border rounded-md outline-none text-sm h-24 resize-none focus:border-fic-red"
                                placeholder="Notas del asesor..."
                            />
                        </div>
                    </div>
                </div>

                {/* --- COLUMNA DERECHA: GRIDS --- */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100 min-h-[500px]">
                        <h2 className="text-lg font-bold text-slate-700 mb-4 border-b pb-2">2. Evaluación Financiera</h2>
                        
                        <div className={!header.cliente_id && !header.prospecto_id ? 'opacity-50 pointer-events-none grayscale' : ''}>
                            {/* Pasamos el tipo de prestamo para que los Grids sepan qué reglas aplicar */}
                            <DeudasGrid 
                                deudas={deudas} 
                                setDeudas={setDeudas} 
                                tipoPrestamo={header.tipo_prestamo || 'RCS'} // Fallback solo para renderizado interno
                            />
                            <ProtestosGrid protestos={protestos} setProtestos={setProtestos} />
                        </div>

                        {!header.cliente_id && !header.prospecto_id && (
                            <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-lg mt-[-200px] relative z-10 mx-4">
                                <p className="text-slate-400 font-bold text-sm">
                                    🔍 Seleccione un Cliente o Prospecto para habilitar la carga de datos financieros.
                                </p>
                            </div>
                        )}

                        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-4">
                            <button 
                                type="button" 
                                onClick={() => navigate('/asesor/listar-admisiones')} 
                                className="px-6 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading || !header.tipo_prestamo} 
                                className="bg-fic-red text-white px-8 py-2 rounded font-black uppercase shadow-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                            >
                                {loading ? 'Procesando...' : 'Finalizar Evaluación'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default NuevaAdmision;