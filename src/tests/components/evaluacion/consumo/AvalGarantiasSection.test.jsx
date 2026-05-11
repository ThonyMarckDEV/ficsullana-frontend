import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import AvalGarantiasSection from 'pages/evaluacion/consumo/components/modals/aval/AvalGarantiasSection';
import { createGarantiaRow } from 'utilities/pages/evaluacion/consumo/transformers';

const baseProps = {
  lookupEnabled: false,
  lookupOptions: [],
  disabled: false,
  catalogos: {
    monedas: [{ id: 1, nombre: 'SOLES' }],
  },
  onGarantiaChange: jest.fn(),
  onAddGarantiaToAval: jest.fn(),
  onGarantiaLookupSelect: jest.fn(),
  onRemoveGarantia: jest.fn(),
  onToggleGarantiaDireccion: jest.fn(),
  onDirtyChange: jest.fn(),
};

describe('AvalGarantiasSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a guarantee to the active aval from the modal action', () => {
    render(
      <AvalGarantiasSection
        {...baseProps}
        avalSlot={2}
        garantias={[
          createGarantiaRow({
            formIndex: 0,
            clase_garantia: 'AVAL',
            aval_slot: '2',
          }),
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Agregar garantía al aval' }));

    expect(baseProps.onDirtyChange).toHaveBeenCalledWith(true);
    expect(baseProps.onAddGarantiaToAval).toHaveBeenCalledWith(2);
  });
});
