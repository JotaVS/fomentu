import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
if (process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099') throw Error('Este script só pode usar o emulador local de autenticação.');
initializeApp({ projectId: 'demo-fomentu' });
const auth = getAuth();
let user;
try { user = await auth.getUserByEmail('grupo01@example.com'); }
catch (error) { if (error.code !== 'auth/user-not-found') throw error; user = await auth.createUser({ email: 'grupo01@example.com', password: 'participante' }); }
await auth.setCustomUserClaims(user.uid, { groupId: 'group-01' });
console.log('Conta fictícia preparada no emulador.');
