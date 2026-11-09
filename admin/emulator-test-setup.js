import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
if (process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099') throw Error('Este script só pode usar o emulador local de autenticação.');
if (process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080') throw Error('Este script só pode usar o emulador local do Firestore.');
initializeApp({ projectId: 'demo-fomentu' });
const auth = getAuth();
// group-03 não recebe exemplos: serve para verificar o estado vazio.
const accounts = [['grupo01@fomentu.com', 'group-01'], ['grupo02@fomentu.com', 'group-02'], ['grupo03@fomentu.com', 'group-03']];
for (const [email, groupId] of accounts) {
  let user;
  try { user = await auth.getUserByEmail(email); }
  catch (error) { if (error.code !== 'auth/user-not-found') throw error; user = await auth.createUser({ email, password: 'participante' }); }
  await auth.setCustomUserClaims(user.uid, { groupId });
}
// Reaproveita o seed do admin, que funciona no emulador sem credenciais (ver specs/003-consultar-projetos/research.md).
const manage = path.join(path.dirname(fileURLToPath(import.meta.url)), 'manage.js');
for (const groupId of ['group-01', 'group-02']) execFileSync(process.execPath, [manage, 'seed-group', 'demo-fomentu', groupId], { stdio: 'pipe', env: process.env });
console.log('Contas fictícias e exemplos preparados no emulador.');
