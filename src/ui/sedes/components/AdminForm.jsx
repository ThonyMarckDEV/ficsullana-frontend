import React from 'react';

const AdminForm = ({ data, handleChange, isEdit = false }) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm";

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b border-fic-yellow pb-2">
        <span className="font-bold text-fic-dark text-lg">2. Datos del Administrador</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">DNI</label>
          <input name="dni" value={data.dni} onChange={(e) => handleChange(e, 'admin')} className={baseInputClass} maxLength={8} required />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre</label>
          <input name="nombre" value={data.nombre} onChange={(e) => handleChange(e, 'admin')} className={baseInputClass} required />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Apellido Paterno</label>
        <input name="apellidoPaterno" value={data.apellidoPaterno} onChange={(e) => handleChange(e, 'admin')} className={baseInputClass} required />
      </div>
      <div className="pt-2 border-t border-dashed border-fic-yellow">
        <p className="text-xs text-fic-red font-black mb-3 uppercase tracking-wider">
          {isEdit ? 'Actualizar Acceso' : 'Credenciales de Acceso'}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <input name="username" placeholder="Usuario" value={data.username} onChange={(e) => handleChange(e, 'admin')} className={baseInputClass} required />
          <input type="password" name="password" placeholder={isEdit ? "Nueva clave (opcional)" : "Contraseña"} value={data.password} onChange={(e) => handleChange(e, 'admin')} className={baseInputClass} required={!isEdit} />
        </div>
      </div>
    </div>
  );
};

export default AdminForm;