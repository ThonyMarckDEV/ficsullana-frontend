import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Index from 'pages/productos/Index';
import { getProductos, showProducto, updateProducto } from 'services/productoService';

jest.mock('services/productoService', () => ({
  getProductos: jest.fn(),
  showProducto: jest.fn(),
  updateProducto: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}), { virtual: true });

jest.mock('components/Shared/Modals/InfoModal', () => () => null);

jest.mock('components/Shared/Tables/Table', () => ({
  __esModule: true,
  default: ({ columns, data }) => (
    <div>
      {data.map((row) => (
        <div key={row.id}>
          {columns.map((column, index) => (
            <div key={column.header || index}>
              {column.render ? column.render(row) : row[column.accessor]}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

const productoRow = {
  id: 7,
  nombre: 'Producto Campaña',
  tipo_evaluacion: 'CONSUMO',
  activo: '1',
  rango_tasa: '8% - 12%',
  configuraciones: [],
};

const productoDetail = {
  id: 7,
  nombre: 'Producto Campaña',
  tipo_evaluacion: 'PYME',
  activo: true,
  rango_tasa: '9% - 14%',
  configuraciones: [
    {
      id: 91,
      periodicidad_id: 4,
      periodicidad_nombre: 'DECENAL',
      monto_desde: '1000',
      monto_hasta: '3000',
      tasa_min: '9',
      tasa_max: '14',
      cuotas_min: '2',
      cuotas_max: '6',
      activo: true,
    },
  ],
};

describe('productos Index estado flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    getProductos.mockResolvedValue({
      data: [productoRow],
      current_page: 1,
      last_page: 1,
      total: 1,
    });
    showProducto.mockResolvedValue({ data: productoDetail });
    updateProducto.mockResolvedValue({ message: 'Producto actualizado correctamente.' });
  });

  it('toggles estado using the full product detail without losing tipo_evaluacion or configurations', async () => {
    render(<Index />);

    const estadoButton = await screen.findByRole('button', { name: 'ACTIVO' });
    fireEvent.click(estadoButton);

    expect(screen.getByText('¿Deseas cambiar el estado a INACTIVO?')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sí, continuar' }));

    await waitFor(() => {
      expect(updateProducto).toHaveBeenCalledWith(7, {
        nombre: 'Producto Campaña',
        tipo_evaluacion: 'PYME',
        activo: false,
        rango_tasa: '9% - 14%',
        configuraciones: [
          {
            id: 91,
            periodicidad_id: 4,
            monto_desde: 1000,
            monto_hasta: 3000,
            tasa_min: 9,
            tasa_max: 14,
            cuotas_min: 2,
            cuotas_max: 6,
            activo: true,
          },
        ],
      });
    });

    expect(showProducto).toHaveBeenCalledWith(7);
  });
});
