import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { EVAL_CONSUMO_COPY } from 'utilities/pages/evaluacion/consumo/copy';
import {
  buildAvalFullName,
  buildAvalDireccion,
  createAvalGarantiaRow,
  createAvalState,
  mapAvalLookupToState,
} from 'utilities/pages/evaluacion/consumo/transformers';
import {
  clearLinkedGarantiaSelections,
  mapGarantiaLookupToRow,
  syncGarantiasWithAvalDireccion,
} from 'utilities/pages/evaluacion/consumo/avalWorkflow';
import useModalFocusTrap from '../../hooks/useModalFocusTrap';
import AvalDataSection from './aval/AvalDataSection';
import AvalExitConfirmModal from './aval/AvalExitConfirmModal';
import AvalGarantiasSection from './aval/AvalGarantiasSection';
import AvalModalHeader from './aval/AvalModalHeader';
import { DOCUMENT_LENGTHS } from './aval/AvalModalShared';

/**
 * Fields that feed into buildAvalDireccion. Only when one of these changes
 * do we need to re-sync garantia address copies.
 */
const AVAL_DIRECCION_FIELDS = new Set([
  'tipoVia', 'nombreVia', 'numeroMzLt', 'urbanizacion',
  'departamento', 'provincia', 'distrito', 'direccion',
]);

const createDraftFromGroup = (group) => {
  if (!group) {
    return {
      slot: null,
      avalIndex: null,
      aval: createAvalState(),
      garantias: [],
    };
  }

  return {
    slot: group.slot,
    avalIndex: group.avalIndex,
    aval: createAvalState(group.aval),
    garantias: (group.garantias || []).map(({ formIndex, ...garantia }) => (
      createAvalGarantiaRow({
        ...garantia,
        aval_slot: String(group.slot),
      })
    )),
  };
};

const withLocalFormIndexes = (garantias = []) => (
  garantias.map((garantia, index) => ({
    ...garantia,
    formIndex: index,
  }))
);

const AvalModal = ({
  isOpen,
  onClose,
  group,
  disabled,
  catalogos,
  onApplyDraft,
  onDirtyChange,
  openReason,
  dirtyState,
  exitConfirmOpen,
  onCancelExit,
  onConfirmExit,
}) => {
  const dialogRef = useRef(null);
  const closeBtnRef = useRef(null);
  const copy = EVAL_CONSUMO_COPY.MODALS.AVAL;
  const [draft, setDraft] = useState(() => createDraftFromGroup(null));

  useEffect(() => {
    if (!isOpen || !group) {
      return;
    }

    setDraft(createDraftFromGroup(group));
  }, [group, isOpen]);

  useModalFocusTrap({
    isOpen: isOpen && !exitConfirmOpen,
    dialogRef,
    initialFocusRef: closeBtnRef,
    onClose,
  });

  const currentAval = draft.aval || createAvalState();
  const documentoMaxLength = DOCUMENT_LENGTHS[currentAval.tipo_documento] || 8;
  const isCarnetExtranjeria = currentAval.tipo_documento === 'CE';
  const hasSelectedAval = Boolean(currentAval.aval_id) && currentAval.is_existing;
  const isManualMode = Boolean(currentAval.manual_mode);
  const fieldsLocked = disabled || hasSelectedAval;
  const headerName = buildAvalFullName(currentAval) || group?.displayName || 'Aval';
  const draftGarantias = useMemo(() => withLocalFormIndexes(draft.garantias), [draft.garantias]);
  const lookupEnabled = hasSelectedAval;
  const lookupOptions = hasSelectedAval && Array.isArray(currentAval.garantias_registradas)
    ? currentAval.garantias_registradas
    : null;

  const commitDraft = useCallback(() => {
    if (draft.slot === null) {
      return;
    }

    onApplyDraft?.(draft.slot, draft.aval, draft.garantias);
  }, [draft.aval, draft.garantias, draft.slot, onApplyDraft]);

  const handleClose = useCallback(() => {
    if (!dirtyState) {
      onClose?.();
      return;
    }

    onClose?.();
  }, [dirtyState, onClose]);

  const handleConfirmExit = useCallback(() => {
    commitDraft();
    onConfirmExit?.();
  }, [commitDraft, onConfirmExit]);

  const setDraftAvalField = useCallback((avalIndex, name, value) => {
    setDraft((previousDraft) => {
      const nextAvalPayload = {
        ...previousDraft.aval,
        [name]: value,
      };

      if (name !== 'direccion') {
        nextAvalPayload.direccion = '';
      }

      const nextAval = createAvalState(nextAvalPayload);

      return {
        ...previousDraft,
        aval: nextAval,
        // Only sync address copies when a direction-related field changed.
        // Skipping this on every keystroke (e.g. nombres, telefono) is the
        // main source of unnecessary work that made the modal feel sluggish.
        garantias: AVAL_DIRECCION_FIELDS.has(name)
          ? syncGarantiasWithAvalDireccion(previousDraft.garantias, previousDraft.slot, nextAval)
          : previousDraft.garantias,
      };
    });
  }, []);

  const handleDraftAvalSelect = useCallback((avalIndex, selectedAval) => {
    setDraft((previousDraft) => {
      const currentDraftAval = previousDraft.aval || createAvalState();
      const mappedAval = selectedAval
        ? mapAvalLookupToState(selectedAval)
        : createAvalState({ client_id: currentDraftAval.client_id });
      const nextAval = createAvalState({
        ...mappedAval,
        client_id: currentDraftAval.client_id,
      });

      return {
        ...previousDraft,
        aval: nextAval,
        garantias: clearLinkedGarantiaSelections(
          syncGarantiasWithAvalDireccion(previousDraft.garantias, previousDraft.slot, nextAval),
          previousDraft.slot
        ),
      };
    });
  }, []);

  const startDraftManualRegistration = useCallback((avalIndex) => {
    setDraft((previousDraft) => {
      const currentDraftAval = previousDraft.aval || createAvalState();
      const nextAval = createAvalState({
        client_id: currentDraftAval.client_id,
        manual_mode: true,
        tipo_documento: currentDraftAval.tipo_documento || 'DNI',
      });

      return {
        ...previousDraft,
        aval: nextAval,
        garantias: clearLinkedGarantiaSelections(previousDraft.garantias, previousDraft.slot),
      };
    });
  }, []);

  const cancelDraftManualRegistration = useCallback((avalIndex) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      aval: createAvalState({
        client_id: previousDraft.aval?.client_id,
      }),
      garantias: clearLinkedGarantiaSelections(previousDraft.garantias, previousDraft.slot),
    }));
  }, []);

  const handleDraftGarantiaChange = useCallback((index, field, value) => {
    setDraft((previousDraft) => {
      const nextGarantias = [...previousDraft.garantias];
      const currentRow = createAvalGarantiaRow(nextGarantias[index]);
      const nextRow = createAvalGarantiaRow({
        ...currentRow,
        [field]: value,
        aval_slot: String(previousDraft.slot),
      });

      nextGarantias[index] = nextRow.usar_direccion_solicitante
        ? { ...nextRow, direccion: buildAvalDireccion(previousDraft.aval) }
        : nextRow;

      return {
        ...previousDraft,
        garantias: nextGarantias,
      };
    });
  }, []);

  const addDraftGarantiaToAval = useCallback((avalSlot) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      garantias: [
        ...previousDraft.garantias,
        createAvalGarantiaRow({
          aval_slot: String(previousDraft.slot || avalSlot),
        }),
      ],
    }));
  }, []);

  const handleDraftGarantiaLookupSelect = useCallback((index, selectedGarantia) => {
    setDraft((previousDraft) => {
      const nextGarantias = [...previousDraft.garantias];
      const currentRow = createAvalGarantiaRow(nextGarantias[index]);
      const nextRow = selectedGarantia
        ? mapGarantiaLookupToRow(selectedGarantia, currentRow)
        : createAvalGarantiaRow({
          ...currentRow,
          garantia_id: '',
        });

      nextGarantias[index] = createAvalGarantiaRow({
        ...nextRow,
        aval_slot: String(previousDraft.slot),
      });

      return {
        ...previousDraft,
        garantias: nextGarantias,
      };
    });
  }, []);

  const removeDraftGarantia = useCallback((index) => {
    setDraft((previousDraft) => ({
      ...previousDraft,
      garantias: previousDraft.garantias.filter((_, rowIndex) => rowIndex !== index),
    }));
  }, []);

  const toggleDraftGarantiaDireccion = useCallback((index, checked) => {
    setDraft((previousDraft) => {
      const nextGarantias = [...previousDraft.garantias];
      const currentRow = createAvalGarantiaRow(nextGarantias[index]);

      nextGarantias[index] = createAvalGarantiaRow({
        ...currentRow,
        usar_direccion_solicitante: checked,
        direccion: checked ? buildAvalDireccion(previousDraft.aval) : '',
      });

      return {
        ...previousDraft,
        garantias: nextGarantias,
      };
    });
  }, []);

  if (!isOpen) {
    return null;
  }

  if (!group) {
    return (
      <AvalExitConfirmModal
        isOpen={exitConfirmOpen}
        title={copy.EXIT_CONFIRM.TITLE}
        message={copy.EXIT_CONFIRM.MESSAGE}
        cancelText={copy.EXIT_CONFIRM.CANCEL}
        confirmText={copy.EXIT_CONFIRM.CONFIRM}
        onCancel={onCancelExit}
        onConfirm={handleConfirmExit}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-fic-dark/80 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="aval-modal-title"
        aria-describedby="aval-modal-description"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
      >
        <p id="aval-modal-description" className="sr-only">{copy.DESCRIPTION}</p>
        <AvalModalHeader
          group={group}
          headerName={headerName}
          openReason={openReason}
          dirtyState={dirtyState}
        />

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <AvalDataSection
            avalSlot={group.slot}
            avalIndex={group.avalIndex}
            currentAval={currentAval}
            disabled={disabled}
            fieldsLocked={fieldsLocked}
            hasSelectedAval={hasSelectedAval}
            isManualMode={isManualMode}
            isCarnetExtranjeria={isCarnetExtranjeria}
            documentoMaxLength={documentoMaxLength}
            setAvalField={setDraftAvalField}
            onAvalSelect={handleDraftAvalSelect}
            onStartManualRegistration={startDraftManualRegistration}
            onCancelManualRegistration={cancelDraftManualRegistration}
            onDirtyChange={onDirtyChange}
          />

          <AvalGarantiasSection
            avalSlot={group.slot}
            garantias={draftGarantias}
            lookupEnabled={lookupEnabled}
            lookupOptions={lookupOptions}
            disabled={disabled}
            catalogos={catalogos}
            onGarantiaChange={handleDraftGarantiaChange}
            onAddGarantiaToAval={addDraftGarantiaToAval}
            onGarantiaLookupSelect={handleDraftGarantiaLookupSelect}
            onRemoveGarantia={removeDraftGarantia}
            onToggleGarantiaDireccion={toggleDraftGarantiaDireccion}
            onDirtyChange={onDirtyChange}
          />
        </div>

        <div className="flex items-center justify-end border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={handleClose}
            aria-label={copy.RETURN}
            className="inline-flex items-center gap-2 rounded-lg bg-fic-dark px-4 py-2.5 text-xs font-black uppercase text-white transition hover:bg-slate-800"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            {copy.RETURN}
          </button>
        </div>
      </div>

      <AvalExitConfirmModal
        isOpen={exitConfirmOpen}
        title={copy.EXIT_CONFIRM.TITLE}
        message={copy.EXIT_CONFIRM.MESSAGE}
        cancelText={copy.EXIT_CONFIRM.CANCEL}
        confirmText={copy.EXIT_CONFIRM.CONFIRM}
        onCancel={onCancelExit}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
};

export default AvalModal;
