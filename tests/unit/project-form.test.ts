import { describe, expect, it } from 'vitest';
import { emptyProjectForm, toProjectDoc, validateProjectForm, type ProjectFormValues } from '../../src/features/submission/projectForm';

function filledForm(): ProjectFormValues {
  return {
    proponentName: '  Maria da Silva ',
    proponentEmail: ' Maria.Silva@Exemplo.com.BR ',
    proponentProfile: 'student',
    title: '  ReusoLab  ',
    partecArea: 'creative-economy',
    problem: '  Materiais em bom estado são descartados porque não há um canal simples de doação.  ',
    description: '  Conecta negócios que possuem materiais reaproveitáveis a quem pode reutilizá-los.  ',
    stage: 'ideation',
    mvpStatus: 'no',
    mvpLink: '   ',
    lgpdConsent: true,
    truthDeclaration: true,
  };
}

describe('emptyProjectForm', () => {
  it('começa com todos os campos vazios e os aceites desmarcados', () => {
    expect(Object.values(emptyProjectForm).every(value => value === '' || value === false)).toBe(true);
  });
});

describe('toProjectDoc', () => {
  it('apara os textos e grava o e-mail em minúsculas', () => {
    const data = toProjectDoc(filledForm());
    expect(data.proponentName).toBe('Maria da Silva');
    expect(data.proponentEmail).toBe('maria.silva@exemplo.com.br');
    expect(data.problem).toBe('Materiais em bom estado são descartados porque não há um canal simples de doação.');
  });

  it('grava o nome da solução em title e a descrição em description, como o seed (FR-009)', () => {
    const data = toProjectDoc(filledForm());
    expect(data.title).toBe('ReusoLab');
    expect(data.description).toBe('Conecta negócios que possuem materiais reaproveitáveis a quem pode reutilizá-los.');
  });

  it('marca a origem como cadastro público e não envia aceites nem datas', () => {
    const data = toProjectDoc(filledForm());
    expect(data.createdBy).toBe('public-form');
    expect(Object.keys(data).sort()).toEqual([
      'createdBy', 'description', 'partecArea', 'problem', 'proponentEmail', 'proponentName',
      'proponentProfile', 'stage', 'mvpStatus', 'title',
    ].sort());
  });

  it('omite mvpLink quando o link está vazio', () => {
    expect('mvpLink' in toProjectDoc(filledForm())).toBe(false);
  });

  it('mantém o link aparado quando informado', () => {
    const data = toProjectDoc({ ...filledForm(), mvpStatus: 'yes', mvpLink: ' https://reusolab.com.br ' });
    expect(data.mvpStatus).toBe('yes');
    expect(data.mvpLink).toBe('https://reusolab.com.br');
  });
});

describe('validateProjectForm (F01-US2)', () => {
  function validForm(): ProjectFormValues {
    return { ...filledForm(), proponentEmail: 'maria.silva@exemplo.com.br' };
  }

  it('aceita um formulário válido, com e sem link do MVP', () => {
    expect(validateProjectForm(validForm())).toEqual({});
    expect(validateProjectForm({ ...validForm(), mvpStatus: 'yes', mvpLink: 'https://reusolab.com.br' })).toEqual({});
    expect(validateProjectForm({ ...validForm(), mvpStatus: 'validating', mvpLink: 'http://exemplo.com' })).toEqual({});
  });

  it('exige todos os campos obrigatórios e os aceites, com mensagens em PT-BR', () => {
    const errors = validateProjectForm(emptyProjectForm);
    expect(errors).toEqual({
      proponentName: 'Informe seu nome completo.',
      proponentEmail: 'Informe seu e-mail.',
      proponentProfile: 'Selecione seu perfil.',
      title: 'Informe o nome da solução ou empresa.',
      partecArea: 'Selecione a área prioritária do PARTEC-JF.',
      problem: 'Descreva o problema ou a oportunidade de mercado.',
      description: 'Descreva a solução.',
      stage: 'Selecione o estágio de desenvolvimento.',
      mvpStatus: 'Informe se a solução possui MVP validado.',
      lgpdConsent: 'Autorize o tratamento dos dados pessoais (LGPD) para enviar.',
      truthDeclaration: 'Confirme a declaração de veracidade para enviar.',
    });
  });

  it('trata um campo só com espaços como vazio', () => {
    const errors = validateProjectForm({ ...validForm(), proponentName: '    ', problem: ' \n ' });
    expect(errors.proponentName).toBe('Informe seu nome completo.');
    expect(errors.problem).toBe('Descreva o problema ou a oportunidade de mercado.');
  });

  it('aplica os limites mínimo e máximo de cada texto, depois de aparar', () => {
    const errors = validateProjectForm({
      ...validForm(),
      proponentName: ' Al ',
      title: 'A'.repeat(101),
      problem: 'Curto demais.',
      description: 'A'.repeat(1001),
    });
    expect(errors.proponentName).toBe('O nome deve ter entre 3 e 120 caracteres.');
    expect(errors.title).toBe('O nome da solução deve ter entre 3 e 100 caracteres.');
    expect(errors.problem).toBe('O problema deve ter entre 30 e 1.000 caracteres.');
    expect(errors.description).toBe('A descrição deve ter entre 30 e 1.000 caracteres.');
    expect(validateProjectForm({ ...validForm(), proponentName: 'A'.repeat(121) }).proponentName).toBe('O nome deve ter entre 3 e 120 caracteres.');
    expect(validateProjectForm({ ...validForm(), title: `  ${'A'.repeat(100)}  ` }).title).toBeUndefined();
  });

  it('valida o formato e o tamanho do e-mail, aceitando maiúsculas', () => {
    for (const email of ['maria-sem-arroba', 'maria@', '@exemplo.com', 'maria@exemplo', 'maria silva@exemplo.com']) {
      expect(validateProjectForm({ ...validForm(), proponentEmail: email }).proponentEmail).toBe('Informe um e-mail válido, como nome@exemplo.com.');
    }
    expect(validateProjectForm({ ...validForm(), proponentEmail: `${'a'.repeat(250)}@x.com` }).proponentEmail).toBe('O e-mail deve ter até 254 caracteres.');
    expect(validateProjectForm({ ...validForm(), proponentEmail: ' Maria.Silva@Exemplo.com.BR ' }).proponentEmail).toBeUndefined();
  });

  it('exige o link quando o MVP está validado', () => {
    expect(validateProjectForm({ ...validForm(), mvpStatus: 'yes', mvpLink: '  ' }).mvpLink)
      .toBe('O edital exige o link de comprovação quando o MVP está validado (item 7.2.5-II).');
  });

  it('valida o link do MVP quando informado', () => {
    for (const link of ['reusolab.com.br', 'ftp://reusolab.com.br', 'https://', 'https://reuso lab.com']) {
      expect(validateProjectForm({ ...validForm(), mvpStatus: 'no', mvpLink: link }).mvpLink).toBe('Informe um link começando com http:// ou https://.');
    }
    expect(validateProjectForm({ ...validForm(), mvpStatus: 'yes', mvpLink: `https://${'a'.repeat(493)}` }).mvpLink).toBe('O link deve ter até 500 caracteres.');
  });

  it('rejeita opções fora da lista', () => {
    const errors = validateProjectForm({ ...validForm(), stage: 'unicorn' as ProjectFormValues['stage'] });
    expect(errors.stage).toBe('Selecione o estágio de desenvolvimento.');
  });
});
