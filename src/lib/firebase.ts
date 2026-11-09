import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, type User } from 'firebase/auth';
import { collection, connectFirestoreEmulator, doc, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';

const app = initializeApp({ apiKey: import.meta.env.VITE_FIREBASE_API_KEY, authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, appId: import.meta.env.VITE_FIREBASE_APP_ID });
export const auth = getAuth(app);
export const db = getFirestore(app);
const functions = getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'us-central1');
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectFunctionsEmulator(functions, '127.0.0.1', 5001);
}
const GROUP_ID_PATTERN = /^group-(0[1-9]|[1-9][0-9])$/;
export async function groupFor(user: User): Promise<string> {
  const group = (await user.getIdTokenResult()).claims.groupId;
  if (typeof group !== 'string' || !GROUP_ID_PATTERN.test(group)) throw new Error('Sua conta não possui um grupo válido. Procure o instrutor.');
  return group;
}
/** Grupo que recebe os projetos do cadastro público deste site (VITE_GROUP_ID); null se ausente ou inválido. */
export function publicGroupId(value: string | undefined = import.meta.env.VITE_GROUP_ID): string | null {
  return value && GROUP_ID_PATTERN.test(value) ? value : null;
}
export const groupRef = (group: string) => doc(db, 'groups', group);
export const projectsRef = (group: string) => collection(groupRef(group), 'projects');
export const evaluationsRef = (group: string, project: string) => collection(doc(projectsRef(group), project), 'evaluations');
export const generateText = httpsCallable<{prompt: string}, {text: string; mode: 'live' | 'mock'; model?: string}>(functions, 'generateText');
