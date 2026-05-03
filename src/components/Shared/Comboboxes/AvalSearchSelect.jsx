import React, { useCallback } from 'react';
import {
  CheckCircleIcon,
  IdentificationIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import useRemoteSearchSelect from 'hooks/useRemoteSearchSelect';
import { getAvalesCombobox } from 'services/avalService';

const MIN_SEARCH_LENGTH = 2;

const buildNombreCompleto = (aval) => (
  [
    aval?.nombres,
    aval?.apellido_paterno,
    aval?.apellido_materno,
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
);

const getTipoDocumento = (aval) => (aval?.es_carnet_extranjeria ? 'CE' : 'DNI');

const AvalSearchSelect = ({
  onSelect,
  selectedId,
  initialLabel = '',
  disabled = false,
  label = 'Buscar aval existente',
  placeholder = 'Buscar por DNI, CE o nombres y apellidos',
  compact = false,
}) => {
  const searchAvales = useCallback(
    (searchTerm = '') => getAvalesCombobox(1, searchTerm),
    []
  );

  const {
    wrapperRef,
    inputValue,
    setInputValue,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    loading,
    searchError,
    setSearchError,
    runSearch,
    reopenSuggestions,
    markSelectionClearedInternally,
  } = useRemoteSearchSelect({
    selectedId,
    initialValue: initialLabel,
    disabled,
    minSearchLength: MIN_SEARCH_LENGTH,
    minSearchMessage: 'Ingresa al menos 2 caracteres para buscar avales.',
    searchFn: searchAvales,
  });

  const handleSelect = (aval) => {
    setInputValue(buildNombreCompleto(aval));
    setSearchError('');
    setShowSuggestions(false);
    onSelect?.(aval);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className={`mb-1 block text-xs font-bold uppercase ${compact ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
      <div className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            setInputValue(nextValue);
            setSearchError('');
            setShowSuggestions(false);
            if (selectedId) {
              markSelectionClearedInternally();
              onSelect?.(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              runSearch();
            }
          }}
          onClick={() => {
            if (!showSuggestions) {
              runSearch(inputValue);
              return;
            }
            reopenSuggestions();
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full border rounded-md shadow-sm py-2 pl-3 pr-10 outline-none text-sm transition-colors ${
            selectedId
              ? 'border-green-500 bg-green-50 text-green-800 font-bold'
              : 'border-slate-300 focus:border-fic-red focus:ring-1 focus:ring-fic-red'
          } ${disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => runSearch()}
          disabled={disabled || loading}
          className="absolute right-2 text-slate-400 hover:text-fic-red p-1"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-slate-300 border-t-fic-red rounded-full animate-spin" />
          ) : selectedId ? (
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
        </button>

        {showSuggestions ? (
          <ul className="absolute z-50 top-full left-0 w-full bg-white border border-slate-200 rounded-lg mt-1 max-h-60 overflow-y-auto shadow-xl">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer text-sm border-b border-slate-100 last:border-none flex items-center gap-3 group"
                >
                  <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white transition-all">
                    <IdentificationIcon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-700 uppercase text-xs">
                      {buildNombreCompleto(item)}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {getTipoDocumento(item)}: {item.numero_documento}
                    </p>
                  </div>
                </li>
              ))
            ) : searchError ? (
              <li className="p-3 bg-red-50 text-center">
                <p className="text-xs text-red-700 mb-2">{searchError}</p>
                <button
                  type="button"
                  onClick={() => runSearch()}
                  disabled={loading}
                  className="bg-fic-red text-white text-xs px-4 py-2 rounded-md font-bold shadow hover:bg-red-700 w-full"
                >
                  Reintentar búsqueda
                </button>
              </li>
            ) : (
              <li className="px-4 py-3 text-slate-500 text-xs italic text-center">
                No se encontraron avales.
              </li>
            )}
          </ul>
        ) : null}
      </div>
      {searchError && !showSuggestions ? (
        <p className="text-[11px] text-red-600 mt-1">{searchError}</p>
      ) : null}
    </div>
  );
};

export default AvalSearchSelect;
