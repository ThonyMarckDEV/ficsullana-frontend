import React from 'react';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

const DeudasGrid = ({ deudas, setDeudas }) => {
    
    const addRow = () => {
        setDeudas([...deudas, {
            persona_tipo: 'TITULAR',
            dni_relacionado: '',
            nombre_entidad: '',
            tipo_credito: 'CONSUMO',
            saldo_capital: 0,
            plazo_pendiente: 0,
            monto_cuota: 0,
            frecuencia_pago: 'MENSUAL',
            fecha_pago: '',
        }]);
    };

    const removeRow = (index) => {
        const newDeudas = deudas.filter((_, i) => i !== index);
        setDeudas(newDeudas);
    };

    const handleChange = (index, field, value) => {
        const newDeudas = [...deudas];
        newDeudas[index][field] = value;
        setDeudas(newDeudas);
    };

    const inputClass = "w-full text-xs px-2 py-1 border border-slate-300 rounded focus:border-fic-red outline-none";

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center mb-2 border-b border-fic-red pb-1">
                <h3 className="font-bold text-fic-dark text-sm uppercase">Cuadro de Endeudamiento</h3>
                <button type="button" onClick={addRow} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold hover:bg-green-200 flex items-center gap-1">
                    <PlusIcon className="w-3 h-3"/> Agregar Deuda
                </button>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase font-bold">
                        <tr>
                            <th className="p-2">Titular/Aval</th>
                            <th className="p-2 w-24">DNI</th>
                            <th className="p-2">Entidad</th>
                            <th className="p-2 w-24">Saldo Cap.</th>
                            <th className="p-2 w-16">Plazo</th>
                            <th className="p-2 w-20">Cuota</th>
                            <th className="p-2">Vencimiento</th>
                            <th className="p-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {deudas.map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-1">
                                    <select 
                                        value={row.persona_tipo} 
                                        onChange={(e) => handleChange(i, 'persona_tipo', e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="TITULAR">TITULAR</option>
                                        <option value="AVAL">AVAL</option>
                                    </select>
                                </td>
                                <td className="p-1">
                                    <input 
                                        value={row.dni_relacionado} 
                                        onChange={(e) => handleChange(i, 'dni_relacionado', e.target.value)}
                                        className={inputClass}
                                        maxLength={12}
                                        placeholder="DNI/CE"
                                    />
                                </td>
                                <td className="p-1">
                                    <input 
                                        value={row.nombre_entidad} 
                                        onChange={(e) => handleChange(i, 'nombre_entidad', e.target.value)}
                                        className={inputClass}
                                        placeholder="Banco..."
                                    />
                                </td>
                                <td className="p-1">
                                    <input 
                                        type="number" step="0.01"
                                        value={row.saldo_capital} 
                                        onChange={(e) => handleChange(i, 'saldo_capital', e.target.value)}
                                        className={inputClass}
                                    />
                                </td>
                                <td className="p-1">
                                    <input 
                                        type="number"
                                        value={row.plazo_pendiente} 
                                        onChange={(e) => handleChange(i, 'plazo_pendiente', e.target.value)}
                                        className={inputClass}
                                    />
                                </td>
                                <td className="p-1">
                                    <input 
                                        type="number" step="0.01"
                                        value={row.monto_cuota} 
                                        onChange={(e) => handleChange(i, 'monto_cuota', e.target.value)}
                                        className={inputClass}
                                    />
                                </td>
                                <td className="p-1">
                                    <input 
                                        type="date"
                                        value={row.fecha_pago} 
                                        onChange={(e) => handleChange(i, 'fecha_pago', e.target.value)}
                                        className={inputClass}
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
                {deudas.length === 0 && <div className="p-4 text-center text-slate-400 italic text-xs">No hay deudas registradas</div>}
            </div>
        </div>
    );
};

export default DeudasGrid;