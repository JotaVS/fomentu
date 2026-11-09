// Tipos mínimos para começar, compatíveis com os exemplos do seed. O grupo deve revisá-los e
// expandi-los conforme sua especificação e seu planejamento; eles não definem o modelo final.
export type Project = {
  title: string;
  description: string;
};

export type Evaluation = {
  source: 'human' | 'ai';
  content: string;
  // O seed de IA usa modo simulado; o grupo deve definir como representar os modos de IA.
  mode?: 'mock' | 'live';
};
