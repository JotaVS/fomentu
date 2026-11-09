import { mvpStatuses, partecAreas, proponentProfiles, stages, type MvpStatus, type PartecArea, type ProponentProfile, type Stage } from '../../shared/options';

/** Valores do formulário como digitados; '' indica opção ainda não escolhida. */
export type ProjectFormValues = {
  proponentName: string;
  proponentEmail: string;
  proponentProfile: ProponentProfile | '';
  title: string;
  partecArea: PartecArea | '';
  problem: string;
  description: string;
  stage: Stage | '';
  mvpStatus: MvpStatus | '';
  mvpLink: string;
  lgpdConsent: boolean;
  truthDeclaration: boolean;
};

/** Documento gravado em groups/{groupId}/projects, sem as datas (definidas pelo servidor no envio). */
export type ProjectDoc = {
  title: string;
  description: string;
  problem: string;
  proponentName: string;
  proponentEmail: string;
  proponentProfile: ProponentProfile;
  partecArea: PartecArea;
  stage: Stage;
  mvpStatus: MvpStatus;
  mvpLink?: string;
  createdBy: 'public-form';
};

export const emptyProjectForm: ProjectFormValues = {
  proponentName: '',
  proponentEmail: '',
  proponentProfile: '',
  title: '',
  partecArea: '',
  problem: '',
  description: '',
  stage: '',
  mvpStatus: '',
  mvpLink: '',
  lgpdConsent: false,
  truthDeclaration: false,
};

/**
 * Normaliza o formulário para o documento do Firestore: apara os textos, grava o e-mail em
 * minúsculas e omite o link vazio. Os aceites viram `consentAt` no envio (submitProject).
 * Espera um formulário já validado: as opções não podem estar vazias.
 */
export function toProjectDoc(values: ProjectFormValues): ProjectDoc {
  const mvpLink = values.mvpLink.trim();
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    problem: values.problem.trim(),
    proponentName: values.proponentName.trim(),
    proponentEmail: values.proponentEmail.trim().toLowerCase(),
    proponentProfile: values.proponentProfile as ProponentProfile,
    partecArea: values.partecArea as PartecArea,
    stage: values.stage as Stage,
    mvpStatus: values.mvpStatus as MvpStatus,
    ...(mvpLink ? { mvpLink } : {}),
    createdBy: 'public-form',
  };
}

/** Limites dos textos, iguais aos de validPublicProject() em firestore.rules. */
export const limits = {
  proponentName: { min: 3, max: 120 },
  proponentEmail: { max: 254 },
  title: { min: 3, max: 100 },
  problem: { min: 30, max: 1000 },
  description: { min: 30, max: 1000 },
  mvpLink: { max: 500 },
} as const;

export type ProjectFormErrors = Partial<Record<keyof ProjectFormValues, string>>;

// Mesmo padrão das regras, aplicado ao e-mail já em minúsculas.
const EMAIL_PATTERN = /^[a-z0-9._%+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/;
const LINK_PATTERN = /^https?:\/\/\S+$/;

function textError(value: string, { min, max }: { min: number; max: number }, empty: string, outOfRange: string) {
  if (!value) return empty;
  if (value.length < min || value.length > max) return outOfRange;
}

/**
 * Valida o formulário antes do envio (F01-US2). Os textos são aparados antes da verificação; um
 * campo só com espaços conta como vazio. Retorna uma mensagem em PT-BR por campo com problema.
 */
export function validateProjectForm(values: ProjectFormValues): ProjectFormErrors {
  const errors: ProjectFormErrors = {};
  const set = (field: keyof ProjectFormValues, message: string | undefined) => { if (message) errors[field] = message; };

  set('proponentName', textError(values.proponentName.trim(), limits.proponentName, 'Informe seu nome completo.', 'O nome deve ter entre 3 e 120 caracteres.'));

  const email = values.proponentEmail.trim().toLowerCase();
  if (!email) set('proponentEmail', 'Informe seu e-mail.');
  else if (email.length > limits.proponentEmail.max) set('proponentEmail', 'O e-mail deve ter até 254 caracteres.');
  else if (!EMAIL_PATTERN.test(email)) set('proponentEmail', 'Informe um e-mail válido, como nome@exemplo.com.');

  if (!Object.hasOwn(proponentProfiles, values.proponentProfile)) set('proponentProfile', 'Selecione seu perfil.');
  set('title', textError(values.title.trim(), limits.title, 'Informe o nome da solução ou empresa.', 'O nome da solução deve ter entre 3 e 100 caracteres.'));
  if (!Object.hasOwn(partecAreas, values.partecArea)) set('partecArea', 'Selecione a área prioritária do PARTEC-JF.');
  set('problem', textError(values.problem.trim(), limits.problem, 'Descreva o problema ou a oportunidade de mercado.', 'O problema deve ter entre 30 e 1.000 caracteres.'));
  set('description', textError(values.description.trim(), limits.description, 'Descreva a solução.', 'A descrição deve ter entre 30 e 1.000 caracteres.'));
  if (!Object.hasOwn(stages, values.stage)) set('stage', 'Selecione o estágio de desenvolvimento.');
  if (!Object.hasOwn(mvpStatuses, values.mvpStatus)) set('mvpStatus', 'Informe se a solução possui MVP validado.');

  const link = values.mvpLink.trim();
  if (!link) { if (values.mvpStatus === 'yes') set('mvpLink', 'O edital exige o link de comprovação quando o MVP está validado (item 7.2.5-II).'); }
  else if (link.length > limits.mvpLink.max) set('mvpLink', 'O link deve ter até 500 caracteres.');
  else if (!LINK_PATTERN.test(link) || !URL.canParse(link)) set('mvpLink', 'Informe um link começando com http:// ou https://.');

  if (!values.lgpdConsent) set('lgpdConsent', 'Autorize o tratamento dos dados pessoais (LGPD) para enviar.');
  if (!values.truthDeclaration) set('truthDeclaration', 'Confirme a declaração de veracidade para enviar.');
  return errors;
}
