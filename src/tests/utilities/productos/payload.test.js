import { buildProductoPayload } from 'utilities/productos';

describe('buildProductoPayload', () => {
  it('serializes activo, tipo_evaluacion and existing configurations for updateProducto', () => {
    const payload = buildProductoPayload({
      nombre: '  Producto Pyme  ',
      tipo_evaluacion: 'PYME',
      activo: '0',
      configuraciones: [
        {
          id: '15',
          periodicidad_id: '4',
          periodicidad_nombre: 'DECENAL',
          monto_desde: '1000',
          monto_hasta: '2500',
          tasa_min: '8.5',
          tasa_max: '12.25',
          cuotas_min: '2',
          cuotas_max: '5',
          activo: '1',
        },
      ],
    });

    expect(payload).toEqual({
      nombre: 'Producto Pyme',
      tipo_evaluacion: 'PYME',
      activo: false,
      rango_tasa: '8.5% - 12.25%',
      configuraciones: [
        {
          id: 15,
          periodicidad_id: 4,
          monto_desde: 1000,
          monto_hasta: 2500,
          tasa_min: 8.5,
          tasa_max: 12.25,
          cuotas_min: 2,
          cuotas_max: 5,
          activo: true,
        },
      ],
    });
  });
});
