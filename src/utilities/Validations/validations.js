/**
 * Valida que el input sea solo numérico (ENTEROS).
 * Útil para: DNI, RUC, Teléfono, Cantidades enteras.
 * @param {string} value - El valor del input
 * @returns {boolean} - True si es válido
 */
export const isNumeric = (value) => {
    return value === '' || /^[0-9]*$/.test(value);
};

/**
 * Valida formato de MONEDA (acepta punto o coma y max 2 decimales).
 * Útil para: Precios, Costos, Montos.
 * Ejemplos válidos: "10", "10.5", "10.50", "10,50"
 * @param {string} value 
 * @returns {boolean}
 */
export const isDecimalMoney = (value) => {
    return value === '' || /^\d*([.,]\d{0,2})?$/.test(value);
};

/**
 * Valida que el input contenga solo letras, espacios y tildes.
 * Útil para: Nombres, Apellidos, Razón Social.
 * @param {string} value 
 * @returns {boolean}
 */
export const isTextOnly = (value) => {
    return value === '' || /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/.test(value);
};

export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};