import { describe, expect, it } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import { MISSING_DATE, MISSING_TEXT, formatDate, labelOrMissing } from '../../src/shared/format';
import { mvpStatuses, partecAreas, proponentProfiles, stages } from '../../src/shared/options';

describe('rótulos das opções (data-model da F01)', () => {
  it('traduz todos os perfis do proponente', () => {
    expect(proponentProfiles).toEqual({
      student: 'Estudante',
      'ufjf-staff': 'TAE ou terceirizado da UFJF',
      faculty: 'Docente',
      'general-public': 'Sociedade em geral',
      company: 'Pessoa jurídica (exceto MEI e sem fins lucrativos)',
    });
  });

  it('traduz todas as áreas do PARTEC-JF', () => {
    expect(partecAreas).toEqual({
      health: 'Saúde e Bem-Estar',
      logistics: 'Logística e Transportes',
      it: 'Tecnologia da Informação',
      'creative-economy': 'Economia Criativa',
      agrifood: 'Agroalimentar',
      energy: 'Sistemas Elétricos e Energia',
      none: 'Nenhuma das áreas prioritárias',
    });
  });

  it('traduz todos os estágios e situações do MVP', () => {
    expect(stages).toEqual({
      ideation: 'Ideação',
      prototyping: 'Prototipação',
      'mvp-validation': 'MVP em validação',
      operation: 'Operação',
      traction: 'Tração',
      scale: 'Escala',
    });
    expect(mvpStatuses).toEqual({ yes: 'Sim', no: 'Não', validating: 'Em fase de validação' });
  });
});

describe('labelOrMissing', () => {
  it('mostra o rótulo de um valor conhecido', () => {
    expect(labelOrMissing(partecAreas, 'health')).toBe('Saúde e Bem-Estar');
  });

  it('mostra "Não informado" quando o valor está ausente ou vazio', () => {
    expect(MISSING_TEXT).toBe('Não informado');
    for (const value of [undefined, null, '', '   ']) expect(labelOrMissing(stages, value)).toBe('Não informado');
  });

  it('mostra um valor desconhecido como foi recebido', () => {
    expect(labelOrMissing(stages, 'unicorn')).toBe('unicorn');
    expect(labelOrMissing(stages, 42)).toBe('42');
  });
});

describe('formatDate', () => {
  // 2026-11-09 17:30 UTC = 14:30 em Brasília (UTC−3, sem horário de verão).
  const instant = new Date('2026-11-09T17:30:00Z');

  it('formata Date no padrão brasileiro e no fuso de Brasília', () => {
    expect(formatDate(instant)).toBe('09/11/2026, 14:30');
  });

  it('aceita o Timestamp do Firestore', () => {
    expect(formatDate(Timestamp.fromDate(instant))).toBe('09/11/2026, 14:30');
  });

  it('usa o fuso de Brasília mesmo perto da meia-noite UTC', () => {
    expect(formatDate(new Date('2026-11-10T01:15:00Z'))).toBe('09/11/2026, 22:15');
  });

  it('mostra "Data não informada" para data ausente ou inválida', () => {
    expect(MISSING_DATE).toBe('Data não informada');
    for (const value of [undefined, null, 'ontem', new Date('inválida')]) expect(formatDate(value)).toBe('Data não informada');
  });
});
