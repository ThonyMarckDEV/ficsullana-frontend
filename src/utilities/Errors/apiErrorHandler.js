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

    // --- CASO 1: El error YA viene procesado (tiene .details) ---
    if (err.details) {
        message = err.message || message;
        // Forzamos a que sea array
        details = Array.isArray(err.details) ? err.details : [err.details];
    }
    // --- CASO 2: Error crudo de Axios (backup) ---
    else if (err.response && err.response.data) {
        message = err.response.data.message || message;
        const data = err.response.data;

        if (data.details) {
             details = Array.isArray(data.details) ? data.details : [data.details];
        } else if (data.errors) {
            details = Object.values(data.errors).flat();
        }
    } 
    else if (err.message) {
        message = err.message;
    }

    const output = {
        type: 'error',
        message: message,
        details: details 
    };
    
    return output;
};