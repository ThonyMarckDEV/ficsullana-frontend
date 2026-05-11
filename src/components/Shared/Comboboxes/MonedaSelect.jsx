import React from 'react';

const defaultLabelClassName = 'block text-xs font-bold text-slate-500 mb-1 uppercase';
const defaultSelectClassName = 'w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-fic-red';

const MonedaSelect = ({
  id = 'moneda-select',
  label = 'Moneda',
  monedas = [],
  value = '',
  onChange,
  disabled = false,
  placeholder = 'SELECCIONE...',
  wrapperClassName = '',
  labelClassName = defaultLabelClassName,
  selectClassName = defaultSelectClassName,
}) => (
  <div className={wrapperClassName}>
    <label htmlFor={id} className={labelClassName}>{label}</label>
    <select
      id={id}
      className={selectClassName}
      value={value}
      onChange={(event) => onChange?.(event.target.value, event)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {(monedas || []).map((item) => (
        <option key={item.id} value={item.id}>{item.nombre}</option>
      ))}
    </select>
  </div>
);

export default MonedaSelect;