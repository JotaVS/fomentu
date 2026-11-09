import { describe, expect, it } from 'vitest';
import { publicGroupId } from '../../src/lib/firebase';

describe('publicGroupId', () => {
  it('aceita um grupo válido', () => {
    expect(publicGroupId('group-01')).toBe('group-01');
    expect(publicGroupId('group-10')).toBe('group-10');
  });

  it('retorna null quando o grupo não foi configurado', () => {
    expect(publicGroupId('')).toBeNull();
    expect(publicGroupId(undefined)).toBeNull();
  });

  it('retorna null para um grupo inválido', () => {
    for (const value of ['group-00', 'group-1', 'grupo-01', 'group-01 ', '../group-01', 'GROUP-01']) expect(publicGroupId(value)).toBeNull();
  });
});
