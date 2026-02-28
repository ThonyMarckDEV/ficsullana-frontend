import React from 'react';
import { XMarkIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { BtnExportPdf } from 'components/Shared/Buttons/ExportButtons';
import { ADMISION_COPY_DETAIL_MODAL } from 'utilities/pages/admision/copy';
import { formatDateOnly } from '../../../../../utilities/pages/admision/viewModel';

const AdmisionDetailHeader = ({
  loading,
  currentData,
  exportContainerId,
  onClose,
}) => (
  <div className="bg-fic-red px-5 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-white/20 rounded-full text-white">
        <DocumentTextIcon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-lg font-black text-white uppercase leading-none">{ADMISION_COPY_DETAIL_MODAL.HEADER.TITLE}</h3>
        <p className="text-red-100 text-xs font-medium mt-1">
          {loading
            ? ADMISION_COPY_DETAIL_MODAL.HEADER.SUBTITLE_LOADING
            : `${ADMISION_COPY_DETAIL_MODAL.HEADER.SUBTITLE_PREFIX} #${currentData?.id || '---'} - ${ADMISION_COPY_DETAIL_MODAL.HEADER.SUBTITLE_CREATED_AT}: ${formatDateOnly(currentData?.created_at)}`}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      {!loading && (
        <BtnExportPdf
          elementId={exportContainerId}
          fileName={`${ADMISION_COPY_DETAIL_MODAL.HEADER.EXPORT_FILE_PREFIX}-${currentData?.id || 'detalle'}.pdf`}
        />
      )}
      <button onClick={onClose} className="text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full">
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

export default AdmisionDetailHeader;