import React from 'react';
import { render, screen } from '@testing-library/react';
import AvalGarantiaCard from 'pages/evaluacion/consumo/components/modals/aval/AvalGarantiaCard';
import { createGarantiaRow } from 'utilities/pages/evaluacion/consumo/transformers';

const baseProps = {
  garantiaIndex: 0,
  lookupOptions: [],
  disabled: false,
  catalogos: {
    monedas: [{ id: 1, nombre: 'SOLES' }],
  },
  onGarantiaChange: jest.fn(),
  onGarantiaLookupSelect: jest.fn(),
  onRemoveGarantia: jest.fn(),
  onToggleGarantiaDireccion: jest.fn(),
  markDirty: jest.fn(),
};

describe('AvalGarantiaCard', () => {
  it('allows manual guarantee entry for a new aval without showing the disabled master lookup', () => {
    render(
      <AvalGarantiaCard
        {...baseProps}
        lookupEnabled={false}
        garantia={createGarantiaRow({
          formIndex: 0,
          clase_garantia: 'AVAL',
          aval_slot: '1',
        })}
      />
    );

    expect(screen.queryByPlaceholderText('Disponible cuando el aval exista en el maestro')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Descripción')).toBeEnabled();
    expect(screen.getByLabelText('Monto de garantías')).toBeEnabled();
  });

  it('keeps the master lookup available when the aval already exists', () => {
    render(
      <AvalGarantiaCard
        {...baseProps}
        lookupEnabled
        garantia={createGarantiaRow({
          formIndex: 0,
          clase_garantia: 'AVAL',
          aval_slot: '1',
        })}
      />
    );

    expect(screen.getByLabelText('Vincular garantía existente')).toBeEnabled();
  });
});