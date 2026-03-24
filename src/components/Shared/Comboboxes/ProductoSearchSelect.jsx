import React, { useEffect, useId, useMemo } from 'react';
import { CheckCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import useSearchDropdown from 'hooks/useSearchDropdown';
import { buildProductoConfiguracionSummary, normalizeProducto } from 'utilities/productos';

const ProductoSearchSelect = ({
  options = [],
  selectedId = null,
  onSelect,
  disabled = false,
  label = 'Buscar Producto',
  placeholder = 'Buscar producto...',
}) => {
  const inputId = useId();
  const normalizedOptions = useMemo(
    () => (Array.isArray(options) ? options.map(normalizeProducto) : []),
    [options]
  );
  const {
    wrapperRef,
    inputValue,
    setInputValue,
    showSuggestions,
    openSuggestions,
    closeSuggestions,
    reopenSuggestions,
  } = useSearchDropdown();

  const selectedProducto = useMemo(
    () => normalizedOptions.find((item) => Number(item.id) === Number(selectedId)) || null,
    [normalizedOptions, selectedId]
  );

  useEffect(() => {
    setInputValue(selectedProducto?.nombre || '');
  }, [selectedProducto, setInputValue]);

  const filtered = useMemo(() => {
    const term = inputValue.trim().toLowerCase();
    const list = term === ''
      ? normalizedOptions
      : normalizedOptions.filter((item) => {
        const summary = buildProductoConfiguracionSummary(item);
        const haystack = [
          item.nombre,
          summary.overallRangeLabel,
          ...(summary.periodicidades || []),
        ].join(' ').toLowerCase();

        return haystack.includes(term);
      });

    return list.slice(0, 30);
  }, [inputValue, normalizedOptions]);

  const handleSelect = (producto) => {
    setInputValue(producto?.nombre || '');
    closeSuggestions();
    onSelect?.(producto || null);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label htmlFor={inputId} className="block text-xs font-bold text-slate-500 mb-1 uppercase">
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(event) => {
            const value = event.target.value;
            setInputValue(value);
            openSuggestions();

            if (selectedId) {
              onSelect?.(null);
            }
          }}
          onFocus={openSuggestions}
          onClick={() => reopenSuggestions(filtered.length)}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
          className={`w-full border rounded-md shadow-sm py-2 pl-3 pr-10 outline-none text-sm transition-colors ${
            selectedId
              ? 'border-green-500 bg-green-50 text-green-800 font-bold'
              : 'border-gray-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red'
          }`}
        />

        <div className="absolute right-2 text-gray-400 p-1 pointer-events-none">
          {selectedId ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
        </div>

        {showSuggestions && !disabled && (
          <ul className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                (() => {
                  const summary = buildProductoConfiguracionSummary(item);
                  return (
                    <li
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b border-gray-100 last:border-none"
                    >
                      <p className="font-bold text-slate-700 uppercase text-xs">{item.nombre}</p>
                      <p className="text-[10px] text-slate-400">Rango: {summary.overallRangeLabel}</p>
                      {summary.totalConfiguraciones > 0 ? (
                        <p className="text-[10px] text-slate-400">
                          {summary.totalConfiguraciones} tramos / {summary.periodicidades.join(', ')}
                        </p>
                      ) : null}
                    </li>
                  );
                })()
              ))
            ) : (
              <li className="px-4 py-3 text-slate-500 text-xs italic text-center">
                No se encontraron productos.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductoSearchSelect;
