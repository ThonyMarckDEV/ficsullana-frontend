import React, { useState } from 'react';
import { createProspecto } from 'services/prospectoService';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';

const ModalCrearProspecto = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        dni: '', nombres: '', apellido_paterno: '', apellido_materno: '', celular: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert(null);

        try {
            const response = await createProspecto(formData);
            
            onSuccess(response.data); 
            onClose(); 
            
        } catch (error) {
            setAlert(handleApiError(error, 'Error al guardar prospecto'));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-fic-red outline-none text-sm";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                
                <div className="bg-fic-red p-4 flex justify-between items-center">
                    <h3 className="text-white font-black uppercase tracking-wide">Nuevo Prospecto Rápido</h3>
                    <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1">✕</button>
                </div>

                <div className="p-6">
                    <AlertMessage type={alert?.type} message={alert?.message} details={alert?.details} onClose={() => setAlert(null)} />

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">DNI / CE</label>
                            <input name="dni" value={formData.dni} onChange={handleChange} className={inputClass} maxLength={12} required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Apellido Paterno</label>
                                <input name="apellido_paterno" value={formData.apellido_paterno} onChange={handleChange} className={inputClass} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Apellido Materno</label>
                                <input name="apellido_materno" value={formData.apellido_materno} onChange={handleChange} className={inputClass} required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nombres</label>
                            <input name="nombres" value={formData.nombres} onChange={handleChange} className={inputClass} required />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Celular (Opcional)</label>
                            <input name="celular" value={formData.celular} onChange={handleChange} className={inputClass} maxLength={9} />
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-bold bg-slate-100 rounded hover:bg-slate-200 text-sm">
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} className="px-6 py-2 bg-fic-yellow text-fic-dark font-black uppercase rounded shadow hover:bg-yellow-400 disabled:opacity-50 text-sm">
                                {loading ? 'Guardando...' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ModalCrearProspecto;