// src/utils/exportUtils.js
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import logo from '../../assets/img/Logo_FICSULLANA.png'; 

// CONFIGURACIÓN
const LOGO_URL = logo; 
const COMPANY_NAME = 'FICSULLANA'

/**
 * Obtener fecha y hora formateada 
 */
const getReportDate = () => {
    const now = new Date();
    return now.toLocaleString('es-PE', { 
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    });
};

/**
 * EXPORTAR A PDF 
 */
export const exportToPdf = async (elementId, fileName = 'Reporte_FicSullana.pdf', options = {}) => {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
        throw new Error('No se encontró el contenido que se debe exportar.');
    }

    let reportContainer = null;

    try {
        const includeDefaultHeader = options.includeDefaultHeader !== false;

        // Crear contenedor temporal 
        reportContainer = document.createElement('div');
        
        Object.assign(reportContainer.style, {
            position: 'fixed',
            top: '-10000px',
            left: '0',
            width: '900px', 
            backgroundColor: '#ffffff',
            padding: '40px 50px',
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            color: '#1e293b',
            zIndex: '-9999'
        });

        // 2. Encabezado Corporativo
        const headerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #b91c1c; padding-bottom: 20px; margin-bottom: 30px;">
                <div style="display: flex; align-items: center; gap: 20px;">
                    <img src="${LOGO_URL}" alt="FIC Sullana" style="height: 65px; width: auto; object-fit: contain; display: block;" />
                </div>

                <div style="text-align: right; background-color: #f8fafc; padding: 10px 15px; border-radius: 4px; border: 1px solid #e2e8f0;">
                    <table style="border-collapse: collapse; font-size: 10px; width: 100%;">
                        <tr>
                            <td style="color: #64748b; font-weight: 600; padding-right: 10px; text-align: right;">EMISIÓN:</td>
                            <td style="font-weight: bold; color: #0f172a;">${getReportDate()}</td>
                        </tr>
                        <tr>
                            <td style="color: #64748b; font-weight: 600; padding-right: 10px; text-align: right;">FOLIO:</td>
                            <td style="font-weight: bold; color: #0f172a;">${Math.floor(Date.now() / 1000)}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div style="margin-bottom: 25px; text-align: center;">
                <h2 style="font-size: 16px; text-transform: uppercase; margin: 0; background-color: #0f172a; color: white; padding: 8px; display: inline-block; width: 100%; letter-spacing: 2px;">
                    DETALLE DE OPERACIÓN
                </h2>
            </div>
        `;

        if (includeDefaultHeader) {
            reportContainer.innerHTML = headerHTML;
        }

        // Clonar Contenido
        const contentClone = originalElement.cloneNode(true);
        
        // Estilos de limpieza para impresión
        const styleReset = document.createElement('style');
        styleReset.innerHTML = `
            * { overflow: visible !important; max-height: none !important; }
            .grid { display: grid !important; }
            /* Cajas de info */
            div[class*="bg-slate-50"] { 
                background-color: #ffffff !important; 
                border: 1px solid #e2e8f0 !important;
                padding: 15px !important;
            }
            span[class*="text-slate-400"] { color: #64748b !important; font-size: 9px !important; }
            span[class*="text-fic-dark"] { color: #000000 !important; }
        `;
        reportContainer.appendChild(styleReset);
        reportContainer.appendChild(contentClone);

        // Footer Legal
        const footerHTML = `
            <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center;">
                <p style="font-size: 8px; color: #94a3b8; margin: 0;">
                    ${COMPANY_NAME} - Documento generado electrónicamente. La información contenida es confidencial.
                </p>
            </div>
        `;
        const footerDiv = document.createElement('div');
        footerDiv.innerHTML = footerHTML;
        reportContainer.appendChild(footerDiv);

        document.body.appendChild(reportContainer);

        // Generar Imagen -> PDF
        const canvas = await html2canvas(reportContainer, {
            scale: 2, 
            useCORS: true, 
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = imgWidth * 0.264583; // px a mm
        const pdfHeight = imgHeight * 0.264583;

        const pdf = new jsPDF({
            orientation: pdfWidth > pdfHeight ? 'l' : 'p',
            unit: 'mm',
            format: [pdfWidth, pdfHeight]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);

    } catch (error) {
        console.error("Error al exportar PDF:", error);
        throw new Error(error?.message || 'No se pudo exportar el PDF.');
    } finally {
        if (reportContainer?.parentNode) {
            reportContainer.parentNode.removeChild(reportContainer);
        }
    }
};
