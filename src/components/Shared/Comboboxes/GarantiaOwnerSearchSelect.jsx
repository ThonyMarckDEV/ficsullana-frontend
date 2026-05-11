import React, { memo, useCallback, useEffect, useId, useMemo, useState } from 'react';
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import useSearchDropdown from 'hooks/useSearchDropdown';
import { getGarantiasByOwner } from 'services/garantiaService';

const buildGarantiaLabel = (garantia) => (
  String(garantia?.descripcion || '').trim() || `Garantía #${garantia?.id || 'N/A'}`
);

const buildGarantiaMeta = (garantia) => [
  garantia?.documento_garantia,
  garantia?.tipo_garantia,
  garantia?.moneda?.codigo || garantia?.moneda?.nombre,
]
  .filter(Boolean)
  .join(' • ');

const buildSearchableText = (garantia) => (
  [
    garantia?.descripcion,
    garantia?.documento_garantia,
    garantia?.tipo_garantia,
    garantia?.direccion,
    garantia?.ficha_registral,
    garantia?.valor_bien,
    garantia?.moneda?.codigo,
    garantia?.moneda?.nombre,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
);

const GarantiaOwnerSearchSelect = ({
  lookupEnabled = false,
  optionsSource = null,
  admisionId = null,
  evaluacionConsumoAvalId = null,
  selectedId,
  initialLabel = '',
  onSelect,
  disabled = false,
  compact = false,
  label = 'Buscar garantía registrada',
  placeholder = 'Buscar por descripción, documento, tipo o dirección',
}) => {
  const inputId = useId();
  const {
    wrapperRef,
    inputValue,
    setInputValue,
    showSuggestions,
    setShowSuggestions,
    reopenSuggestions,
  } = useSearchDropdown({
    initialInputValue: initialLabel,
    syncInputValue: false,
  });
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState('');

  useEffect(() => {
    if (!selectedId) {
      setInputValue('');
      return;
    }

    setInputValue(initialLabel || '');
  }, [initialLabel, selectedId, setInputValue]);

  useEffect(() => {
    if (Array.isArray(optionsSource)) {
      setOptions(optionsSource);
      setLoading(false);
      setLoadingError('');
      return;
    }

    if (!admisionId && !evaluacionConsumoAvalId) {
      setOptions([]);
      setLoading(false);
      setLoadingError('');
      return;
    }

    let isMounted = true;

    const loadOptions = async () => {
      try {
        setLoading(true);
        setLoadingError('');
        const response = await getGarantiasByOwner({
          admisionId,
          evaluacionConsumoAvalId,
        });

        if (!isMounted) {
          return;
        }

        setOptions(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setOptions([]);
        setLoadingError(error?.message || 'No se pudo cargar las garantías del titular.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, [admisionId, evaluacionConsumoAvalId, optionsSource]);

  const indexedOptions = useMemo(() => (
    options.map((garantia) => ({
      garantia,
      searchableText: buildSearchableText(garantia),
    }))
  ), [options]);

  const suggestions = useMemo(() => {
    if (!showSuggestions) {
      return [];
    }

    const normalizedSearch = String(inputValue || '').trim().toLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return indexedOptions
      .filter((item) => item.searchableText.includes(normalizedSearch))
      .map((item) => item.garantia);
  }, [indexedOptions, inputValue, options, showSuggestions]);

  const handleSelect = useCallback((garantia) => {
    setInputValue(buildGarantiaLabel(garantia));
    setShowSuggestions(false);
    onSelect?.(garantia);
  }, [onSelect, setInputValue, setShowSuggestions]);

  const isSearchDisabled = disabled || !lookupEnabled;

  return (
    <div className="relative" ref={wrapperRef}>
      <label htmlFor={inputId} className="mb-1 block text-xs font-bold uppercase text-slate-500">{label}</label>

      <div className="relative flex items-center">
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            setInputValue(nextValue);
            setLoadingError('');
            if (selectedId) {
              onSelect?.(null);
            }
          }}
          onClick={() => {
            if (!showSuggestions) {
              reopenSuggestions(options.length);
            }
          }}
          disabled={isSearchDisabled}
          placeholder={lookupEnabled ? placeholder : 'Disponible cuando el aval exista en el maestro'}
          className={`w-full rounded-md border py-2 pl-3 pr-10 text-sm shadow-sm outline-none transition-colors ${
            selectedId
              ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-800'
              : 'border-slate-300 bg-white focus:border-fic-red focus:ring-1 focus:ring-fic-red'
          } ${isSearchDisabled ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
          autoComplete="off"
        />

        <button
          type="button"
          onClick={() => reopenSuggestions(options.length)}
          disabled={isSearchDisabled || loading}
          className="absolute right-2 p-1 text-slate-400 hover:text-fic-red"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-fic-red" />
          ) : selectedId ? (
            <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
          ) : (
            <MagnifyingGlassIcon className="h-5 w-5" />
          )}
        </button>

        {showSuggestions ? (
          <ul className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex cursor-pointer items-start gap-3 border-b border-slate-100 px-4 py-3 text-sm last:border-none hover:bg-slate-50"
                >
                  <div className="rounded-full bg-slate-100 p-2">
                    <ShieldCheckIcon className="h-4 w-4 text-slate-500" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold uppercase text-slate-700">
                      {buildGarantiaLabel(item)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {buildGarantiaMeta(item) || 'Sin metadatos visibles'}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Valor del bien: {item?.valor_bien ?? 'N/A'}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-center text-xs italic text-slate-500">
                {loadingError || 'No se encontraron garantías registradas para este titular.'}
              </li>
            )}
          </ul>
        ) : null}
      </div>

      {loadingError && !showSuggestions ? (
        <p className="mt-1 text-[11px] text-red-600">{loadingError}</p>
      ) : null}

      {!lookupEnabled && !compact ? (
        <p className="mt-1 text-[11px] text-slate-500">
          La búsqueda contextual se habilita cuando el aval seleccionado exista en el maestro.
        </p>
      ) : null}
    </div>
  );
};

export default memo(GarantiaOwnerSearchSelect);
