import { buildAdmisionPayload } from 'utilities/pages/admision/payload';

const baseHeader = {
  tipo_solicitante: 'CLIENTE',
  cliente_id: 15,
  prospecto_id: null,
  tipo_prestamo: 'RCS',
  observaciones: 'Cliente recurrente',
  estado: 2,
};

describe('buildAdmisionPayload', () => {
  it('does not send estado unless the caller explicitly requests it', () => {
    const payload = buildAdmisionPayload({
      header: baseHeader,
      deudas: [],
      protestos: [],
    });

    expect(payload).toEqual({
      cliente_id: 15,
      prospecto_id: null,
      tipo_prestamo: 'RCS',
      observaciones: 'Cliente recurrente',
      deudas: [],
      protestos: [],
    });
    expect(payload).not.toHaveProperty('estado');
  });

  it('keeps the explicit estado opt-in for dedicated state-management flows', () => {
    const payload = buildAdmisionPayload({
      header: baseHeader,
      deudas: [],
      protestos: [],
      includeEstado: true,
    });

    expect(payload.estado).toBe(2);
  });
});
