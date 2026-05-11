import React from 'react';
import { isTextOnly } from 'utilities/Validations/validations';
import ProductoConfiguracionesEditor from './ProductoConfiguracionesEditor';
import { PRODUCTO_TIPO_OPTIONS, toBoolean } from 'utilities/productos';

const ProductoForm = ({
  data,
  handleChange,
  onConfigChange,
  onAddConfig,
  onRemoveConfig,
}) => {
  const baseInputClass = "w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-fic-red focus:border-fic-red outline-none transition-all text-sm font-medium text-slate-700 placeholder:font-normal";

  const handleInputValidation = (e) => {
    const { name, value } = e.target;

    // Validación para NOMBRE usando la utilidad importada
    if (name === 'nombre') {
       // Si isTextOnly devuelve false (contiene números o símbolos inválidos), detenemos el cambio
       if (!isTextOnly(value)) return;
    }

    handleChange(e);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Nombre del Producto</label>
          <input 
            name="nombre" 
            value={data.nombre} 
            onChange={handleInputValidation}
            className={baseInputClass} 
            placeholder="Ej: Crédito Consumo"
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Tipo de Evaluación</label>
          <select
            name="tipo_evaluacion"
            value={data.tipo_evaluacion}
            onChange={handleInputValidation}
            className={baseInputClass}
            required 
          >
            <option value="">Seleccione...</option>
            {PRODUCTO_TIPO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Estado</label>
          <select
            name="activo"
            value={toBoolean(data.activo, true) ? '1' : '0'}
            onChange={handleInputValidation}
            className={baseInputClass}
            required
          >
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>
      </div>

      <ProductoConfiguracionesEditor
        configuraciones={data.configuraciones || []}
        onConfigChange={onConfigChange}
        onAddConfig={onAddConfig}
        onRemoveConfig={onRemoveConfig}
      />
      
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Nota Importante:</strong> La tasa permitida en evaluación se resolverá según la periodicidad, el monto y el número de cuotas
          configurados para el producto. La tasa propuesta deberá ubicarse dentro de ese rango.
        </p>
      </div>
    </div>
  );
};

export default ProductoForm;
