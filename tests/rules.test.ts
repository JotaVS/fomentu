import { afterAll, beforeAll, describe, it } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
const enabled = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
describe.skipIf(!enabled)('isolamento do Firestore', () => {
  let env: RulesTestEnvironment;
  beforeAll(async () => { env = await initializeTestEnvironment({ projectId: 'demo-fomentu', firestore: { rules: readFileSync('firestore.rules', 'utf8') } }); });
  afterAll(async () => { await env?.cleanup(); });
  it('limita leitura, listagem e escrita ao próprio grupo, inclusive avaliações', async () => {
    const a = env.authenticatedContext('user-a', { groupId: 'group-01' }).firestore();
    const b = env.authenticatedContext('user-b', { groupId: 'group-02' }).firestore();
    for (const path of ['projects/projeto', 'projects/projeto/evaluations/avaliacao']) {
      const own = doc(a, `groups/group-01/${path}`);
      const other = doc(a, `groups/group-02/${path}`);
      await assertSucceeds(setDoc(own, { value: 1 }));
      await assertSucceeds(getDoc(own));
      await assertSucceeds(setDoc(doc(b, `groups/group-02/${path}`), { value: 1 }));
      await assertFails(getDoc(other));
      await assertFails(getDocs(collection(a, `groups/group-02/${path.split('/').slice(0, -1).join('/')}`)));
      await assertFails(setDoc(other, { value: 2 }));
      await assertFails(updateDoc(other, { value: 2 }));
      await assertFails(deleteDoc(other));
    }
  });
  it('nega acesso sem autenticação ou claim', async () => {
    for (const db of [env.unauthenticatedContext().firestore(), env.authenticatedContext('no-group').firestore()]) {
      await assertFails(getDoc(doc(db, 'groups/group-01/projects/projeto')));
      await assertFails(setDoc(doc(db, 'groups/group-01/projects/projeto'), { value: 1 }));
    }
  });
});
