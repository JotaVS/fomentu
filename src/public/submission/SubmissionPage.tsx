import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { publicGroupId } from '../../lib/firebase';
import { CharCounter } from '../../shared/CharCounter';
import { mvpStatuses, partecAreas, proponentProfiles, stages } from '../../shared/options';
import { emptyProjectForm, limits, validateProjectForm, type ProjectFormErrors, type ProjectFormValues } from './projectForm';
import { submitProject } from './submitProject';

type Status = 'idle' | 'sending' | 'success' | 'error';
type Field = keyof ProjectFormValues;

/** Atributos que ligam um campo ao rótulo, à mensagem de erro e aos textos de apoio. */
function control(field: Field, errors: ProjectFormErrors, ...describedBy: string[]) {
  const ids = [...describedBy, ...(errors[field] ? [`${field}-error`] : [])];
  return { id: field, name: field, 'aria-invalid': errors[field] ? true : undefined, 'aria-describedby': ids.length ? ids.join(' ') : undefined };
}

function FieldError({ field, errors }: { field: Field; errors: ProjectFormErrors }) {
  return errors[field] ? <span id={`${field}-error`} className="field-error">{errors[field]}</span> : null;
}

function FieldBox({ field, label, errors, children }: { field: Field; label: string; errors: ProjectFormErrors; children: ReactNode }) {
  return <div className="field"><label htmlFor={field}>{label}</label>{children}<FieldError field={field} errors={errors} /></div>;
}

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
  if (!groupId) return <>{intro}<p className="form-error" role="alert">Este site ainda não está configurado para receber projetos. Procure o responsável pela oficina.</p></>;

  const sending = status === 'sending';
  const select = (field: 'proponentProfile' | 'partecArea' | 'stage' | 'mvpStatus', label: string, options: Readonly<Record<string, string>>) =>
    <FieldBox field={field} label={label} errors={errors}><select {...control(field, errors)} value={values[field]} onChange={update(field)}><option value="">Selecione uma opção</option>{Object.entries(options).map(([key, text]) => <option key={key} value={key}>{text}</option>)}</select></FieldBox>;
  const longText = (field: 'problem' | 'description', label: string) =>
    <FieldBox field={field} label={label} errors={errors}><textarea {...control(field, errors, `${field}-counter`)} rows={5} value={values[field]} onChange={update(field)} /><CharCounter id={`${field}-counter`} value={values[field]} max={limits[field].max} /></FieldBox>;
  const consent = (field: 'lgpdConsent' | 'truthDeclaration', label: string) =>
    <div className="field"><div className="checkbox"><input type="checkbox" {...control(field, errors)} checked={values[field]} onChange={update(field)} /><label htmlFor={field}>{label}</label></div><FieldError field={field} errors={errors} /></div>;

  return <>
    {intro}
    <p>Conte quem você é e apresente sua ideia. Não é preciso criar conta; os dados são vistos apenas pela equipe avaliadora.</p>
    <form className="submission-form" onSubmit={submit} noValidate>
      <fieldset disabled={sending}>
        <legend>Sobre você</legend>
        <FieldBox field="proponentName" label="Nome completo" errors={errors}><input {...control('proponentName', errors)} autoComplete="name" value={values.proponentName} onChange={update('proponentName')} /></FieldBox>
        <FieldBox field="proponentEmail" label="E-mail" errors={errors}><input {...control('proponentEmail', errors)} type="email" autoComplete="email" value={values.proponentEmail} onChange={update('proponentEmail')} /></FieldBox>
        {select('proponentProfile', 'Perfil do proponente', proponentProfiles)}
      </fieldset>
      <fieldset disabled={sending}>
        <legend>Sobre a ideia</legend>
        <FieldBox field="title" label="Nome da solução ou empresa" errors={errors}><input {...control('title', errors)} value={values.title} onChange={update('title')} /></FieldBox>
        {select('partecArea', 'Área prioritária do PARTEC-JF', partecAreas)}
        {longText('problem', 'Problema ou oportunidade de mercado')}
        {longText('description', 'Descrição da solução')}
        {select('stage', 'Estágio de desenvolvimento', stages)}
        {select('mvpStatus', 'Possui MVP validado?', mvpStatuses)}
        <FieldBox field="mvpLink" label="Link de comprovação do MVP" errors={errors}><input {...control('mvpLink', errors, 'mvpLink-hint')} type="url" placeholder="https://" value={values.mvpLink} onChange={update('mvpLink')} /><small id="mvpLink-hint">Obrigatório quando o MVP está validado (item 7.2.5-II do edital).</small></FieldBox>
      </fieldset>
      <fieldset disabled={sending}>
        <legend>Aceites</legend>
        {consent('lgpdConsent', 'Autorizo o tratamento dos meus dados pessoais para esta avaliação, conforme a LGPD (Lei nº 13.709/2018).')}
        {consent('truthDeclaration', 'Declaro que as informações são verdadeiras e que conheço as regras do edital.')}
      </fieldset>
      {attempted && Object.keys(errors).length > 0 && <p className="form-error">Confira os campos destacados antes de enviar.</p>}
      {status === 'success' && <p className="status-message" role="status">Projeto enviado com sucesso! A equipe do grupo vai analisar sua ideia.</p>}
      {status === 'error' && <p className="form-error" role="alert">Não foi possível enviar o projeto. Seus dados foram mantidos; tente novamente em instantes.</p>}
      <button className="button primary" type="submit" disabled={sending}>{sending ? 'Enviando...' : 'Enviar projeto'}</button>
    </form>
  </>;
}
