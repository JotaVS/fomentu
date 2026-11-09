import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const directoryPath = path.dirname(fileURLToPath(import.meta.url));

let directory;
try {
  const env = { ...process.env };
  if (!env.GOOGLE_APPLICATION_CREDENTIALS && !env.FIRESTORE_EMULATOR_HOST) {
    const cliRoot = path.join(directoryPath, '../node_modules/firebase-tools');
    const cliAuth = require(path.join(cliRoot, 'lib/auth.js'));
    const cliApi = require(path.join(cliRoot, 'lib/api.js'));
    const account = cliAuth.getGlobalDefaultAccount();
    if (!account?.tokens?.refresh_token) throw new Error('Entre no Firebase CLI com firebase login.');
    directory = mkdtempSync(path.join(tmpdir(), 'fomentu-admin-'));
    const credentialsPath = path.join(directory, 'credentials.json');
    writeFileSync(credentialsPath, JSON.stringify({ type: 'authorized_user', client_id: cliApi.clientId(), client_secret: cliApi.clientSecret(), refresh_token: account.tokens.refresh_token }), { mode: 0o600 });
    env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
  }
  const result = spawnSync(process.execPath, [path.join(directoryPath, 'manage.js'), ...process.argv.slice(2)], { stdio: 'inherit', env });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} catch (error) {
  console.error(`Não foi possível executar o comando: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (directory) rmSync(directory, { recursive: true, force: true });
}
