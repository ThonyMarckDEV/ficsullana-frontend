// src/components/Shared/ExportButtons.jsx
import React, { useState } from 'react';
import { PrinterIcon } from '@heroicons/react/24/outline';
import { exportToPdf } from 'utilities/Export/exportUtils';

export const BtnExportPdf = ({ elementId, fileName, title = "PDF" }) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        setLoading(true);
        // Pequeño timeout para permitir que el estado de carga se renderice si fuera visual
        setTimeout(async () => {
            await exportToPdf(elementId, fileName);
            setLoading(false);
        }, 100);
    };

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-fic-red text-xs font-bold rounded hover:bg-red-100 transition-colors border border-red-100"
            title="Descargar PDF Completo"
        >
            <PrinterIcon className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
            {loading ? 'Generando...' : title}
        </button>
    );
};
