import { evaluarProductoPolitica } from 'utilities/productos';

const createProducto = () => ({
  id: 1,
  nombre: 'Puntualito',
  configuraciones: [
    {
      id: 10,
      periodicidad_id: 1,
      periodicidad_key: 'SEMANAL',
      periodicidad_label: 'Semanal',
      monto_desde: 500,
      monto_hasta: 1000,
      tasa_min: 16,
      tasa_max: 18,
      cuotas_min: 4,
      cuotas_max: 4,
      activo: true,
    },
  ],
});

describe('evaluarProductoPolitica', () => {
  it('marks automatic discretionality when requested values exceed product limits', () => {
    const result = evaluarProductoPolitica(createProducto(), {
      tipoFrecuencia: 'SEMANAL',
      monto: 1100,
      numeroCuotas: 6,
      tasa: 20,
    });

    expect(result.dentroPolitica).toBe(false);
    expect(result.requiereDiscrecionalidad).toBe(true);
    expect(result.desviaciones).toEqual([
      {
        campo: 'monto',
        tipo: 'por_encima_maximo',
        limite: 1000,
        solicitado: 1100,
        diferencia: 100,
      },
      {
        campo: 'tasa',
        tipo: 'por_encima_maximo',
        limite: 18,
        solicitado: 20,
        diferencia: 2,
      },
      {
        campo: 'cuotas',
        tipo: 'por_encima_maximo',
        limite: 4,
        solicitado: 6,
        diferencia: 2,
      },
    ]);
  });

  it('keeps regular requests inside product policy', () => {
    const result = evaluarProductoPolitica(createProducto(), {
      tipoFrecuencia: 'SEMANAL',
      monto: 800,
      numeroCuotas: 4,
      tasa: 17,
    });

    expect(result.dentroPolitica).toBe(true);
    expect(result.requiereDiscrecionalidad).toBe(false);
    expect(result.desviaciones).toEqual([]);
  });
});
