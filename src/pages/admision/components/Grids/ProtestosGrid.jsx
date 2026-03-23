import React from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const ProtestosGrid = ({ protestos, setProtestos }) => {
    
    const addRow = () => {
        setProtestos([...protestos, {
            entidad_acreedora: '',
            monto_deuda: '',
            dias_vencimiento: '',
            documento_tipo: 'LETRA'
        }]);
    };

    const removeRow = (index) => {
        setProtestos(protestos.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const newProtestos = [...protestos];
        newProtestos[index][field] = field === 'entidad_acreedora' ? value.toUpperCase() : value;
        setProtestos(newProtestos);
    };

    const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-fic-red focus:ring-2 focus:ring-red-100 invalid:border-red-500 invalid:text-red-600";

    return (
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.45)] sm:p-5">
             <div className="mb-4 flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.08em] text-slate-800">Cuadro de Protestos</h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Mantén separados los protestos externos. Aquí solo importa la deuda comercial reportada y sus días de atraso.
                    </p>
                </div>
                <button type="button" onClick={addRow} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-emerald-700 transition hover:bg-emerald-100">
                    <PlusIcon className="h-4 w-4"/> Agregar protesto
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-[0.08em] text-slate-500">
                        <tr>
                            <th className="p-3">Entidad Acreedora</th>
                            <th className="p-3 w-40">Documento</th>
                            <th className="p-3 w-32">Monto</th>
                            <th className="p-3 w-36">Días Atraso</th>
                            <th className="p-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {protestos.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-2">
                                    <input 
                                        value={row.entidad_acreedora} 
                                        onChange={(e) => handleChange(i, 'entidad_acreedora', e.target.value)}
                                        className={`${inputClass} uppercase`} placeholder="Entidad..."
                                    />
                                </td>
                                <td className="p-2">
                                    <select 
                                        value={row.documento_tipo} 
                                        onChange={(e) => handleChange(i, 'documento_tipo', e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="LETRA">LETRA</option>
                                        <option value="PAGARE">PAGARÉ</option>
                                        <option value="FACTURA">FACTURA</option>
                                    </select>
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="number" step="0.01" min="0.01"
                                        value={row.monto_deuda} 
                                        onChange={(e) => handleChange(i, 'monto_deuda', e.target.value)}
                                        className={inputClass}
                                        placeholder=">0.00"
                                    />
                                </td>
                                <td className="p-2">
                                    <input 
                                        type="number" min="1" step="1"
                                        value={row.dias_vencimiento} 
                                        onChange={(e) => handleChange(i, 'dias_vencimiento', e.target.value)}
                                        className={`${inputClass} ${row.dias_vencimiento > 0 ? 'text-red-600 font-bold' : ''}`}
                                        placeholder=">0"
                                    />
                                </td>
                                <td className="p-2 text-center">
                                    <button type="button" onClick={() => removeRow(i)} className="rounded-xl p-2 text-red-400 transition hover:bg-red-50 hover:text-red-600">
                                        <TrashIcon className="h-4 w-4"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {protestos.length === 0 && <div className="p-6 text-center text-sm italic text-slate-400">Sin protestos registrados</div>}
            </div>
        </div>
    );
};

export default ProtestosGrid;