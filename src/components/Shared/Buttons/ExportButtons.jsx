// src/components/Shared/ExportButtons.jsx
import React, { useState } from 'react';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { exportToPdf, exportToExcel } from 'utilities/Export/exportUtils';

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

export const BtnExportExcel = ({ data, fileName, title = "Excel" }) => {
    return (
        <button
            onClick={() => exportToExcel(data, fileName)}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded hover:bg-green-100 transition-colors border border-green-100"
            title="Descargar Excel"
        >
            <ArrowDownTrayIcon className="w-4 h-4" />
            {title}
        </button>
    );
};