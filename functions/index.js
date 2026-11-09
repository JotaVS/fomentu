import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
initializeApp();
const db = getFirestore();
export const generateText = onCall({ region: 'us-central1', timeoutSeconds: 30 }, async request => {
  const group = request.auth?.token.groupId;
  if (!request.auth || typeof group !== 'string' || !/^group-[a-z0-9](?:[a-z0-9-]{0,13}[a-z0-9])?$/.test(group)) throw new HttpsError('permission-denied', 'Usuário sem grupo autorizado.');
  const prompt = request.data?.prompt;
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 4000) throw new HttpsError('invalid-argument', 'Informe um texto de até 4000 caracteres.');
  const day = new Date().toISOString().slice(0, 10);
  const usage = db.doc(`aiUsage/${group}-${day}`);
  await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(usage);
    if ((snapshot.data()?.count ?? 0) >= 100) throw new HttpsError('resource-exhausted', 'Limite diário do grupo atingido.');
    transaction.set(usage, { count: FieldValue.increment(1) }, { merge: true });
  });
  if (process.env.AI_MODE !== 'mock') throw new HttpsError('failed-precondition', 'A integração real de IA ainda não foi configurada.');
  return { text: 'Resposta simulada para o treinamento.', mode: 'mock' };
});
