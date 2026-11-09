# Pesquisa e decisões técnicas: Cadastrar projeto (F01)

## 1. Organização do plano

- **Decisão**: um plano por feature. A F01 define o modelo de Projeto e a reestruturação das
  regras, e as demais features fazem referência a eles.
- **Motivo**: segue o fluxo do Spec Kit (`/speckit.tasks` por feature) sem duplicar o modelo.
- **Alternativa descartada**: um plano único do conjunto, que foge do fluxo por feature.
- **Origem**: decisão do grupo em 2026-11-09.

## 2. Envio público pelo Web SDK com regra só de criação

- **Decisão**: o envio usa `addDoc` sem autenticação. A regra permite `create` em `projects` apenas
  com dados válidos (contrato em [contracts/firestore-rules-projects.md](contracts/firestore-rules-projects.md)).
- **Motivo**: decisão registrada na spec; não exige backend novo e pode ser testada no emulador.
- **Alternativas descartadas**: função pública (depende de deploy do instrutor) e Anonymous Auth
  (cria contas sem necessidade e exige claim de grupo).

## 3. Reestruturação das Security Rules

- **Decisão**: substituir o curinga `match /groups/{groupId}/{document=**}` com `read, write` por
  regras explícitas para o documento do grupo, `diagnostics`, `projects` e `evaluations`.
- **Motivo**: nas Security Rules, as permissões são combinadas por "OU". Enquanto o curinga
  conceder escrita a qualquer membro, nenhuma restrição mais específica, como a edição só pelo
  autor na F04 ou a proibição de exclusão, teria efeito.
- **Consequência**: o teste existente `limita leitura, listagem e escrita ao próprio grupo`
  grava `{ value: 1 }` em projetos e avaliações. Esse documento passará a ser inválido e a criação
  será negada até para o próprio grupo. O teste precisa usar documentos válidos, mantendo as mesmas
  verificações de isolamento. O ajuste foi aprovado pelo grupo em 2026-11-09, junto com o ADR 005,
  conforme o ADR 002. O motivo deve ser registrado no commit que alterar o teste.
- **Mantido**: o teste `smoke.test.ts` procura `request.auth != null` e
  `request.auth.token.groupId == groupId`; esses trechos continuam na função `isMember`.
- **ADR**: [005 — Regras de segurança do miniapp](../../docs/adr/005-regras-de-seguranca-do-miniapp.md).

## 4. Valores das opções

- **Decisão**: gravar valores estáveis em inglês (por exemplo, `health`, `mvp-validation`) e
  exibir os rótulos em PT-BR por um mapa em `src/shared/options.ts`.
- **Motivo**: a constituição exige identificadores em inglês; valores fixos simplificam as regras
  e os filtros, e os rótulos podem mudar sem migrar dados.

## 5. Datas pelo servidor

- **Decisão**: `createdAt` e `consentAt` usam `serverTimestamp()`, e a regra exige
  `== request.time`.
- **Motivo**: atende ao FR-007 e ao FR-008 sem confiar no relógio do navegador.

## 6. Compatibilidade com o seed

- **Decisão**: o nome da solução é gravado em `title` e a descrição em `description`, como nos
  projetos do seed (FR-009). `createdBy: 'public-form'` diferencia os envios públicos do seed
  (`createdBy: 'seed'`).

## 7. Testes

- **Decisão**: funções puras testadas com Vitest e telas testadas com Playwright, sem Testing
  Library (decisão do grupo em 2026-11-09). A validação fica em `projectForm.ts`, sem React, para
  ser testável.
- **Configuração de e2e**: os scripts `test:e2e:emulador*` passam `VITE_GROUP_ID=group-01`.
