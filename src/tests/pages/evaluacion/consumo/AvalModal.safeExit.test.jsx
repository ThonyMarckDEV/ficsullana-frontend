import React, { useEffect } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import AvalModal from 'pages/evaluacion/consumo/components/modals/AvalModal';
import useEvaluacionConsumoForm from 'pages/evaluacion/consumo/hooks/useEvaluacionConsumoForm';
import {
  createAvalGarantiaRow,
  createAvalState,
} from 'utilities/pages/evaluacion/consumo/transformers';

const mockBootstrapState = {
  loading: false,
  catalogos: {
    monedas: [],
    categorias: [],
    tipos_ingreso: [],
    productos: [],
    niveles_discrecionalidad: [],
    max_veces_sueldo_consumo: 1,
  },
  admisiones: [],
  admisionesLoading: false,
  admisionesError: '',
  contexto: {
    historial_interno: { visible: false },
    historial_externo: {},
    excepciones: [],
  },
  setContexto: jest.fn(),
  contextLoading: false,
  loadAdmisionContext: jest.fn(() => Promise.resolve()),
  loadAdmisionesElegibles: jest.fn(() => Promise.resolve()),
};

jest.mock('pages/evaluacion/consumo/hooks/useEvaluacionConsumoBootstrap', () => () => mockBootstrapState);

const createHarnessAval = (slot, nombres) => createAvalState({
  manual_mode: true,
  numero_documento: slot === 1 ? '12345678' : '87654321',
  nombres,
  apellido_paterno: 'Perez',
  apellido_materno: 'Lopez',
  telefono_movil: '987654321',
  tipo_vivienda: 'PROPIA',
  referencia_domiciliaria: 'Frente a la plaza',
  tipoVia: 'CALLE',
  nombreVia: `AVAL ${slot}`,
  numeroMzLt: '100',
  urbanizacion: 'CENTRO',
  departamento: 'PIURA',
  provincia: 'SULLANA',
  distrito: 'SULLANA',
});

const createHarnessGarantia = (slot) => createAvalGarantiaRow({
  clase_garantia: 'AVAL',
  aval_slot: String(slot),
  documento_garantia: 'DECLARACION_JURADA',
  tipo_garantia: 'BIEN',
  descripcion: `Garantia aval ${slot}`,
  direccion: `Direccion garantia ${slot}`,
  moneda_id: '1',
  monto_garantias: '1000.00',
  valor_comercial: '1000.00',
});

const AvalModalHarness = () => {
  const formApi = useEvaluacionConsumoForm({
    id: null,
    navigate: jest.fn(),
    checkPermission: () => true,
  });

  useEffect(() => {
    formApi.setField('garantias', [
      createHarnessGarantia(1),
      createHarnessGarantia(2),
    ]);
    formApi.setField('avales', [
      createHarnessAval(1, 'Juan'),
      createHarnessAval(2, 'Maria'),
    ]);
    // The harness intentionally seeds form state once, as the page would after
    // bootstrap. Further changes must go through the real hook handlers.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeAvalGroup = formApi.avalGroups.find(
    (group) => group.slot === formApi.avalModalState.activeAvalSlot
  ) || null;

  return (
    <div>
      <div aria-label="acciones de aval">
        {formApi.avalGroups.map((group) => (
          <button
            key={group.slot}
            type="button"
            onClick={() => formApi.openAvalModal(group.slot)}
          >
            Editar aval {group.slot}
          </button>
        ))}
      </div>

      <AvalModal
        isOpen={formApi.avalModalState.isOpen}
        onClose={formApi.closeAvalModal}
        group={activeAvalGroup}
        disabled={formApi.isReadonly}
        catalogos={formApi.catalogos}
        onApplyDraft={formApi.applyAvalModalDraft}
        onDirtyChange={formApi.markAvalModalDirty}
        openReason={formApi.avalModalState.openReason}
        dirtyState={formApi.avalModalState.dirtyState}
        exitConfirmOpen={formApi.avalModalState.exitConfirmOpen}
        onCancelExit={formApi.cancelAvalModalExit}
        onConfirmExit={formApi.confirmAvalModalExit}
      />
    </div>
  );
};

const openAval = async (slot = 1) => {
  fireEvent.click(await screen.findByRole('button', { name: `Editar aval ${slot}` }));
  return screen.findByRole('dialog');
};

const makeModalDirty = async (value = 'Ana') => {
  const nombresInput = await screen.findByLabelText('Nombres');
  fireEvent.change(nombresInput, { target: { value } });
  expect(nombresInput).toHaveValue(value);
};

const expectExitConfirmation = async () => {
  const alertDialog = await screen.findByRole('alertdialog', { name: 'Salir del aval' });
  expect(alertDialog).toHaveTextContent('Hay cambios recientes en este aval.');
  return alertDialog;
};

describe('AvalModal safe exit interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('asks for confirmation on Escape and keeps the confirmation focus trap isolated', async () => {
    render(<AvalModalHarness />);

    await openAval(1);
    await makeModalDirty('Ana');

    fireEvent.keyDown(document, { key: 'Escape' });

    const alertDialog = await expectExitConfirmation();
    const keepEditingButton = within(alertDialog).getByRole('button', { name: 'Seguir editando' });
    const exitButton = within(alertDialog).getByRole('button', { name: 'Salir' });

    await waitFor(() => expect(keepEditingButton).toHaveFocus());

    exitButton.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(keepEditingButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByRole('alertdialog', { name: 'Salir del aval' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: /Ana/ })).toBeInTheDocument();
    expect(screen.getByLabelText('Nombres')).toHaveValue('Ana');
  });

  it('asks for confirmation from the close button and preserves the draft after confirming exit', async () => {
    render(<AvalModalHarness />);

    await openAval(1);
    await makeModalDirty('Ana');

    fireEvent.click(screen.getByRole('button', { name: 'Volver al formulario' }));
    let alertDialog = await expectExitConfirmation();

    fireEvent.click(within(alertDialog).getByRole('button', { name: 'Seguir editando' }));
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog', { name: 'Salir del aval' })).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText('Nombres')).toHaveValue('Ana');

    fireEvent.click(screen.getByRole('button', { name: 'Volver al formulario' }));
    alertDialog = await expectExitConfirmation();
    fireEvent.click(within(alertDialog).getByRole('button', { name: 'Salir' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await openAval(1);
    expect(await screen.findByLabelText('Nombres')).toHaveValue('Ana');
  });

  it('asks for confirmation before switching aval context and switches only after confirmation', async () => {
    render(<AvalModalHarness />);

    await openAval(1);
    await makeModalDirty('Ana');

    fireEvent.click(screen.getByRole('button', { name: 'Editar aval 2' }));

    let alertDialog = await expectExitConfirmation();
    expect(screen.getByRole('dialog', { name: /Ana/ })).toBeInTheDocument();

    fireEvent.click(within(alertDialog).getByRole('button', { name: 'Seguir editando' }));
    await waitFor(() => {
      expect(screen.queryByRole('alertdialog', { name: 'Salir del aval' })).not.toBeInTheDocument();
    });
    expect(screen.getByRole('dialog', { name: /Ana/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Editar aval 2' }));
    alertDialog = await expectExitConfirmation();
    fireEvent.click(within(alertDialog).getByRole('button', { name: 'Salir' }));

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Maria Perez Lopez' })).toBeInTheDocument();
    });
    expect(screen.getByLabelText('Nombres')).toHaveValue('Maria');
  });
});
