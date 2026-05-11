import {
  EVALUACION_CONSUMO_STATE_OPTIONS,
  EVALUACION_CONSUMO_STATES,
  formatEvaluacionConsumoState,
  getEvaluacionConsumoInitialFilters,
  getEvaluacionConsumoStateFilterOptions,
  isEvaluacionConsumoDecision,
  isEvaluacionConsumoEditable,
  isEvaluacionConsumoInReview,
  isEvaluacionConsumoLocked,
  normalizeEvaluacionConsumoListFilters,
  normalizeEvaluacionConsumoState,
} from 'utilities/pages/evaluacion/consumo/status';

describe('evaluacion consumo status helpers', () => {
  it('normalizes and labels the review state', () => {
    expect(normalizeEvaluacionConsumoState('en revision')).toBe(EVALUACION_CONSUMO_STATES.EN_REVISION);
    expect(formatEvaluacionConsumoState('EN_REVISION')).toBe('EN REVISIÓN');
    expect(isEvaluacionConsumoInReview('EN_REVISION')).toBe(true);
  });

  it('marks only observed, approved and rejected as registered resolutions', () => {
    expect(isEvaluacionConsumoDecision('OBSERVADO')).toBe(true);
    expect(isEvaluacionConsumoDecision('APROBADO')).toBe(true);
    expect(isEvaluacionConsumoDecision('RECHAZADO')).toBe(true);
    expect(isEvaluacionConsumoDecision('EN_REVISION')).toBe(false);
    expect(isEvaluacionConsumoDecision('PENDIENTE')).toBe(false);
  });

  it('keeps only pending and observed states editable for advisors', () => {
    expect(isEvaluacionConsumoEditable('PENDIENTE')).toBe(true);
    expect(isEvaluacionConsumoEditable('OBSERVADO')).toBe(true);
    expect(isEvaluacionConsumoEditable('EN_REVISION')).toBe(false);
    expect(isEvaluacionConsumoLocked('EN_REVISION')).toBe(true);
  });

  it('includes EN REVISION as a filter option with an internal ascii value', () => {
    expect(EVALUACION_CONSUMO_STATE_OPTIONS).toEqual(expect.arrayContaining([
      { value: EVALUACION_CONSUMO_STATES.EN_REVISION, label: 'EN REVISIÓN' },
    ]));
  });

  it('keeps advisor queue filters out of EN REVISION while preserving day-closed states for backend visibility', () => {
    const options = getEvaluacionConsumoStateFilterOptions({ canReviewQueue: false });

    expect(options).toEqual([
      { value: '', label: 'Todos' },
      { value: EVALUACION_CONSUMO_STATES.PENDIENTE, label: 'PENDIENTE' },
      { value: EVALUACION_CONSUMO_STATES.OBSERVADO, label: 'OBSERVADO' },
      { value: EVALUACION_CONSUMO_STATES.APROBADO, label: 'APROBADO' },
      { value: EVALUACION_CONSUMO_STATES.RECHAZADO, label: 'RECHAZADO' },
    ]);
    expect(normalizeEvaluacionConsumoListFilters({ search: 'maria', estado: 'EN REVISION' })).toEqual({
      search: 'maria',
      estado: '',
    });
  });

  it('keeps reviewer queue filters scoped to review and resolved states', () => {
    expect(getEvaluacionConsumoInitialFilters({ canReviewQueue: true })).toEqual({
      search: '',
      estado: '',
    });
    expect(getEvaluacionConsumoStateFilterOptions({ canReviewQueue: true })).toEqual([
      { value: '', label: 'Todos' },
      { value: EVALUACION_CONSUMO_STATES.EN_REVISION, label: 'EN REVISIÓN' },
      { value: EVALUACION_CONSUMO_STATES.OBSERVADO, label: 'OBSERVADO' },
      { value: EVALUACION_CONSUMO_STATES.APROBADO, label: 'APROBADO' },
      { value: EVALUACION_CONSUMO_STATES.RECHAZADO, label: 'RECHAZADO' },
    ]);
    expect(normalizeEvaluacionConsumoListFilters(
      { search: 'maria', estado: 'APROBADO' },
      { canReviewQueue: true }
    )).toEqual({
      search: 'maria',
      estado: EVALUACION_CONSUMO_STATES.APROBADO,
    });
    expect(normalizeEvaluacionConsumoListFilters(
      { search: 'maria', estado: 'PENDIENTE' },
      { canReviewQueue: true }
    )).toEqual({
      search: 'maria',
      estado: '',
    });
  });
});
