import { addDoc, serverTimestamp } from 'firebase/firestore';
import { projectsRef } from '../../lib/firebase';
import { toProjectDoc, type ProjectFormValues } from './projectForm';

/** Cria o projeto no grupo do site, sem login. As datas vêm do relógio do servidor (FR-007, FR-008). */
export async function submitProject(groupId: string, values: ProjectFormValues): Promise<void> {
  await addDoc(projectsRef(groupId), { ...toProjectDoc(values), consentAt: serverTimestamp(), createdAt: serverTimestamp() });
}
