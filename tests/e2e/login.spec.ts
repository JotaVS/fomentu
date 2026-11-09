import { test, expect, type Page, type TestInfo } from '@playwright/test';
import { execFileSync } from 'node:child_process';

async function capture(page: Page, info: TestInfo, name: string) {
  await info.attach(name, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
}

test('exibe a entrada pública e o formulário administrativo', async ({ page }, info) => {
  await page.goto('/cadastro');
  await expect(page.getByRole('heading', { name: 'Sua ideia começa aqui.' })).toBeVisible();
  await capture(page, info, '01-cadastro-publico');
  await page.getByRole('link', { name: 'Área administrativa' }).click();
  await expect(page.getByLabel('E-mail')).toBeVisible();
  await expect(page.getByLabel('Senha')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Entrar' })).toBeVisible();
  await capture(page, info, '02-login');
});

test('entra no grupo e verifica o banco no emulador', async ({ page }, info) => {
  test.skip(process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099', 'Execute yarn test:e2e:emulador.');
  execFileSync('node', ['admin/emulator-test-setup.js'], { stdio: 'pipe', env: process.env });
  await page.goto('/admin');
  await page.getByLabel('E-mail').fill('grupo-01@fomentu.com');
  await page.getByLabel('Senha').fill('grupo-01');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Olá, grupo 01/ })).toBeVisible();
  await capture(page, info, '03-painel');
  await page.getByRole('button', { name: 'Verificar conexão' }).click();
  await expect(page.getByRole('status')).toContainText('Conexão confirmada');
  await capture(page, info, '04-conexao');
});

test('cria e acessa um grupo com nome livre', async ({ page }) => {
  test.skip(process.env.FIREBASE_AUTH_EMULATOR_HOST !== '127.0.0.1:9099', 'Execute yarn test:e2e:emulador.');
  execFileSync('node', ['admin/manage.js', 'create', 'demo-fomentu', 'ninja'], { stdio: 'pipe', env: process.env });
  await page.goto('/admin');
  await page.getByLabel('E-mail').fill('grupo-ninja@fomentu.com');
  await page.getByLabel('Senha').fill('grupo-ninja');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Olá, grupo ninja' })).toBeVisible();
  await page.getByRole('button', { name: 'Verificar conexão' }).click();
  await expect(page.getByRole('status')).toContainText('Conexão confirmada');
});
