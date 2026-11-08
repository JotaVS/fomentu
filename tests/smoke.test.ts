import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
describe('regras da base', () => { it('exige autenticação e vínculo do grupo', () => { const rules = readFileSync('firestore.rules', 'utf8'); expect(rules).toContain('request.auth != null'); expect(rules).toContain('request.auth.token.groupId == groupId'); }); });
