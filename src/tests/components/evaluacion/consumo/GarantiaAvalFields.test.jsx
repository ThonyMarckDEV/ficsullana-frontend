import React from 'react';
import { render, screen } from '@testing-library/react';
import GarantiaAvalFields from 'pages/evaluacion/consumo/components/sections/garantias/GarantiaAvalFields';

describe('GarantiaAvalFields', () => {
  it('shows the linked aval summary without exposing an aval selector', () => {
    render(
      <GarantiaAvalFields
        garantia={{ aval_slot: '1' }}
        disabled={false}
        linkedGroup={{
          displayName: 'Juan Perez',
          garantiaCount: 2,
          status: {
            code: 'partial',
            label: 'En progreso',
          },
        }}
        onEditAval={jest.fn()}
      />
    );

    expect(screen.queryByLabelText('Aval vinculado')).not.toBeInTheDocument();
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar aval 1' })).toBeInTheDocument();
  });
});
