import { test, expect, type Page, type TestInfo } from '@playwright/test';

async function capture(page: Page, info: TestInfo, name: string) {
  await info.attach(name, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
}

// Lê os projetos do grupo direto no emulador; "Bearer owner" ignora as Security Rules.
async function projectsWithTitle(title: string) {
  const url = 'http://127.0.0.1:8080/v1/projects/demo-fomentu/databases/(default)/documents/groups/group-01/projects?pageSize=300';
  const response = await fetch(url, { headers: { Authorization: 'Bearer owner' } });
  const body = await response.json() as { documents?: { fields: Record<string, { stringValue?: string; timestampValue?: string }> }[] };
  return (body.documents ?? []).filter(item => item.fields.title?.stringValue === title).map(item => item.fields);
}

test('envia um projeto sem login para o grupo do site (F01-US1)', async ({ page }, info) => {
  test.skip(process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080', 'Execute yarn test:e2e:emulador.');
  const title = `Projeto e2e ${Date.now()}`;

  await page.goto('/cadastro');
  await expect(page.getByRole('heading', { name: 'Sua ideia começa aqui.' })).toBeVisible();
  await page.getByLabel('Nome completo').fill('  Maria da Silva ');
  await page.getByLabel('E-mail').fill('Maria.Silva@Exemplo.com.br');
  await page.getByLabel('Perfil do proponente').selectOption({ label: 'Estudante' });
  await page.getByLabel('Nome da solução ou empresa').fill(title);
  await page.getByLabel('Área prioritária do PARTEC-JF').selectOption({ label: 'Economia Criativa' });
  await page.getByLabel('Problema ou oportunidade de mercado').fill('Materiais em bom estado são descartados porque não há um canal simples de doação.');
  await page.getByLabel('Descrição da solução').fill('Conecta negócios que possuem materiais reaproveitáveis a quem pode reutilizá-los.');
  await page.getByLabel('Estágio de desenvolvimento').selectOption({ label: 'Prototipação' });
  await page.getByLabel('Possui MVP validado?').selectOption({ label: 'Sim' });
  await page.getByLabel('Link de comprovação do MVP').fill('https://reusolab.com.br');
  await page.getByRole('checkbox', { name: /LGPD/ }).check();
  await page.getByRole('checkbox', { name: /Declaro/ }).check();
  await capture(page, info, '01-cadastro-preenchido');

  // Atrasa a gravação para observar o botão indisponível durante o envio (FR-011).
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/google.firestore.v1.Firestore/Write/**', async route => { await held; await route.continue(); });
  const submit = page.getByRole('button', { name: /Enviar projeto|Enviando/ });
  await submit.click();
  await expect(submit).toBeDisabled();
  await expect(submit).toHaveText(/Enviando/);
  release();

  await expect(page.getByRole('status')).toContainText('Projeto enviado com sucesso');
  await capture(page, info, '02-cadastro-enviado');
  await expect(page.getByLabel('Nome completo')).toHaveValue('');
  await expect(page.getByLabel('Nome da solução ou empresa')).toHaveValue('');
  await expect(page.getByLabel('Perfil do proponente')).toHaveValue('');
  await expect(page.getByRole('checkbox', { name: /LGPD/ })).not.toBeChecked();
  await expect(page.getByRole('status')).not.toContainText(title);

  const saved = await projectsWithTitle(title);
  expect(saved).toHaveLength(1);
  expect(saved[0].proponentName.stringValue).toBe('Maria da Silva');
  expect(saved[0].proponentEmail.stringValue).toBe('maria.silva@exemplo.com.br');
  expect(saved[0].partecArea.stringValue).toBe('creative-economy');
  expect(saved[0].stage.stringValue).toBe('prototyping');
  expect(saved[0].mvpLink.stringValue).toBe('https://reusolab.com.br');
  expect(saved[0].createdBy.stringValue).toBe('public-form');
  expect(saved[0].createdAt.timestampValue).toBeTruthy();
  expect(saved[0].consentAt.timestampValue).toBeTruthy();
});

async function projectCount() {
  const url = 'http://127.0.0.1:8080/v1/projects/demo-fomentu/databases/(default)/documents/groups/group-01/projects?pageSize=300';
  const body = await (await fetch(url, { headers: { Authorization: 'Bearer owner' } })).json() as { documents?: unknown[] };
  return body.documents?.length ?? 0;
}

async function fillValidForm(page: Page, title: string) {
  await page.getByLabel('Nome completo').fill('Maria da Silva');
  await page.getByLabel('E-mail').fill('maria.silva@exemplo.com.br');
  await page.getByLabel('Perfil do proponente').selectOption({ label: 'Docente' });
  await page.getByLabel('Nome da solução ou empresa').fill(title);
  await page.getByLabel('Área prioritária do PARTEC-JF').selectOption({ label: 'Saúde e Bem-Estar' });
  await page.getByLabel('Problema ou oportunidade de mercado').fill('Pacientes esperam muito tempo por informações sobre exames simples.');
  await page.getByLabel('Descrição da solução').fill('Aplicativo que avisa o paciente quando o resultado do exame fica pronto.');
  await page.getByLabel('Estágio de desenvolvimento').selectOption({ label: 'Ideação' });
  await page.getByLabel('Possui MVP validado?').selectOption({ label: 'Não' });
  await page.getByRole('checkbox', { name: /LGPD/ }).check();
  await page.getByRole('checkbox', { name: /Declaro/ }).check();
}

test.describe('validação do cadastro (F01-US2)', () => {
  test.beforeEach(() => { test.skip(process.env.FIRESTORE_EMULATOR_HOST !== '127.0.0.1:8080', 'Execute yarn test:e2e:emulador.'); });

  test('envio vazio mostra uma mensagem em cada campo e não grava', async ({ page }, info) => {
    const before = await projectCount();
    await page.goto('/cadastro');
    await page.getByRole('button', { name: 'Enviar projeto' }).click();
    const expected: Array<[string, string]> = [
      ['Nome completo', 'Informe seu nome completo.'],
      ['E-mail', 'Informe seu e-mail.'],
      ['Perfil do proponente', 'Selecione seu perfil.'],
      ['Nome da solução ou empresa', 'Informe o nome da solução ou empresa.'],
      ['Área prioritária do PARTEC-JF', 'Selecione a área prioritária do PARTEC-JF.'],
      ['Problema ou oportunidade de mercado', 'Descreva o problema ou a oportunidade de mercado.'],
      ['Descrição da solução', 'Descreva a solução.'],
      ['Estágio de desenvolvimento', 'Selecione o estágio de desenvolvimento.'],
      ['Possui MVP validado?', 'Informe se a solução possui MVP validado.'],
    ];
    for (const [label, message] of expected) {
      const field = page.getByLabel(label);
      await expect(field).toHaveAttribute('aria-invalid', 'true');
      await expect(field).toHaveAccessibleDescription(new RegExp(message.replace(/[.?()]/g, '\\$&')));
    }
    await expect(page.getByRole('checkbox', { name: /LGPD/ })).toHaveAccessibleDescription(/Autorize o tratamento dos dados pessoais/);
    await expect(page.getByRole('checkbox', { name: /Declaro/ })).toHaveAccessibleDescription(/Confirme a declaração de veracidade/);
    await expect(page.getByLabel('Nome completo')).toBeFocused();
    await capture(page, info, '03-cadastro-vazio');

    // A mensagem some quando o campo é corrigido, e o texto digitado é mantido.
    await page.getByLabel('Nome completo').fill('Maria da Silva');
    await expect(page.getByLabel('Nome completo')).not.toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Nome completo')).toHaveValue('Maria da Silva');
    expect(await projectCount()).toBe(before);
  });

  test('MVP "Sim" sem link é bloqueado com a exigência do edital', async ({ page }) => {
    const before = await projectCount();
    await page.goto('/cadastro');
    await fillValidForm(page, `MVP sem link ${Date.now()}`);
    await page.getByLabel('Possui MVP validado?').selectOption({ label: 'Sim' });
    await page.getByRole('button', { name: 'Enviar projeto' }).click();
    const link = page.getByLabel('Link de comprovação do MVP');
    await expect(link).toHaveAccessibleDescription(/O edital exige o link de comprovação/);
    await expect(link).toBeFocused();
    await expect(page.getByRole('status')).toHaveCount(0);
    expect(await projectCount()).toBe(before);
  });

  test('contador visível e envio bloqueado acima do limite', async ({ page }, info) => {
    const before = await projectCount();
    await page.goto('/cadastro');
    await fillValidForm(page, `Texto longo ${Date.now()}`);
    const description = page.getByLabel('Descrição da solução');
    await expect(description).toHaveAccessibleDescription(/72 de 1\.000 caracteres/);
    await description.fill('A'.repeat(1001));
    await expect(description).toHaveAccessibleDescription(/1\.001 de 1\.000 caracteres/);
    await expect(page.getByText('1.001 de 1.000 caracteres')).toBeVisible();
    await page.getByRole('button', { name: 'Enviar projeto' }).click();
    await expect(description).toHaveAccessibleDescription(/A descrição deve ter entre 30 e 1\.000 caracteres\./);
    await expect(description).toHaveValue('A'.repeat(1001));
    await capture(page, info, '04-cadastro-limite');
    expect(await projectCount()).toBe(before);

    // Corrigido o texto, o mesmo formulário é enviado.
    await description.fill('A'.repeat(1000));
    await page.getByRole('button', { name: 'Enviar projeto' }).click();
    await expect(page.getByRole('status')).toContainText('Projeto enviado com sucesso');
    expect(await projectCount()).toBe(before + 1);
  });
});
