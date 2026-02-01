import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Convierte un elemento HTML en un archivo PDF y lo descarga.
 * @param {string} elementId - El ID del elemento del DOM a exportar (ej: 'modal-content').
 * @param {string} fileName - Nombre del archivo a descargar (ej: 'reporte.pdf').
 */
export const exportElementToPdf = async (elementId, fileName = 'documento.pdf') => {
    const input = document.getElementById(elementId);

    if (!input) {
        console.error(`Elemento con id ${elementId} no encontrado`);
        return;
    }

    try {
        // 1. Capturar el contenido como un canvas (imagen)
        // scale: 2 mejora la calidad de la imagen
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');

        // 2. Configurar el PDF (A4 por defecto)
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // 3. Calcular dimensiones para ajustar la imagen al PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Ajustar al ancho de la página A4 (con un pequeño margen si quieres)
        const ratio = imgWidth / pdfWidth;
        const finalHeight = imgHeight / ratio;

        // 4. Agregar la imagen al PDF
        // params: (imagen, tipo, x, y, ancho, alto)
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, finalHeight);

        // 5. Descargar
        pdf.save(fileName);
        return true;

    } catch (error) {
        console.error("Error generando el PDF:", error);
        return false;
    }
};