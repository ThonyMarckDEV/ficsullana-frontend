import {
  normalizeEntityName,
  sanitizeEntityNameInput,
} from 'utilities/pages/admision/debtGrid';

describe('admision debtGrid entity name helpers', () => {
  it('keeps spaces while typing and removes numbers', () => {
    expect(sanitizeEntityNameInput('banco de credito 123')).toBe('BANCO DE CREDITO ');
    expect(sanitizeEntityNameInput('caja   municipal')).toBe('CAJA MUNICIPAL');
    expect(sanitizeEntityNameInput('BANCO ')).toBe('BANCO ');
  });

  it('normalizes entity names only for comparisons and rules', () => {
    expect(normalizeEntityName(' banco   de credito 123 ')).toBe('BANCO DE CREDITO');
  });
});
