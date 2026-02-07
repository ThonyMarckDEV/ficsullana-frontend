export const buildAddressLine = (addressData = {}) => {
  const via = (addressData.nombreVia || "").trim();
  const numero = (addressData.numeroMzLt || "").trim();
  const urbanizacion = (addressData.urbanizacion || "").trim();

  return [via, numero, urbanizacion].filter(Boolean).join(", ");
};