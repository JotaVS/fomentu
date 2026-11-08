import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { execFileSync } from 'node:child_process';
const [action, project, argument, extraArgument] = process.argv.slice(2);
if (project !== 'fomentu-15f33' && !/^demo-[a-z0-9-]+$/.test(project || '')) throw Error('Informe explicitamente um projeto autorizado.');
initializeApp({ credential: applicationDefault(), projectId: project });
const db = getFirestore();
const auth = getAuth();
const validGroup = group => /^group-(0[1-9]|[1-9][0-9])$/.test(group || '');
function hostingSite(group, create) {
  if (project.startsWith('demo-')) return;
  const site = `${project}-g${group.slice(-2)}`;
  const response = JSON.parse(execFileSync('firebase', ['hosting:sites:list', '--project', project, '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  const exists = response.result.sites.some(item => item.name.endsWith(`/sites/${site}`));
  if (create && !exists) execFileSync('firebase', ['hosting:sites:create', site, '--project', project], { stdio: 'inherit' });
  if (!create && exists) execFileSync('firebase', ['hosting:sites:delete', site, '--project', project, '--force'], { stdio: 'inherit' });
}
const examples = [
  ['project-001', 'ReusoLab', 'Conecta negócios que possuem materiais reaproveitáveis a quem pode reutilizá-los.'],
  ['project-002', 'AgendaLab', 'Organiza reservas de equipamentos compartilhados de laboratório.'],
  ['project-003', 'HortaPerto', 'Aproxima pequenos produtores de consumidores da região.'],
  ['project-004', 'Água Clara', 'Ajuda escolas a acompanhar o consumo de água e identificar desperdícios.'],
  ['project-005', 'Rota Acessível', 'Reúne informações de acessibilidade para planejar trajetos urbanos.'],
  ['project-006', 'Troca Livro', 'Conecta leitores interessados em trocar livros usados no bairro.'],
  ['project-007', 'Oficina Circular', 'Facilita o conserto de pequenos eletrodomésticos em oficinas locais.'],
  ['project-008', 'Fila Justa', 'Ajuda associações comunitárias a organizar agendamentos de atendimento.'],
  ['project-009', 'Quintal Vivo', 'Conecta moradores interessados em compartilhar mudas e sementes.'],
  ['project-010', 'Mapa da Feira', 'Divulga feiras de produtores locais e seus horários de funcionamento.'],
  ['project-011', 'Energia na Escola', 'Ajuda estudantes a visualizar o consumo de energia da escola.'],
  ['project-012', 'Conecta Voluntários', 'Aproxima pessoas voluntárias de ações de organizações locais.'],
  ['project-013', 'Refeição Solidária', 'Ajuda cozinhas comunitárias a organizar doações de alimentos.'],
];
async function seed(group) {
  const root = db.doc(`groups/${group}`);
  const createIfMissing = async (ref, data) => { try { await ref.create(data); } catch (error) { if (error.code !== 6) throw error; } };
  await createIfMissing(root, { createdAt: FieldValue.serverTimestamp() });
  for (const [id, title, description] of examples) {
    const ref = root.collection('projects').doc(id);
    await createIfMissing(ref, { title, description, createdBy: 'seed', createdAt: FieldValue.serverTimestamp() });
    if (id === 'project-002') await createIfMissing(ref.collection('evaluations').doc('example-human'), { source: 'human', content: 'A ideia pode facilitar o compartilhamento de equipamentos.', createdBy: 'seed', createdAt: FieldValue.serverTimestamp() });
    if (id === 'project-003') await createIfMissing(ref.collection('evaluations').doc('example-ai'), { source: 'ai', mode: 'mock', content: 'Análise fictícia: investigar como conectar produtores e consumidores.', createdBy: 'seed', createdAt: FieldValue.serverTimestamp() });
    if (id === 'project-004') await createIfMissing(ref.collection('evaluations').doc('example-human'), { source: 'human', content: 'Vale conversar com escolas sobre a coleta dos dados de consumo.', createdBy: 'seed', createdAt: FieldValue.serverTimestamp() });
    if (id === 'project-005') await createIfMissing(ref.collection('evaluations').doc('example-ai'), { source: 'ai', mode: 'mock', content: 'Análise fictícia: verificar como manter atualizadas as informações dos trajetos.', createdBy: 'seed', createdAt: FieldValue.serverTimestamp() });
  }
  await createIfMissing(root.collection('diagnostics').doc('seed-001'), { description: 'Exemplo técnico de preparação', createdAt: FieldValue.serverTimestamp() });
  await createIfMissing(root.collection('diagnostics').doc('seed-002'), { description: 'Exemplo técnico de verificação', createdAt: FieldValue.serverTimestamp() });
}
if (action === 'create') {
  if (!validGroup(argument)) throw Error('Use um grupo de group-01 a group-99.');
  if (extraArgument) throw Error('Informe apenas o identificador do grupo.');
  const suffix = argument.slice(-2);
  const prefix = `grupo${suffix}`;
  const email = `${prefix}@example.com`;
  const password = 'participante';
  let user;
  try {
    user = await auth.getUserByEmail(email);
    if (user.customClaims?.groupId && user.customClaims.groupId !== argument) throw Error('A conta já pertence a outro grupo.');
    user = await auth.updateUser(user.uid, { password, disabled: false });
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
    let previous;
    try { previous = await auth.getUserByEmail(`participante-grupo${suffix}@example.com`); }
    catch (lookupError) { if (lookupError.code !== 'auth/user-not-found') throw lookupError; }
    if (previous) {
      if (previous.customClaims?.groupId !== argument) throw Error('A conta anterior não está vinculada ao grupo solicitado.');
      user = await auth.updateUser(previous.uid, { email, password, disabled: false, emailVerified: false });
    } else {
      user = await auth.createUser({ email, password });
    }
  }
  await auth.setCustomUserClaims(user.uid, { ...user.customClaims, groupId: argument });
  await seed(argument);
  hostingSite(argument, true);
  console.log(`Grupo ${argument} preparado; conta ${email}.`);
} else if (action === 'delete') {
  if (!validGroup(argument)) throw Error('Use um grupo de group-01 a group-99.');
  const input = createInterface({ input: stdin, output: stdout });
  const answer = await input.question(`Excluir permanentemente site, dados, avaliações, uso de IA e usuários de ${argument} no projeto ${project}? Digite ${argument} para confirmar: `);
  input.close();
  if (answer !== argument) {
    console.log('Exclusão cancelada.');
    process.exit(0);
  }
  await db.recursiveDelete(db.doc(`groups/${argument}`));
  const usages = await db.collection('aiUsage').listDocuments();
  for (const usage of usages) if (usage.id.startsWith(`${argument}-`)) await db.recursiveDelete(usage);
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    for (const user of page.users) if (user.customClaims?.groupId === argument) await auth.deleteUser(user.uid);
    pageToken = page.pageToken;
  } while (pageToken);
  hostingSite(argument, false);
  console.log(`Dados, usuários e site de ${argument} excluídos.`);
} else if (action === 'seed-group') {
  if (!validGroup(argument)) throw Error('Use um grupo de group-01 a group-99.');
  await seed(argument);
  console.log(`Exemplos ausentes criados para ${argument}.`);
} else if (action === 'seed') {
  for (let n = 1; n <= 10; n++) await seed(`group-${String(n).padStart(2, '0')}`);
  console.log('Exemplos ausentes criados para os dez grupos.');
} else if (action === 'accounts') {
  const manifest = JSON.parse(await readFile(argument, 'utf8'));
  if (!Array.isArray(manifest) || manifest.some(x => !validGroup(x.groupId) || typeof x.email !== 'string' || typeof x.password !== 'string')) throw Error('Manifesto inválido.');
  for (const entry of manifest) {
    let user;
    try { user = await auth.getUserByEmail(entry.email); } catch (error) { if (error.code !== 'auth/user-not-found') throw error; user = await auth.createUser({ email: entry.email, password: entry.password }); }
    await auth.setCustomUserClaims(user.uid, { ...user.customClaims, groupId: entry.groupId });
    console.log(`Conta preparada para ${entry.groupId}.`);
  }
} else if (action === 'reset') {
  if (!validGroup(argument) || process.env.CONFIRM_GROUP !== argument) throw Error('Informe grupo válido e CONFIRM_GROUP com o mesmo valor.');
  console.log(`Restaurando ${argument} no projeto ${project}.`);
  await db.recursiveDelete(db.doc(`groups/${argument}`));
  await seed(argument);
} else throw Error('Use create, delete, seed-group, seed, accounts ou reset.');
