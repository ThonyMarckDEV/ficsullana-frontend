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

    // --- CASO 1: El error YA viene formateado por el servicio ---
    if (err.details && Array.isArray(err.details)) {
        message = err.message || message;
        details = err.details;
    }
    // --- CASO 2: Error estándar de Axios / Laravel (422) ---
    else if (err.response && err.response.data) {
        // Mensaje principal
        message = err.response.data.message || message;

        // Errores de validación: { "campo": ["error"] } -> ["error"]
        if (err.response.data.errors) {
            details = Object.values(err.response.data.errors).flat();
        }
    } 
    // --- CASO 3: Error de Red (Servidor caído) ---
    else if (err.request) {
        message = 'No se pudo conectar con el servidor. Verifique su conexión.';
    } 
    // --- CASO 4: Error genérico de JavaScript ---
    else if (err.message) {
        message = err.message;
    }

    return {
        type: 'error',
        message: message,
        details: details 
    };
};