import {
  ADMISION_STATES,
  formatAdmisionState,
  getAdmisionStateFilterOptions,
  isAdmisionDecision,
  isAdmisionEditable,
  isAdmisionInReview,
  isAdmisionLocked,
  normalizeAdmisionListFilters,
  normalizeAdmisionState,
} from 'utilities/pages/admision/status';

describe('admision status helpers', () => {
  it('normalizes numeric and textual review states', () => {
    expect(normalizeAdmisionState(4)).toBe(ADMISION_STATES.EN_REVISION);
    expect(normalizeAdmisionState('4')).toBe(ADMISION_STATES.EN_REVISION);
    expect(normalizeAdmisionState('en revision')).toBe(ADMISION_STATES.EN_REVISION);
    expect(normalizeAdmisionState('EN REVISIÓN')).toBe(ADMISION_STATES.EN_REVISION);
    expect(formatAdmisionState('EN_REVISION')).toBe('EN REVISIÓN');
    expect(isAdmisionInReview('EN_REVISION')).toBe(true);
  });

  it('keeps only pending and observed editable for advisors', () => {
    expect(isAdmisionEditable(ADMISION_STATES.PENDIENTE)).toBe(true);
    expect(isAdmisionEditable(ADMISION_STATES.OBSERVADO)).toBe(true);
    expect(isAdmisionEditable(ADMISION_STATES.EN_REVISION)).toBe(false);
    expect(isAdmisionLocked(ADMISION_STATES.EN_REVISION)).toBe(true);
  });

  it('marks observed approved and rejected as decisions', () => {
    expect(isAdmisionDecision(ADMISION_STATES.OBSERVADO)).toBe(true);
    expect(isAdmisionDecision(ADMISION_STATES.APROBADO)).toBe(true);
    expect(isAdmisionDecision(ADMISION_STATES.RECHAZADO)).toBe(true);
    expect(isAdmisionDecision(ADMISION_STATES.EN_REVISION)).toBe(false);
    expect(isAdmisionDecision(ADMISION_STATES.PENDIENTE)).toBe(false);
  });

  it('scopes advisor and reviewer filters to their backend-visible queues', () => {
    expect(getAdmisionStateFilterOptions({ canReviewQueue: false })).toEqual([
      { value: '', label: 'Todos' },
      { value: '0', label: 'PENDIENTE' },
      { value: '2', label: 'OBSERVADO' },
      { value: '1', label: 'APROBADO' },
      { value: '3', label: 'RECHAZADO' },
    ]);
    expect(normalizeAdmisionListFilters({ search: 'maria', estado: 'EN_REVISION' })).toEqual({
      search: 'maria',
      estado: '',
    });

    expect(getAdmisionStateFilterOptions({ canReviewQueue: true })).toEqual([
      { value: '', label: 'Todos' },
      { value: '4', label: 'EN REVISIÓN' },
      { value: '2', label: 'OBSERVADO' },
      { value: '1', label: 'APROBADO' },
      { value: '3', label: 'RECHAZADO' },
    ]);
    expect(normalizeAdmisionListFilters(
      { search: 'maria', estado: 'EN REVISION' },
      { canReviewQueue: true }
    )).toEqual({
      search: 'maria',
      estado: '4',
    });
    expect(normalizeAdmisionListFilters(
      { search: 'maria', estado: 'PENDIENTE' },
      { canReviewQueue: true }
    )).toEqual({
      search: 'maria',
      estado: '',
    });
  });
});
