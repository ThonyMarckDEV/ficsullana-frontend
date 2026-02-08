// src/utilities/apiErrorHandler.js

/**
 * Estandariza los errores para el componente AlertMessage.
 * Soporta:
 * 1. Errores ya procesados (con .details)
 * 2. Errores crudos de Laravel/Axios (con .response.data.errors)
 * 3. Errores de red o genéricos.
 */
export const handleApiError = (err, defaultMsg = 'Ocurrió un error inesperado.') => {

    let message = defaultMsg;
    let details = [];
    let status = err?.status || null;
    let code = err?.code || null;

    // --- CASO 1: El error YA viene procesado (tiene .details) ---
    if (err.details) {
        message = err.message || message;
        // Forzamos a que sea array
        details = Array.isArray(err.details) ? err.details : [err.details];
        status = err.status || status;
        code = err.code || code;
    }
    // --- CASO 2: Error crudo de Axios (backup) ---
    else if (err.response && err.response.data) {
        message = err.response.data.message || message;
        const data = err.response.data;
        status = err.response.status || status;
        code = data.code || code;

        if (data.details) {
             details = Array.isArray(data.details) ? data.details : [data.details];
        } else if (data.errors) {
            details = Object.values(data.errors).flat();
        }
    } 
    else if (err.message) {
        message = err.message;
    }

    if (code === 'ADMISION_DUPLICADA') {
        message = 'Ya existe una admisión activa para este solicitante.';
    } else if (status === 409 && !message) {
        message = 'La operación entró en conflicto con el estado actual.';
    }

    const output = {
        type: 'error',
        message: message,
        details: details,
        status,
        code
    };
    
    return output;
};
