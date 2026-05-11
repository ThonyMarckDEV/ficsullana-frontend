import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import EvaluacionConsumoDetailContent from 'pages/evaluacion/consumo/components/modals/EvaluacionConsumoDetailContent';
import EvaluacionConsumoDetailModal from 'pages/evaluacion/consumo/components/modals/EvaluacionConsumoDetailModal';
import EvaluacionConsumoDecisionTab from 'pages/evaluacion/consumo/components/modals/detail/EvaluacionConsumoDecisionTab';
import { AvalCard } from 'pages/evaluacion/consumo/components/modals/detail/DetailUiBlocks';
import { ResumenSection } from 'pages/evaluacion/consumo/components/modals/detail/EvaluacionConsumoDetailSections';
import { exportEvaluacionConsumoPdf } from 'utilities/pages/evaluacion/consumo/pdfExport';
import {
  showImpresionEvaluacionConsumo,
  updateEstadoEvaluacionConsumo,
} from 'services/evaluacionConsumoService';

jest.mock('services/evaluacionConsumoService', () => ({
  showImpresionEvaluacionConsumo: jest.fn(),
  updateEstadoEvaluacionConsumo: jest.fn(),
}));

jest.mock('utilities/pages/evaluacion/consumo/pdfExport', () => ({
  exportEvaluacionConsumoPdf: jest.fn(),
}));

let mockGrantedPermissions = new Set(['evaluaciones_consumo.imprimir']);

jest.mock('context/AuthContext', () => ({
  useAuth: () => ({
    checkPermission: (permission) => mockGrantedPermissions.has(permission),
  }),
}));

const baseDetailData = {
  id: 8,
  estado: 'APROBADO',
  fecha_evaluacion: '2026-05-05T10:00:00-05:00',
  solicitante_nombre_snapshot: 'MARIA RAMOS',
  solicitante_dni_snapshot: '12345678',
  sede: { nombre: 'Sullana' },
  usuario: { username: 'asesor' },
  monto: '1500.00',
  propuesta: '12.50',
  numero_cuotas: 6,
  cuota: '300.00',
  producto: null,
  ingresos: [],
  garantias_solicitante: [],
  avales: [],
  contexto: {
    historial_interno: { visible: true },
    historial_externo: { deudas: [], protestos: [] },
    excepciones: [],
  },
};

describe('evaluacion consumo resolution detail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGrantedPermissions = new Set(['evaluaciones_consumo.imprimir']);
  });

  it('uses the new tab labels in the detail modal content', () => {
    render(
      <EvaluacionConsumoDetailContent
        data={baseDetailData}
        showDecisionTab
        canObserve
        canApprove
        canReject
      />
    );

    expect(screen.getByRole('button', { name: /evaluación de ingresos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /historial crediticio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /resolución de crédito/i })).toBeInTheDocument();
  });

  it('removes the context block from the summary section', () => {
    render(<ResumenSection data={baseDetailData} productoRange={null} />);

    expect(screen.queryByText(/contexto de evaluación/i)).not.toBeInTheDocument();
    expect(screen.getByText(/operación/i)).toBeInTheDocument();
  });

  it('shows aval identity, contact and domicile with the requested fields', () => {
    render(
      <AvalCard
        index={0}
        aval={{
          aval_id: 15,
          numero_documento: '12345678',
          nombres: 'JUAN CARLOS',
          apellido_paterno: 'PEREZ',
          apellido_materno: 'RAMOS',
          telefono_fijo: '073123456',
          telefono_movil: '987654321',
          tipoVia: 'CALLE',
          nombreVia: 'LOS PINOS',
          numeroMzLt: '123',
          urbanizacion: 'CENTRO',
          departamento: 'PIURA',
          provincia: 'SULLANA',
          distrito: 'SULLANA',
          referencia_domiciliaria: 'Frente al parque',
          tipo_vivienda: 'PROPIA',
          direccion: 'Texto libre que no debe mostrarse abajo',
          garantias: [
            {
              id: 1,
              tipo_garantia: 'HIPOTECA',
              clase_garantia: 'AVAL',
              documento_garantia: 'DOC-1',
              fecha_ultima_evaluacion: '2026-05-07T00:00:00-05:00',
            },
          ],
        }}
      />
    );

    expect(screen.getByText(/^identidad$/i)).toBeInTheDocument();
    expect(screen.getByText(/^contacto$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^aval 1$/i)).not.toBeInTheDocument();
    expect(screen.queryByText('JUAN CARLOS PEREZ RAMOS')).not.toBeInTheDocument();
    expect(screen.getByText('JUAN CARLOS')).toBeInTheDocument();
    expect(screen.getByText('PEREZ')).toBeInTheDocument();
    expect(screen.getByText('RAMOS')).toBeInTheDocument();
    expect(screen.getByText('073123456')).toBeInTheDocument();
    expect(screen.getByText('987654321')).toBeInTheDocument();
    expect(screen.queryByText(/dirección consolidada/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/dirección libre/i)).not.toBeInTheDocument();
    expect(screen.getByText('Frente al parque')).toBeInTheDocument();
    expect(screen.getByText('PROPIA')).toBeInTheDocument();
    expect(screen.getByText('07/05')).toBeInTheDocument();
    expect(screen.queryByText(/1 registro/i)).not.toBeInTheDocument();
  });

  it('hides discretionality in detail when product policies are not broken', () => {
    render(
      <EvaluacionConsumoDetailContent
        data={{
          ...baseDetailData,
          requiere_discrecionalidad: false,
          dentro_politica: true,
          desviaciones: [],
          motivos: 'Motivo interno que no debe abrir el panel.',
        }}
      />
    );

    expect(screen.queryByText(/^discrecionalidad$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/desviaciones de política/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/política producto/i)).not.toBeInTheDocument();
  });

  it('shows only interest rate, level and reasons when discretionality is required', () => {
    render(
      <EvaluacionConsumoDetailContent
        data={{
          ...baseDetailData,
          requiere_discrecionalidad: true,
          tasa_interes_solicitada: '18.50',
          motivos: 'Tasa fuera del rango permitido.',
          nivel_discrecionalidad_resuelto: {
            rol_autorizador: { nombre: 'Jefe de créditos' },
          },
          desviaciones: [
            {
              campo: 'tasa',
              tipo: 'por_encima_maximo',
              limite: '15.00',
              solicitado: '18.50',
              diferencia: '3.50',
            },
          ],
        }}
      />
    );

    expect(screen.getByText(/^discrecionalidad$/i)).toBeInTheDocument();
    expect(screen.getAllByText('18.50%').length).toBeGreaterThan(0);
    expect(screen.getByText('Jefe de créditos')).toBeInTheDocument();
    expect(screen.getByText('Tasa fuera del rango permitido.')).toBeInTheDocument();
    expect(screen.queryByText(/desviaciones de política/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/por encima del máximo/i)).not.toBeInTheDocument();
  });

  it('keeps existing resolutions read-only instead of allowing revisor modifications', () => {
    render(
      <EvaluacionConsumoDecisionTab
        data={{
          ...baseDetailData,
          decision_comentario: 'Aprobado inicialmente.',
          resolucion_modificada_at: '2026-05-05T11:00:00-05:00',
          resolucion_modificada_por: { id: 9, username: 'revisor' },
        }}
        canObserve
        canApprove
        canReject
      />
    );

    expect(screen.getByDisplayValue('Aprobado inicialmente.')).toBeDisabled();
    expect(screen.queryByRole('button', { name: /modificar resolución/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /rechazar evaluación/i })).not.toBeInTheDocument();
  });

  it('shows the decision tab only while the evaluation is EN REVISION', () => {
    mockGrantedPermissions = new Set([
      'evaluaciones_consumo.aprobar',
      'evaluaciones_consumo.rechazar',
    ]);

    const { rerender } = render(
      <EvaluacionConsumoDetailModal
        isOpen
        loading={false}
        data={{
          ...baseDetailData,
          estado: 'APROBADO',
        }}
        onClose={jest.fn()}
      />
    );

    expect(screen.queryByRole('button', { name: /resolución de crédito/i })).not.toBeInTheDocument();

    rerender(
      <EvaluacionConsumoDetailModal
        isOpen
        loading={false}
        data={{
          ...baseDetailData,
          estado: 'EN_REVISION',
        }}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /resolución de crédito/i })).toBeInTheDocument();
  });

  it.each([
    [/observar evaluación/i],
    [/aprobar evaluación/i],
    [/rechazar evaluación/i],
  ])('requires comment before %s from the real decision tab', (buttonName) => {
    render(
      <EvaluacionConsumoDecisionTab
        data={{
          ...baseDetailData,
          estado: 'EN_REVISION',
          decision_comentario: '',
        }}
        canObserve
        canApprove
        canReject
      />
    );

    fireEvent.click(screen.getByRole('button', { name: buttonName }));

    expect(screen.getByText('Debe registrar un comentario para la resolución.')).toBeInTheDocument();
    expect(updateEstadoEvaluacionConsumo).not.toHaveBeenCalled();
  });

  it('sends the real update-estado payload and rehydrates the backend cuota in the decision tab', async () => {
    const onDecisionSuccess = jest.fn().mockResolvedValue();
    updateEstadoEvaluacionConsumo.mockResolvedValue({
      message: 'Resolución actualizada correctamente.',
      data: {
        ...baseDetailData,
        estado: 'APROBADO',
        monto: '1800.00',
        tipo_frecuencia: 'MENSUAL',
        numero_cuotas: 8,
        propuesta: '15.25',
        tasa: '15.25',
        tasa_interes_solicitada: '15.25',
        cuota: '260.44',
        decision_comentario: 'Capacidad validada con ajuste final.',
      },
    });

    render(
      <EvaluacionConsumoDecisionTab
        data={{
          ...baseDetailData,
          estado: 'EN_REVISION',
          tipo_frecuencia: 'SEMANAL',
          decision_comentario: '',
        }}
        canObserve
        canApprove
        canReject
        onDecisionSuccess={onDecisionSuccess}
      />
    );

    fireEvent.change(screen.getByLabelText(/monto/i), { target: { value: '1800.00' } });
    fireEvent.change(screen.getByLabelText(/frecuencia/i), { target: { value: 'MENSUAL' } });
    fireEvent.change(screen.getByLabelText(/n° cuotas/i), { target: { value: '8' } });
    fireEvent.change(screen.getByLabelText(/tasa final/i), { target: { value: '15.25' } });
    fireEvent.change(screen.getByPlaceholderText(/sustento final de la resolución/i), {
      target: { value: '  Capacidad validada con ajuste final.  ' },
    });

    fireEvent.click(screen.getByRole('button', { name: /aprobar evaluación/i }));
    fireEvent.click(screen.getByRole('button', { name: /^sí$/i }));

    await waitFor(() => expect(updateEstadoEvaluacionConsumo).toHaveBeenCalledWith(8, {
      estado: 'APROBADO',
      decision_comentario: 'Capacidad validada con ajuste final.',
      monto: '1800.00',
      tipo_frecuencia: 'MENSUAL',
      numero_cuotas: 8,
      propuesta: '15.25',
      tasa: '15.25',
      tasa_interes_solicitada: '15.25',
    }));

    expect(updateEstadoEvaluacionConsumo.mock.calls[0][1]).not.toHaveProperty('cuota');
    await waitFor(() => expect(onDecisionSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        estado: 'APROBADO',
        cuota: '260.44',
        propuesta: '15.25',
        tasa: '15.25',
        tasa_interes_solicitada: '15.25',
      })
    ));
    expect(await screen.findByDisplayValue('260.44')).toBeInTheDocument();
  });

  it('loads backend print payload before opening the corporate preview', async () => {
    showImpresionEvaluacionConsumo.mockResolvedValue({
      data: {
        documento: 'evaluacion_consumo',
        generado_at: '2026-05-05T12:00:00-05:00',
        generado_por: { id: 9, username: 'revisor' },
        evaluacion: {
          ...baseDetailData,
          ingresos: [
            {
              id: 1,
              tipo_ingreso: { nombre: 'Boleta' },
              ingreso: '1200.00',
              veces_sueldo: '4.00',
              monto_maximo_otorgar: '4800.00',
            },
          ],
        },
      },
    });
    exportEvaluacionConsumoPdf.mockResolvedValue();

    render(
      <EvaluacionConsumoDetailModal
        isOpen
        loading={false}
        data={baseDetailData}
        onClose={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /imprimir/i }));

    await waitFor(() => expect(showImpresionEvaluacionConsumo).toHaveBeenCalledWith(8));

    expect(await screen.findByText(/vista previa de impresión/i)).toBeInTheDocument();
    expect(screen.getByText(/ficha de evaluación consumo/i)).toBeInTheDocument();
    expect(screen.queryByText(/información validada por backend/i)).not.toBeInTheDocument();
    expect(screen.getByText('Boleta')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /generar pdf/i }));

    await waitFor(() => expect(exportEvaluacionConsumoPdf).toHaveBeenCalledWith(
      expect.objectContaining({
        evaluacion: expect.objectContaining({ id: 8 }),
      }),
      'EvaluacionConsumo-8.pdf'
    ));
  });

  it('accepts the backend print payload as source of truth even without the service success wrapper', async () => {
    showImpresionEvaluacionConsumo.mockResolvedValue({
      documento: 'evaluacion_consumo',
      generado_at: '2026-05-05T12:00:00-05:00',
      generado_por: { id: 9, username: 'revisor' },
      evaluacion: {
        ...baseDetailData,
        id: 19,
        solicitante_nombre_snapshot: 'CLIENTE DESDE BACKEND',
      },
    });

    render(
      <EvaluacionConsumoDetailModal
        isOpen
        loading={false}
        data={{ ...baseDetailData, solicitante_nombre_snapshot: 'CLIENTE LOCAL' }}
        onClose={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /imprimir/i }));

    expect(await screen.findByText(/evaluación consumo #19/i)).toBeInTheDocument();
    const printContent = document.getElementById('evaluacion-consumo-print-content');
    expect(within(printContent).getByText('CLIENTE DESDE BACKEND')).toBeInTheDocument();
    expect(within(printContent).queryByText('CLIENTE LOCAL')).not.toBeInTheDocument();
  });

  it('does not open print preview when backend returns an invalid print shape', async () => {
    showImpresionEvaluacionConsumo.mockResolvedValue({
      data: {
        documento: 'evaluacion_consumo',
        generado_at: '2026-05-05T12:00:00-05:00',
        generado_por: { id: 9, username: 'revisor' },
      },
    });

    render(
      <EvaluacionConsumoDetailModal
        isOpen
        loading={false}
        data={baseDetailData}
        onClose={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /imprimir/i }));

    expect(await screen.findByText('El backend no devolvió una evaluación válida para impresión.')).toBeInTheDocument();
    expect(screen.queryByText(/vista previa de impresión/i)).not.toBeInTheDocument();
  });

  it('keeps preview open and shows export errors when PDF generation fails', async () => {
    showImpresionEvaluacionConsumo.mockResolvedValue({
      data: {
        documento: 'evaluacion_consumo',
        generado_at: '2026-05-05T12:00:00-05:00',
        generado_por: { id: 9, username: 'revisor' },
        evaluacion: baseDetailData,
      },
    });
    exportEvaluacionConsumoPdf.mockRejectedValue(new Error('No se pudo generar el PDF de evaluación consumo.'));

    render(
      <EvaluacionConsumoDetailModal
        isOpen
        loading={false}
        data={baseDetailData}
        onClose={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /imprimir/i }));
    expect(await screen.findByText(/vista previa de impresión/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /generar pdf/i }));

    expect(await screen.findByText('No se pudo generar el PDF de evaluación consumo.')).toBeInTheDocument();
    expect(screen.getByText(/vista previa de impresión/i)).toBeInTheDocument();
  });
});
