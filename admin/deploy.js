import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { groupFromArgument } from './group-id.js';

const group = groupFromArgument(process.argv[2]);
if (process.argv.length !== 3) throw new Error('Informe apenas o nome do grupo.');
const name = group.slice(6);
const project = 'fomentu-15f33';
const site = `${project}-g${name}`;
const directory = mkdtempSync(path.join(tmpdir(), 'fomentu-deploy-'));
try {
  execFileSync('yarn', ['build'], { stdio: 'inherit', env: { ...process.env, VITE_GROUP_ID: name } });
  const config = { hosting: { site, public: path.resolve('dist'), ignore: ['firebase.json', '**/.*', '**/node_modules/**'], rewrites: [{ source: '**', destination: '/index.html' }] } };
  const configPath = path.join(directory, 'firebase.json');
  writeFileSync(configPath, JSON.stringify(config));
  execFileSync('firebase', ['deploy', '--only', 'hosting', '--project', project, '--config', configPath], { stdio: 'inherit' });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
