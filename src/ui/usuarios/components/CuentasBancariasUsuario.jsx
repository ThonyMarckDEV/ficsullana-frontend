import React, { useEffect, useState } from 'react';
import AlertMessage from 'components/Shared/Errors/AlertMessage';
import { handleApiError } from 'utilities/Errors/apiErrorHandler';
import { createUsuarioCuentaBancaria, getUsuarioCuentasBancarias } from 'services/usuarioCuentaBancariaService';
import { BuildingLibraryIcon } from '@heroicons/react/24/outline';
import EntidadFinancieraSearchSelect from 'components/Shared/Comboboxes/EntidadFinancieraSearchSelect';

const CuentasBancariasUsuario = ({ usuarioId, inline = false, className = '' }) => {
  const [cuentas, setCuentas] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    entidad_financiera_id: '',
    numero_cuenta: '',
    cci: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const cuentasRes = await getUsuarioCuentasBancarias(usuarioId);
        setCuentas(cuentasRes.data || []);
      } catch (error) {
        setAlert(handleApiError(error, 'Error al cargar cuentas bancarias.'));
      }
    };
    if (usuarioId) load();
  }, [usuarioId]);

  const [selectedEntidad, setSelectedEntidad] = useState(null);

  const normalize = (value) => value.replace(/[\s-]+/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['numero_cuenta', 'cci'].includes(name)) {
      if (!/^[0-9\s-]*$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const payload = {
        entidad_financiera_id: formData.entidad_financiera_id,
        numero_cuenta: normalize(formData.numero_cuenta),
        cci: formData.cci ? normalize(formData.cci) : null,
      };

      const response = await createUsuarioCuentaBancaria(usuarioId, payload);
      setAlert({ type: 'success', message: response.message || 'Cuenta registrada.' });
      setFormData({ entidad_financiera_id: '', numero_cuenta: '', cci: '' });
      setSelectedEntidad(null);

      const cuentasRes = await getUsuarioCuentasBancarias(usuarioId);
      setCuentas(cuentasRes.data || []);
    } catch (error) {
      setAlert(handleApiError(error, 'Error al registrar la cuenta'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${inline ? '' : 'bg-white p-6 rounded-xl shadow-lg border border-t-4 border-fic-red h-full'} ${className}`}>
      {!inline && (
        <div className="flex items-center gap-2 mb-2 border-b pb-2">
          <BuildingLibraryIcon className="w-6 h-6 text-fic-red" />
          <h2 className="text-xl font-black text-slate-700 uppercase tracking-tighter">Cuentas Bancarias</h2>
        </div>
      )}

      <AlertMessage
        type={alert?.type}
        message={alert?.message}
        details={alert?.details}
        onClose={() => setAlert(null)}
      />

      {!inline && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <EntidadFinancieraSearchSelect
              selectedId={formData.entidad_financiera_id}
              initialName={selectedEntidad?.nombre || ''}
              onSelect={(entidad) => {
                setSelectedEntidad(entidad);
                setFormData(prev => ({
                  ...prev,
                  entidad_financiera_id: entidad ? entidad.id : ''
                }));
              }}
            />
            {!formData.entidad_financiera_id && (
              <input type="hidden" required value="" />
            )}
            {selectedEntidad?.longitudes_cuenta?.length > 0 && (
              <p className="text-[10px] text-slate-400 mt-1">
                Longitudes válidas: {selectedEntidad.longitudes_cuenta.join(', ')} dígitos.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Número de Cuenta</label>
            <input
              name="numero_cuenta"
              value={formData.numero_cuenta}
              onChange={handleChange}
              placeholder="Solo números"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">CCI (Opcional)</label>
            <input
              name="cci"
              value={formData.cci}
              onChange={handleChange}
              placeholder="20 dígitos"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-fic-red text-white px-6 py-2.5 rounded-lg font-black uppercase shadow-fic-red/20 shadow-lg hover:bg-red-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Guardar Cuenta'}
            </button>
          </div>
        </form>
      )}

      {!inline && (
        <div className="border-t pt-4">
          {cuentas.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No hay cuentas registradas.</p>
          ) : (
            <div className="space-y-2">
              {cuentas.map(cuenta => (
                <div key={cuenta.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">{cuenta.entidad?.nombre || 'Entidad'}</p>
                    <p className="text-sm font-black text-slate-700">{cuenta.numero_cuenta}</p>
                    <p className="text-xs text-slate-400">CCI: {cuenta.cci || 'No registrado'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CuentasBancariasUsuario;