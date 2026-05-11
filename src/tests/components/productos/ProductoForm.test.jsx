import React from 'react';
import { render, screen } from '@testing-library/react';
import ProductoForm from 'components/Shared/Formularios/Producto/ProductoForm';

describe('ProductoForm', () => {
  it('renders string zero activo values as Inactivo', () => {
    render(
      <ProductoForm
        data={{
          nombre: 'Producto desactivado',
          tipo_evaluacion: 'CONSUMO',
          activo: '0',
          configuraciones: [],
        }}
        handleChange={jest.fn()}
        onConfigChange={jest.fn()}
        onAddConfig={jest.fn()}
        onRemoveConfig={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue('Inactivo')).toHaveValue('0');
  });
});
