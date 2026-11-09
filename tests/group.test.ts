import { describe, expect, it } from 'vitest';
import { groupIdFromName, validGroupId } from '../src/lib/group';
import { groupFromArgument } from '../admin/group-id.js';

describe('identificadores de grupo', () => {
  it.each(['01', '1', 'aa', 'ninja', 'ninja-2', 'abcdefghijklmno'])('aceita %s sem alterar o nome', name => {
    expect(groupIdFromName(name)).toBe(`group-${name}`);
    expect(validGroupId(`group-${name}`)).toBe(true);
    expect(groupFromArgument(name)).toBe(`group-${name}`);
  });
  it.each(['', '-ninja', 'ninja-', 'Ninja', 'a_b', 'a/b', 'abcdefghijklmnop'])('rejeita %s', name => {
    expect(groupIdFromName(name)).toBeNull();
    expect(validGroupId(`group-${name}`)).toBe(false);
    expect(() => groupFromArgument(name)).toThrow();
  });
});
