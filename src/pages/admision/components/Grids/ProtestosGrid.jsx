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

    const inputClass = "w-full text-xs px-2 py-1 border border-slate-300 rounded focus:border-fic-red outline-none invalid:border-red-500 invalid:text-red-600 transition-colors";

    return (
        <div className="space-y-2 mt-6">
             <div className="flex justify-between items-center mb-2 border-b border-fic-red pb-1">
                <h3 className="font-bold text-fic-dark text-sm uppercase">Cuadro de Protestos</h3>
                <button type="button" onClick={addRow} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200 flex items-center gap-1">
                    <PlusIcon className="w-3 h-3"/> Agregar Protesto
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px]">
                        <tr>
                            <th className="p-2">Entidad Acreedora</th>
                            <th className="p-2 w-32">Documento</th>
                            <th className="p-2 w-24">Monto</th>
                            <th className="p-2 w-24">Días Atraso</th>
                            <th className="p-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {protestos.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-1">
                                    <input 
                                        value={row.entidad_acreedora} 
                                        onChange={(e) => handleChange(i, 'entidad_acreedora', e.target.value)}
                                        className={`${inputClass} uppercase`} placeholder="Entidad..."
                                    />
                                </td>
                                <td className="p-1">
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
                                <td className="p-1">
                                    <input 
                                        type="number" step="0.01" min="0.01" // <--- VALIDACIÓN: > 0
                                        value={row.monto_deuda} 
                                        onChange={(e) => handleChange(i, 'monto_deuda', e.target.value)}
                                        className={inputClass}
                                        placeholder=">0.00"
                                    />
                                </td>
                                <td className="p-1">
                                    <input 
                                        type="number" min="1" step="1" // <--- VALIDACIÓN: > 0
                                        value={row.dias_vencimiento} 
                                        onChange={(e) => handleChange(i, 'dias_vencimiento', e.target.value)}
                                        className={`${inputClass} ${row.dias_vencimiento > 0 ? 'text-red-600 font-bold' : ''}`}
                                        placeholder=">0"
                                    />
                                </td>
                                <td className="p-1 text-center">
                                    <button type="button" onClick={() => removeRow(i)} className="text-red-400 hover:text-red-600">
                                        <TrashIcon className="w-4 h-4"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {protestos.length === 0 && <div className="p-4 text-center text-slate-400 italic text-xs">Sin protestos registrados</div>}
            </div>
        </div>
    );
};

export default ProtestosGrid;
