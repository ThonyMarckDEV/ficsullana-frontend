export const handleResponse = async (response) => {
    const result = await response.json();

    if (!response.ok) {
        const error = {
            type: 'error',
            message: result.message || 'Ocurrió un error inesperado.',
            details: result.errors 
                ? Object.values(result.errors).flat() 
                : (result.details || undefined),
        };
        throw error;
    }

    // ... resto del código igual (paginación y éxito)
    if (result.current_page !== undefined) {
        return result; 
    }

    const success = {
        type: 'success',
        message: result.message || 'Operación realizada con éxito.',
        data: result.data || result,
    };
    return success;
};