import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Alert, Button, Checkbox, Fieldset, NativeSelect, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { publicGroupId } from '../../lib/firebase';
import { CharCounter } from '../../shared/CharCounter';
import { mvpStatuses, partecAreas, proponentProfiles, stages } from '../../shared/options';
import { emptyProjectForm, limits, validateProjectForm, type ProjectFormValues } from './projectForm';
import { submitProject } from './submitProject';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = keyof ProjectFormValues;
type ChoiceField = 'proponentProfile' | 'partecArea' | 'stage' | 'mvpStatus';

// Mensagens e textos de apoio abaixo do campo, como no restante do formulário.
const belowInput: ('label' | 'input' | 'description' | 'error')[] = ['label', 'input', 'description', 'error'];
const choices = (options: Readonly<Record<string, string>>) => [{ value: '', label: 'Selecione uma opção' }, ...Object.entries(options).map(([value, label]) => ({ value, label }))];

/** Cadastro público de projetos (F01): sem login, grava no grupo configurado para o site. */
export function SubmissionPage() {
  const groupId = publicGroupId();
  const [values, setValues] = useState<ProjectFormValues>(emptyProjectForm);
  const [status, setStatus] = useState<Status>('idle');
  // As mensagens aparecem depois da primeira tentativa de envio e se atualizam enquanto o proponente corrige.
  const [attempted, setAttempted] = useState(false);
  const errors = attempted ? validateProjectForm(values) : {};

  const update = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = event.target;
    setValues(current => ({ ...current, [field]: target instanceof HTMLInputElement && target.type === 'checkbox' ? target.checked : target.value }));
  };
  // Liga cada campo ao valor, ao nome (usado para focar o primeiro erro) e à mensagem de erro.
  const bind = (field: Field) => ({ name: field, error: errors[field], onChange: update(field) });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!groupId || status === 'sending') return;
    const found = validateProjectForm(values);
    if (Object.keys(found).length) {
      setAttempted(true);
      setStatus('idle');
      // Leva o foco ao primeiro campo com problema, na ordem do formulário.
      const first = Array.from(event.currentTarget.elements).find(element => (element as HTMLInputElement).name in found);
      (first as HTMLElement | undefined)?.focus();
      return;
    }
    setStatus('sending');
    try {
      await submitProject(groupId, values);
      setValues(emptyProjectForm);
      setAttempted(false);
      setStatus('success');
    } catch {
      // Falha de rede ou envio negado pelas regras: mensagem genérica e dados mantidos.
      setStatus('error');
    }
  }

  const intro = <><div className="eyebrow"><span/> CADASTRO PÚBLICO</div><h1>Sua ideia começa aqui.</h1></>;
  if (!groupId) return <>{intro}<Alert color="red" title="Cadastro indisponível">Este site ainda não está configurado para receber projetos. Procure o responsável pela oficina.</Alert></>;

  const sending = status === 'sending';
  const select = (field: ChoiceField, label: string, options: Readonly<Record<string, string>>) =>
    <NativeSelect label={label} data={choices(options)} value={values[field]} {...bind(field)} />;
  const longText = (field: 'problem' | 'description', label: string) =>
    <Textarea label={label} autosize minRows={4} maxRows={12} value={values[field]} inputWrapperOrder={belowInput}
      description={<CharCounter value={values[field]} max={limits[field].max} />} {...bind(field)} />;
  // O Checkbox do Mantine não liga a mensagem de erro ao campo; a ligação é feita aqui.
  const consent = (field: 'lgpdConsent' | 'truthDeclaration', label: string) => <div>
    <Checkbox label={label} name={field} checked={values[field]} onChange={update(field)} error={Boolean(errors[field])}
      aria-invalid={errors[field] ? true : undefined} aria-describedby={errors[field] ? `${field}-error` : undefined} />
    {errors[field] && <Text id={`${field}-error`} c="red.8" size="xs" mt={4} ml={32}>{errors[field]}</Text>}
  </div>;

  return <>
    {intro}
    <p>Conte quem você é e apresente sua ideia. Não é preciso criar conta; os dados são vistos apenas pela equipe avaliadora.</p>
    <form className="submission-form" onSubmit={submit} noValidate>
      <Stack gap="lg">
        <Fieldset legend="Sobre você" disabled={sending}>
          <Stack gap="md">
            <TextInput label="Nome completo" autoComplete="name" value={values.proponentName} {...bind('proponentName')} />
            <TextInput label="E-mail" type="email" autoComplete="email" value={values.proponentEmail} {...bind('proponentEmail')} />
            {select('proponentProfile', 'Perfil do proponente', proponentProfiles)}
          </Stack>
        </Fieldset>
        <Fieldset legend="Sobre a ideia" disabled={sending}>
          <Stack gap="md">
            <TextInput label="Nome da solução ou empresa" value={values.title} {...bind('title')} />
            {select('partecArea', 'Área prioritária do PARTEC-JF', partecAreas)}
            {longText('problem', 'Problema ou oportunidade de mercado')}
            {longText('description', 'Descrição da solução')}
            {select('stage', 'Estágio de desenvolvimento', stages)}
            {select('mvpStatus', 'Possui MVP validado?', mvpStatuses)}
            <TextInput label="Link de comprovação do MVP" type="url" placeholder="https://" value={values.mvpLink} inputWrapperOrder={belowInput}
              description="Obrigatório quando o MVP está validado (item 7.2.5-II do edital)." {...bind('mvpLink')} />
          </Stack>
        </Fieldset>
        <Fieldset legend="Aceites" disabled={sending}>
          <Stack gap="md">
            {consent('lgpdConsent', 'Autorizo o tratamento dos meus dados pessoais para esta avaliação, conforme a LGPD (Lei nº 13.709/2018).')}
            {consent('truthDeclaration', 'Declaro que as informações são verdadeiras e que conheço as regras do edital.')}
          </Stack>
        </Fieldset>
        {attempted && Object.keys(errors).length > 0 && <Text c="red.8" size="sm">Confira os campos destacados antes de enviar.</Text>}
        {status === 'success' && <Alert color="fomentu" role="status" title="Projeto enviado com sucesso!">A equipe do grupo vai analisar sua ideia.</Alert>}
        {status === 'error' && <Alert color="red" title="Não foi possível enviar o projeto">Seus dados foram mantidos; tente novamente em instantes.</Alert>}
        <Button type="submit" size="md" disabled={sending} style={{ alignSelf: 'flex-start' }}>{sending ? 'Enviando...' : 'Enviar projeto'}</Button>
      </Stack>
    </form>
  </>;
}
