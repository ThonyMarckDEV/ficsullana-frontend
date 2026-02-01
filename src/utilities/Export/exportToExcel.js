import { utils, writeFile } from 'xlsx';

/**
 * Busca una tabla dentro de un elemento HTML y la exporta a Excel.
 * @param {string} elementId - ID del contenedor (el mismo que usas para PDF).
 * @param {string} fileName - Nombre del archivo (ej: 'reporte.xlsx').
 */
export const exportTableToExcel = (elementId, fileName = 'data.xlsx') => {
    const container = document.getElementById(elementId);

    if (!container) {
        console.error(`Elemento con id ${elementId} no encontrado`);
        return false;
    }

    // Buscamos la etiqueta <table> dentro del contenedor del modal
    const tableElement = container.querySelector('table');

    if (!tableElement) {
        alert("No se encontró una tabla para exportar a Excel en esta vista.");
        return false;
    }

    try {
        // 1. Convertir la tabla HTML a una hoja de trabajo (WorkSheet)
        const ws = utils.table_to_sheet(tableElement);

        // 2. Crear un libro de trabajo (WorkBook)
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Datos");

        // 3. Descargar archivo
        // Aseguramos que termine en .xlsx
        const finalName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
        writeFile(wb, finalName);
        
        return true;
    } catch (error) {
        console.error("Error exportando a Excel:", error);
        return false;
    }
};