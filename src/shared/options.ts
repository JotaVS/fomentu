// Valores gravados no Firestore (em inglês) e rótulos exibidos (PT-BR).
// Fonte: specs/002-cadastrar-projeto/data-model.md. As regras em firestore.rules aceitam só estes valores.

export const proponentProfiles = {
  student: 'Estudante',
  'ufjf-staff': 'TAE ou terceirizado da UFJF',
  faculty: 'Docente',
  'general-public': 'Sociedade em geral',
  company: 'Pessoa jurídica (exceto MEI e sem fins lucrativos)',
} as const;

export const partecAreas = {
  health: 'Saúde e Bem-Estar',
  logistics: 'Logística e Transportes',
  it: 'Tecnologia da Informação',
  'creative-economy': 'Economia Criativa',
  agrifood: 'Agroalimentar',
  energy: 'Sistemas Elétricos e Energia',
  none: 'Nenhuma das áreas prioritárias',
} as const;

export const stages = {
  ideation: 'Ideação',
  prototyping: 'Prototipação',
  'mvp-validation': 'MVP em validação',
  operation: 'Operação',
  traction: 'Tração',
  scale: 'Escala',
} as const;

export const mvpStatuses = {
  yes: 'Sim',
  no: 'Não',
  validating: 'Em fase de validação',
} as const;

export type ProponentProfile = keyof typeof proponentProfiles;
export type PartecArea = keyof typeof partecAreas;
export type Stage = keyof typeof stages;
export type MvpStatus = keyof typeof mvpStatuses;
