import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds, initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'node:fs';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
const enabled = Boolean(process.env.FIRESTORE_EMULATOR_HOST);

// Projeto válido conforme specs/002-cadastrar-projeto/data-model.md, gravado pelo cadastro público.
function validProject(): Record<string, unknown> {
  return {
    title: 'ReusoLab',
    description: 'Conecta negócios que possuem materiais reaproveitáveis a quem pode reutilizá-los.',
    problem: 'Materiais em bom estado são descartados porque não há um canal simples de doação.',
    proponentName: 'Maria da Silva',
    proponentEmail: 'maria.silva@exemplo.com.br',
    proponentProfile: 'student',
    partecArea: 'creative-economy',
    stage: 'ideation',
    mvpStatus: 'no',
    consentAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    createdBy: 'public-form',
  };
}
const seedProject = { title: 'AgendaLab', description: 'Organiza reservas de equipamentos.', createdBy: 'seed', createdAt: Timestamp.now() };
const seedEvaluation = { source: 'human', content: 'Parecer de exemplo.', createdBy: 'seed', createdAt: Timestamp.now() };

describe.skipIf(!enabled)('regras do Firestore', () => {
  let env: RulesTestEnvironment;
  beforeAll(async () => { env = await initializeTestEnvironment({ projectId: 'demo-fomentu', firestore: { rules: readFileSync('firestore.rules', 'utf8') } }); });
  beforeEach(async () => {
    await env.clearFirestore();
    // Documentos válidos preparados sem regras (ADR 005): o isolamento é verificado sobre dados reais.
    await env.withSecurityRulesDisabled(async context => {
      const db = context.firestore();
      for (const group of ['group-01', 'group-02']) {
        await setDoc(doc(db, `groups/${group}`), { createdAt: Timestamp.now() });
        await setDoc(doc(db, `groups/${group}/projects/projeto`), seedProject);
        await setDoc(doc(db, `groups/${group}/projects/projeto/evaluations/avaliacao`), seedEvaluation);
        await setDoc(doc(db, `groups/${group}/diagnostics/diagnostico`), { description: 'Exemplo', createdAt: Timestamp.now() });
      }
    });
  });
  afterAll(async () => { await env?.cleanup(); });

  describe('isolamento entre grupos', () => {
    it('limita leitura, listagem e escrita ao próprio grupo, inclusive avaliações', async () => {
      const a = env.authenticatedContext('user-a', { groupId: 'group-01' }).firestore();
      const b = env.authenticatedContext('user-b', { groupId: 'group-02' }).firestore();
      await assertSucceeds(getDoc(doc(a, 'groups/group-01')));
      await assertFails(getDoc(doc(a, 'groups/group-02')));
      for (const path of ['projects/projeto', 'projects/projeto/evaluations/avaliacao']) {
        const parent = path.split('/').slice(0, -1).join('/');
        const own = doc(a, `groups/group-01/${path}`);
        const other = doc(a, `groups/group-02/${path}`);
        await assertSucceeds(getDoc(own));
        await assertSucceeds(getDocs(collection(a, `groups/group-01/${parent}`)));
        await assertSucceeds(getDoc(doc(b, `groups/group-02/${path}`)));
        await assertFails(getDoc(other));
        await assertFails(getDocs(collection(a, `groups/group-02/${parent}`)));
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
      const noGroup = env.authenticatedContext('no-group').firestore();
      await assertFails(getDocs(collection(noGroup, 'groups/group-01/projects')));
    });
  });

  describe('cadastro público de projetos (F01-US3)', () => {
    it('permite a um visitante sem login criar projeto válido, com e sem link do MVP', async () => {
      const db = env.unauthenticatedContext().firestore();
      await assertSucceeds(addDoc(collection(db, 'groups/group-01/projects'), validProject()));
      await assertSucceeds(addDoc(collection(db, 'groups/group-01/projects'), { ...validProject(), mvpStatus: 'yes', mvpLink: 'https://reusolab.com.br' }));
      await assertSucceeds(addDoc(collection(db, 'groups/group-01/projects'), { ...validProject(), mvpStatus: 'validating', mvpLink: 'http://exemplo.com' }));
    });

    it('não permite a um visitante ler, listar, alterar ou excluir projetos', async () => {
      const db = env.unauthenticatedContext().firestore();
      const project = doc(db, 'groups/group-01/projects/projeto');
      await assertFails(getDoc(project));
      await assertFails(getDocs(collection(db, 'groups/group-01/projects')));
      await assertFails(updateDoc(project, { title: 'Outro nome' }));
      await assertFails(setDoc(project, validProject()));
      await assertFails(deleteDoc(project));
    });

    const invalid: Array<[string, (data: Record<string, unknown>) => void]> = [
      ['chave extra', data => { data.score = 10; }],
      ['chave obrigatória faltando', data => { delete data.problem; }],
      ['aceite faltando', data => { delete data.consentAt; }],
      ['tipo errado', data => { data.title = 123; }],
      ['nome da solução curto', data => { data.title = 'AB'; }],
      ['nome da solução longo', data => { data.title = 'A'.repeat(101); }],
      ['descrição curta', data => { data.description = 'Curta demais.'; }],
      ['descrição longa', data => { data.description = 'A'.repeat(1001); }],
      ['problema longo', data => { data.problem = 'A'.repeat(1001); }],
      ['nome do proponente curto', data => { data.proponentName = 'Al'; }],
      ['nome do proponente longo', data => { data.proponentName = 'A'.repeat(121); }],
      ['perfil inválido', data => { data.proponentProfile = 'alien'; }],
      ['área inválida', data => { data.partecArea = 'space'; }],
      ['estágio inválido', data => { data.stage = 'unicorn'; }],
      ['situação do MVP inválida', data => { data.mvpStatus = 'maybe'; }],
      ["mvpStatus 'yes' sem link", data => { data.mvpStatus = 'yes'; }],
      ['link sem http(s)', data => { data.mvpStatus = 'yes'; data.mvpLink = 'ftp://reusolab.com.br'; }],
      ['link longo', data => { data.mvpStatus = 'yes'; data.mvpLink = `https://${'a'.repeat(493)}`; }],
      ['link com tipo errado', data => { data.mvpLink = 42; }],
      ['e-mail com maiúsculas', data => { data.proponentEmail = 'Maria.Silva@exemplo.com.br'; }],
      ['e-mail inválido', data => { data.proponentEmail = 'maria-sem-arroba'; }],
      ['e-mail longo', data => { data.proponentEmail = `${'a'.repeat(250)}@x.com`; }],
      ['createdBy diferente', data => { data.createdBy = 'seed'; }],
      ['createdAt do cliente', data => { data.createdAt = Timestamp.now(); }],
      ['consentAt do cliente', data => { data.consentAt = Timestamp.now(); }],
    ];
    for (const [name, change] of invalid) {
      it(`nega criação inválida: ${name}`, async () => {
        const db = env.unauthenticatedContext().firestore();
        const data = validProject();
        change(data);
        await assertFails(addDoc(collection(db, 'groups/group-01/projects'), data));
      });
    }

    it('nega a escrita pública em avaliações e diagnósticos', async () => {
      const db = env.unauthenticatedContext().firestore();
      await assertFails(addDoc(collection(db, 'groups/group-01/projects/projeto/evaluations'), seedEvaluation));
      await assertFails(addDoc(collection(db, 'groups/group-01/diagnostics'), { description: 'Teste', createdAt: serverTimestamp() }));
      await assertFails(getDoc(doc(db, 'groups/group-01/diagnostics/diagnostico')));
    });

    it('não permite a membros alterar ou excluir projetos nem gravar avaliações antes da F03 e da F04', async () => {
      const db = env.authenticatedContext('user-a', { groupId: 'group-01' }).firestore();
      const project = doc(db, 'groups/group-01/projects/projeto');
      await assertFails(updateDoc(project, { title: 'Outro nome' }));
      await assertFails(setDoc(project, validProject()));
      await assertFails(deleteDoc(project));
      await assertFails(addDoc(collection(db, 'groups/group-01/projects/projeto/evaluations'), seedEvaluation));
      await assertFails(updateDoc(doc(db, 'groups/group-01/projects/projeto/evaluations/avaliacao'), { content: 'Alterado' }));
      await assertFails(deleteDoc(doc(db, 'groups/group-01/projects/projeto/evaluations/avaliacao')));
    });

    it('mantém o diagnóstico funcionando para membros do grupo', async () => {
      const db = env.authenticatedContext('user-a', { groupId: 'group-01' }).firestore();
      await assertSucceeds(addDoc(collection(db, 'groups/group-01/diagnostics'), { description: 'Verificação', createdAt: serverTimestamp() }));
      await assertSucceeds(getDocs(collection(db, 'groups/group-01/diagnostics')));
      await assertFails(getDocs(collection(db, 'groups/group-02/diagnostics')));
    });
  });
});
