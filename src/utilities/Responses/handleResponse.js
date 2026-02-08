/**
 * Procesa la respuesta de fetch y la ESTANDARIZA.
 * Siempre devuelve o lanza un objeto con un formato predecible.
 */
export const handleResponse = async (response) => {
    let result = {};
    try {
        result = await response.json();
    } catch {
        result = {};
    }

    if (!response.ok) {
        // Lógica de detección de detalles
        let rawDetails = result.details;

        // Si no hay details, buscamos errors (Laravel default)
        if (!rawDetails && result.errors) {
            rawDetails = Object.values(result.errors).flat();
        }

        const error = {
            type: 'error',
            message: result.message || 'Ocurrió un error inesperado.',
            details: rawDetails,
            status: response.status,
            code: result.code || null,
        };
        
        throw error;
    }

    if (result.current_page !== undefined) {
        return result; 
    }

    return {
        type: 'success',
        message: result.message || 'Operación realizada con éxito.',
        data: result.data || result,
        status: response.status,
    };
};
