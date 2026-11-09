---
description: "Tarefas de implementação das funcionalidades F01 a F04"
---

# Tarefas: miniapp Fomentu (F01–F04)

**Entrada**: especificações e planos em `specs/002-cadastrar-projeto/`, `specs/003-consultar-projetos/`,
`specs/004-avaliar-com-ia/` e `specs/005-avaliar-como-humano/`; ADRs 001 a 006 em `docs/adr/`.

**Organização**: três tarefas por funcionalidade, 12 no total. Cada tarefa é uma fatia completa:
**testes → implementação → verificação**. Os subitens (T001–T092) guardam o detalhe com caminhos
de arquivo.

**Atualização da base (2026-11-09)**: a main passou a organizar o frontend por área (`src/public/`,
`src/admin/`, `src/auth/`; ADR 003), adotou o Mantine (ADR 004) e mudou o grupo do site para um nome
(`VITE_GROUP_ID=01` → `group-01`). O ADR de falhas da IA foi renumerado para 006. A F01 foi movida para
`src/public/submission/`. Os caminhos `src/features/...` das F02 a F04 ainda precisam ser revistos para
a área `src/admin/` antes da implementação.

**Testes primeiro** (ADR 002): dentro de cada tarefa, escrever os testes, executá-los e confirmar
que falham pelo motivo esperado antes de implementar. Alterar um teste revisado só com revisão do
grupo.

## Formato

- **Tarefa** (`F01.1` etc.): marque `[x]` somente quando todos os subitens estiverem concluídos e o
  critério "Pronta quando" tiver sido verificado (constituição e `AGENTS.md`).
- **Subitem** (`T001` etc.): `[P]` indica que pode ser feito em paralelo (arquivo diferente e sem
  dependência pendente); a história da spec aparece entre colchetes, por exemplo `[F01-US1]`.

## Ordem de dependência

```text
F01.1 → F01.2 → F01.3
          ├─► F03.1 (funções puras; pode começar logo depois da F01.2)
          └─► F02.1 → F02.2 → F02.3
                        ├─► F03.2 → F03.3
                        └─► F04.1 → F04.2 → F04.3 (inclui o fechamento)
```

- `firestore.rules` e `tests/rules.test.ts` são alterados em F01.1, F03.2, F04.1 e F04.3, sempre em
  sequência, nunca em paralelo.
- `ProjectDetailPage.tsx` recebe a F03 (F03.2) e a F04 (F04.1); faça uma integração de cada vez.
- A F04.1 usa `AiAnalysisView`, criado na F03.2.

---

## F01 — Cadastrar projeto (`specs/002-cadastrar-projeto/`)

### [x] F01.1 — Regras do envio público

**Objetivo**: preparar o ambiente e reestruturar as Security Rules para permitir só a criação
pública validada (F01-US3, ADR 005).
**Pronta quando**: `yarn test:firebase` verde e `tests/e2e/login.spec.ts` continua passando.

Preparação:

- [x] T001 Criar a referência local `git branch base-oficina` antes de qualquer alteração, conforme `docs/revisao-de-codigo.md`
- [x] T002 [P] Adicionar `VITE_GROUP_ID=` com comentário em PT-BR em `.env.example`
- [x] T003 [P] Incluir `VITE_GROUP_ID=01` (nome do grupo; antes da main de 2026-11-09, `group-01`) nos scripts `test:e2e:emulador` e `test:e2e:emulador:visual` de `package.json`
- [x] T004 Verificar se `node admin/manage.js seed-group demo-fomentu group-01` funciona com `FIRESTORE_EMULATOR_HOST` definido e sem credenciais; registrar o resultado em `specs/003-consultar-projetos/research.md`
- [x] T005 Estender `admin/emulator-test-setup.js` para criar `grupo-02@fomentu.com` (claim `group-02`) e `grupo-03@fomentu.com` (claim `group-03`, sem projetos) e os exemplos do seed em `group-01` e `group-02`, usando o seed do admin ou criação direta, conforme T004

Testes:

- [x] T014 [F01-US3] Ajustar o teste existente de isolamento para documentos válidos (projetos e avaliações preparados com `withSecurityRulesDisabled`), mantendo as mesmas verificações entre grupos, em `tests/rules.test.ts`; citar o ADR 005 no commit
- [x] T015 [F01-US3] Testar que um cliente não autenticado cria projeto válido em `group-01` e não lê, lista, altera ou exclui projetos em `tests/rules.test.ts`
- [x] T016 [F01-US3] Testar a negação de criações inválidas (chave extra ou faltando, tipo errado, texto curto ou longo, enum inválido, `mvpStatus: 'yes'` sem link, link sem `http(s)`, e-mail com maiúsculas, `createdBy` diferente, datas do cliente) em `tests/rules.test.ts`
- [x] T017 [F01-US3] Testar que a escrita pública em `evaluations` e `diagnostics` é negada, que membros não alteram nem excluem projetos e que o diagnóstico continua funcionando para membros em `tests/rules.test.ts`

Implementação:

- [x] T018 [F01-US3] Substituir o curinga por `isMember()`, leitura do documento do grupo e regra de `diagnostics` em `firestore.rules`, mantendo os trechos verificados por `tests/smoke.test.ts`
- [x] T019 [F01-US3] Adicionar `projects` (leitura por membros, sem alteração ou exclusão) e `evaluations` (leitura por membros, escrita negada até a F03 e a F04) em `firestore.rules`
- [x] T020 [F01-US3] Implementar `validPublicProject()` conforme `specs/002-cadastrar-projeto/contracts/firestore-rules-projects.md` em `firestore.rules`

### [x] F01.2 — Formulário e envio

**Objetivo**: o proponente envia uma ideia sem login para o grupo do site (F01-US1).
**Pronta quando**: um projeto criado sem login aparece em `groups/group-01/projects` e T006 e T021–T023 estão verdes.

Testes:

- [x] T006 [P] Testar rótulos PT-BR de todas as opções, "Não informado" para ausente, valor desconhecido exibido como recebido, data no formato brasileiro (America/Sao_Paulo) e "Data não informada" em `tests/unit/format.test.ts`
- [x] T021 [P] [F01-US1] Testar `toProjectDoc` (trim, e-mail em minúsculas, `mvpLink` omitido quando vazio, `title`/`description`, `createdBy: 'public-form'`) em `tests/unit/project-form.test.ts`
- [x] T022 [P] [F01-US1] Testar `publicGroupId` com valor válido, vazio e inválido em `tests/unit/public-group.test.ts` — substituído pelo `tests/group.test.ts` da main, que testa `groupIdFromName` no novo formato de nome do grupo
- [x] T023 [P] [F01-US1] Testar no navegador: envio válido sem login → mensagem de sucesso e formulário limpo; botão indisponível durante o envio; projeto presente em `groups/group-01/projects` (consulta REST ao emulador com `Authorization: Bearer owner`), em `tests/e2e/submission.spec.ts`

Implementação:

- [x] T009 [P] Criar mapas de valores e rótulos de perfil, área PARTEC-JF, estágio e MVP em `src/shared/options.ts` (data-model da F01)
- [x] T010 [P] Criar `formatDate`, `labelOrMissing` e constantes de texto em `src/shared/format.ts`
- [x] T024 [F01-US1] Extrair a expressão regular do grupo e criar `publicGroupId()` (lê `VITE_GROUP_ID`) em `src/lib/firebase.ts` — a main passou a fornecer `publicGroupId()` com `src/lib/group.ts`, e a F01 usa essa versão
- [x] T025 [F01-US1] Criar tipos do formulário e `toProjectDoc` em `src/public/submission/projectForm.ts`
- [x] T026 [F01-US1] Criar `submitProject` com `addDoc` e `serverTimestamp()` em `createdAt` e `consentAt` em `src/public/submission/submitProject.ts`
- [x] T027 [F01-US1] Criar o formulário com os 12 campos, estados de envio, sucesso, erro genérico (mantendo os dados) e site sem grupo em `src/public/submission/SubmissionPage.tsx`
- [x] T028 [F01-US1] Renderizar `SubmissionPage` em `/cadastro` e remover o texto provisório em `src/main.tsx`

### [x] F01.3 — Validação e mensagens

**Objetivo**: o proponente corrige dados inválidos antes do envio (F01-US2).
**Pronta quando**: `yarn lint && yarn typecheck && yarn test:firebase && yarn test:e2e:emulador` verdes e o caso de borda manual "site sem `VITE_GROUP_ID`" verificado (`specs/002-cadastrar-projeto/quickstart.md`).

Testes:

- [x] T029 [P] [F01-US2] Testar `validateProjectForm` (obrigatórios, mínimos e máximos, e-mail, URL, MVP "Sim" sem link, aceites, campo só com espaços) e as mensagens em PT-BR em `tests/unit/project-form.test.ts`
- [x] T030 [P] [F01-US2] Testar no navegador: envio vazio mostra mensagem em cada campo e não grava; MVP "Sim" sem link bloqueado; contador visível e envio bloqueado acima do limite, em `tests/e2e/submission.spec.ts`

Implementação:

- [x] T031 [F01-US2] Implementar `validateProjectForm` em `src/public/submission/projectForm.ts`
- [x] T032 [P] [F01-US2] Criar o contador de caracteres reutilizável em `src/shared/CharCounter.tsx`
- [x] T033 [F01-US2] Exibir as mensagens por campo (`aria-describedby`), os contadores e o bloqueio de envio em `src/public/submission/SubmissionPage.tsx`

**Verificação (2026-11-09)**: lint, typecheck, `yarn test` com o emulador do Firestore (60 testes) e os testes de navegador com os emuladores (6) passaram. Caso de borda manual conferido no navegador: com `VITE_GROUP_ID` vazio e com valor inválido (`joao`), `/cadastro` mostra a mensagem de site não configurado e não exibe o formulário. No Windows, os scripts `test:firebase` e `test:e2e:emulador*` falham por causa das aspas simples; os testes foram executados com o comando equivalente usando aspas duplas.

---

## F02 — Consultar projetos (`specs/003-consultar-projetos/`)

### [ ] F02.1 — Lista do grupo

**Objetivo**: o avaliador vê os projetos do grupo com os selos de avaliação (F02-US1).
**Pronta quando**: a lista aparece em ordem decrescente, sem projetos do `group-02`, com estado
vazio para o `grupo03`, e o `tests/e2e/login.spec.ts` continua passando.

Testes:

- [ ] T007 [P] Testar `classifyEvaluation` (`ai`+`live` → `ai`; `ai`+`mock` ou sem modo → `ai-mock`; `human`; origem desconhecida → `unknown`) e a contagem por tipo em `tests/unit/evaluations.test.ts`
- [ ] T008 [P] Testar `parseRoute` para `/`, `/cadastro`, `/admin`, `/admin/projetos`, `/admin/projetos/{id}`, barra final e rota desconhecida em `tests/unit/route.test.ts`
- [ ] T034 [P] [F02-US1] Testar no navegador: login no `group-01` → lista em ordem decrescente de data, contagem, nome, proponente, área, estágio, MVP, data e selos; nenhum projeto do `group-02`; `grupo03` vê o estado vazio com link para o cadastro, em `tests/e2e/projects.spec.ts`

Implementação:

- [ ] T011 [P] Criar `classifyEvaluation` e `summarizeEvaluations` em `src/shared/evaluations.ts` (data-model da F02)
- [ ] T012 [P] Criar `parseRoute` em `src/shared/route.ts`
- [ ] T013 Usar `parseRoute` em `src/main.tsx` sem mudar o comportamento atual de páginas, login e diagnóstico
- [ ] T035 [F02-US1] Criar `loadProjects` (consulta ordenada por `createdAt` e avaliações de cada projeto em paralelo, com resumo) em `src/features/projects/loadProjects.ts`
- [ ] T036 [F02-US1] Criar a lista com estados de carregamento, erro com nova tentativa e vazio em `src/features/projects/ProjectListPage.tsx`
- [ ] T037 [F02-US1] Roteá-la em `/admin/projetos` no `src/main.tsx`

### [ ] F02.2 — Detalhe do projeto

**Objetivo**: o avaliador lê todos os dados do projeto e o resumo das avaliações por tipo (F02-US2).
**Pronta quando**: o detalhe de um projeto criado pelo cadastro confere com os dados enviados, e os
casos do seed e de projeto não encontrado passam.

Testes:

- [ ] T038 [F02-US2] Testar no navegador: detalhe de um projeto criado pelo cadastro com todos os campos e datas; link do MVP com `target="_blank"` e `rel="noopener noreferrer"`; projeto do seed com "Exemplo" e "Não informado"; seções por tipo de avaliação e seções vazias; `/admin/projetos/nao-existe` e um ID do `group-02` mostram "Projeto não encontrado", em `tests/e2e/projects.spec.ts`

Implementação:

- [ ] T039 [F02-US2] Criar `loadProjectDetail` (não encontrado para ausente ou negado) em `src/features/projects/loadProjects.ts`
- [ ] T040 [F02-US2] Exibir os campos, o link do MVP e a etiqueta "Exemplo" em `src/features/projects/ProjectDetailPage.tsx`
- [ ] T041 [F02-US2] Exibir as seções "Análise de IA", "Análise de IA simulada", "Parecer humano" e origem não identificada, ordenadas, com espaço para F03 e F04, em `src/features/projects/ProjectDetailPage.tsx`
- [ ] T042 [F02-US2] Rotear `/admin/projetos/{id}` com título e breadcrumb em `src/main.tsx`

### [ ] F02.3 — Filtros e menu

**Objetivo**: o avaliador combina filtros para a triagem (F02-US3).
**Pronta quando**: `yarn test && yarn test:e2e:emulador` verdes e o caso de borda manual "falha de
carregamento com o emulador desligado mostra erro e Tentar novamente" verificado.

Testes:

- [ ] T043 [P] [F02-US3] Testar leitura e escrita da query string, valores desconhecidos ignorados, filtros isolados e combinados, "Não informado" e as quatro opções de situação de avaliação em `tests/unit/project-filters.test.ts`
- [ ] T044 [F02-US3] Testar no navegador: filtro de área → detalhe → voltar mantém o filtro; filtros sem resultado → mensagem e "Limpar filtros"; menu "Avaliação com IA" abre a lista com `?avaliacao=sem-ia`, em `tests/e2e/projects.spec.ts`

Implementação:

- [ ] T045 [F02-US3] Criar `readFilters`, `writeFilters` e `applyFilters` em `src/features/projects/projectFilters.ts`
- [ ] T046 [F02-US3] Adicionar os controles de filtro sincronizados com a URL (`history.replaceState`), a contagem e "Limpar filtros" em `src/features/projects/ProjectListPage.tsx`
- [ ] T047 [F02-US3] Apontar os itens de menu "Avaliação com IA" e "Parecer humano" para a lista filtrada e ajustar os títulos em `src/main.tsx`

---

## F03 — Avaliar com IA (`specs/004-avaliar-com-ia/`)

### [ ] F03.1 — Pedido e resposta da IA

**Objetivo**: funções puras para montar o pedido, validar a resposta e classificar falhas (F03-US1 e
F03-US2, ADR 006), sem tela.
**Pronta quando**: `tests/unit/ai-*.test.ts` verdes. Pode começar logo depois da F01.2.

Testes:

- [ ] T048 [P] [F03-US1] Testar `buildPrompt`: todos os campos, "Não informado" nos ausentes, sem nome e e-mail do proponente, delimitadores, remoção dos delimitadores do texto do proponente, rejeição acima de 4.000 caracteres e `PROMPT_VERSION`, em `tests/unit/ai-prompt.test.ts`
- [ ] T049 [P] [F03-US1] Testar `parseAnalysis`: JSON válido, um único bloco ```` ```json ````, texto extra, chave faltando ou extra, tipo errado, listas vazias ou com mais de 5 itens e item longo, em `tests/unit/ai-parse.test.ts`
- [ ] T061 [P] [F03-US2] Testar `classifyAiError` para cada linha da tabela do ADR 006 (mensagem, nova tentativa permitida ou não, aviso de cota) em `tests/unit/ai-errors.test.ts`

Implementação:

- [ ] T054 [P] [F03-US1] Criar `PROMPT_VERSION` e `buildPrompt` em `src/features/ai-analysis/prompt.ts`
- [ ] T055 [P] [F03-US1] Criar `parseAnalysis` em `src/features/ai-analysis/parseAnalysis.ts`
- [ ] T056 [P] [F03-US1] Configurar `generateText` com `{ timeout: 35_000 }` em `src/lib/firebase.ts`
- [ ] T065 [P] [F03-US2] Criar `classifyAiError` em `src/features/ai-analysis/aiErrors.ts`

### [ ] F03.2 — Gerar e salvar análise

**Objetivo**: o avaliador gera uma prévia, revisa e salva a análise no projeto (F03-US1).
**Pronta quando**: a análise salva aparece no detalhe com o selo correto ("Análise de IA" ou "simulada"),
e as regras de IA passam em `yarn test:firebase`.

Testes:

- [ ] T050 [F03-US1] Testar as regras: membro cria análise de IA válida; `createdByUid` de outro, `source` ou `mode` inválidos e chave extra são negados; alterar ou excluir é negado; não membro é negado, em `tests/rules.test.ts`
- [ ] T051 [P] [F03-US1] Criar o auxiliar de interceptação de `**/generateText` (sucesso e erro no protocolo de funções chamáveis) em `tests/e2e/support/ai-route.ts`
- [ ] T052 [F03-US1] Testar no navegador: resposta real válida → prévia com resumo, cinco critérios, selo "Análise de IA", modelo e aviso fixo → salvar → topo do histórico; descartar não grava; resposta `mock` aparece como texto simples com selo "simulada" e pode ser salva, em `tests/e2e/ai-analysis.spec.ts`

Implementação:

- [ ] T053 [F03-US1] Implementar `sameAuthor()` e `validAiEvaluation()` e liberar a criação de análises em `firestore.rules`
- [ ] T057 [F03-US1] Criar `saveAnalysis` (`content`, `analysis`, `mode`, `model`, `promptVersion` e autor) em `src/features/ai-analysis/saveAnalysis.ts`
- [ ] T058 [F03-US1] Criar a exibição de uma análise (critérios ou texto simples, selo, modelo, aviso fixo) em `src/features/ai-analysis/AiAnalysisView.tsx`
- [ ] T059 [F03-US1] Criar a seção com "Gerar análise de IA", carregamento, prévia, "Salvar análise" e "Descartar" em `src/features/ai-analysis/AiAnalysisSection.tsx`
- [ ] T060 [F03-US1] Integrar `AiAnalysisSection` em `src/features/projects/ProjectDetailPage.tsx`

### [ ] F03.3 — Falhas, demora e histórico

**Objetivo**: tratar falhas e demora conforme o ADR 006 e consultar as análises salvas (F03-US2 e F03-US3).
**Pronta quando**: `yarn test:firebase && yarn test:e2e:emulador` verdes, verificação manual no modo
simulado feita (`specs/004-avaliar-com-ia/quickstart.md`) e verificação real registrada ou marcada
como pendente.

Testes:

- [ ] T062 [F03-US2] Testar no navegador: `RESOURCE_EXHAUSTED` e `FAILED_PRECONDITION` sem "Tentar novamente"; `UNAVAILABLE` com nova tentativa manual e sem repetição automática; resposta real fora do formato sem salvar, em `tests/e2e/ai-analysis.spec.ts`
- [ ] T063 [F03-US2] Testar com `page.clock`: aviso "Isso pode levar até 30 segundos" aos 10 s e tempo esgotado aos 35 s, em `tests/e2e/ai-analysis.spec.ts`
- [ ] T064 [F03-US2] Testar a confirmação ao gerar quando já existe análise com a mesma `promptVersion` e o aviso de saída com prévia pendente, em `tests/e2e/ai-analysis.spec.ts`
- [ ] T068 [F03-US3] Testar no navegador: histórico do mais recente ao mais antigo com conteúdo completo, modo, modelo, data e e-mail; análise do seed como texto simples, "simulada" e "Exemplo"; nova análise não altera as anteriores, em `tests/e2e/ai-analysis.spec.ts`

Implementação:

- [ ] T066 [F03-US2] Exibir erros, "Tentar novamente" só para falhas temporárias, aviso aos 10 s e descarte de resposta tardia em `src/features/ai-analysis/AiAnalysisSection.tsx`
- [ ] T067 [F03-US2] Adicionar a confirmação antes de gerar, o bloqueio de gerações simultâneas e o `beforeunload` com prévia pendente em `src/features/ai-analysis/AiAnalysisSection.tsx`
- [ ] T069 [F03-US3] Exibir o histórico com `AiAnalysisView`, separado dos pareceres, em `src/features/ai-analysis/AiAnalysisSection.tsx`
- [ ] T070 [F03] Registrar a verificação com o provedor real (3 análises, SC-004) em `specs/004-avaliar-com-ia/quickstart.md` ou deixá-la marcada como **pendente** enquanto a integração real não existir

---

## F04 — Avaliar como humano (`specs/005-avaliar-como-humano/`)

### [ ] F04.1 — Registrar parecer

**Objetivo**: o avaliador registra um parecer com síntese e comentários por critério (F04-US1).
**Pronta quando**: o parecer aparece no detalhe e no selo da lista, e as regras de criação passam.

Testes:

- [ ] T071 [P] [F04-US1] Testar `toReviewDoc` (trim, critérios vazios omitidos, síntese em `content`) em `tests/unit/review-form.test.ts`
- [ ] T072 [F04-US1] Testar as regras: parecer válido aceito; `createdByUid` de outro, chave extra, síntese curta, critério com chave inválida ou acima de 1.000 caracteres e `source` inválida são negados, em `tests/rules.test.ts`
- [ ] T073 [F04-US1] Testar no navegador: registrar parecer em projeto criado pelo cadastro → confirmação e parecer no topo; sem duplicação com clique repetido; dados do projeto e análises de IA visíveis só para leitura; selo "Parecer humano" na lista, em `tests/e2e/human-review.spec.ts`

Implementação:

- [ ] T074 [F04-US1] Implementar `validHumanFields()` e `validHumanEvaluation()` em `firestore.rules`
- [ ] T075 [F04-US1] Criar tipos e `toReviewDoc` em `src/features/human-review/reviewForm.ts`
- [ ] T076 [F04-US1] Criar `createReview` com `addDoc` em `src/features/human-review/saveReview.ts`
- [ ] T077 [F04-US1] Criar a seção com o formulário (nome, síntese e cinco critérios com orientações) e a consulta das análises por `AiAnalysisView` em `src/features/human-review/HumanReviewSection.tsx`
- [ ] T078 [F04-US1] Integrar `HumanReviewSection` em `src/features/projects/ProjectDetailPage.tsx`

### [ ] F04.2 — Validação do parecer

**Objetivo**: o avaliador corrige dados inválidos sem perder o texto (F04-US2).
**Pronta quando**: as mensagens em PT-BR, os contadores e a preservação do texto após falha passam
nos testes.

Testes:

- [ ] T079 [P] [F04-US2] Testar `validateReview` (nome e síntese obrigatórios, mínimos e máximos, critérios até 1.000, campo só com espaços) em `tests/unit/review-form.test.ts`
- [ ] T080 [F04-US2] Testar no navegador: mensagens em PT-BR, contador, bloqueio de salvamento e texto mantido após falha, em `tests/e2e/human-review.spec.ts`

Implementação:

- [ ] T081 [F04-US2] Implementar `validateReview` em `src/features/human-review/reviewForm.ts`
- [ ] T082 [F04-US2] Exibir as mensagens, os contadores (`CharCounter`) e o erro de gravação com nova tentativa em `src/features/human-review/HumanReviewSection.tsx`

### [ ] F04.3 — Edição pelo autor e fechamento

**Objetivo**: consultar e editar pareceres com autoria garantida (F04-US3) e fechar o conjunto com o
fluxo completo, as verificações e o registro de pendências.
**Pronta quando**: o bloco de verificações do `README.md` está verde, os casos manuais foram
registrados, a revisão de código foi feita e as pendências reais foram anotadas.

Testes:

- [ ] T083 [F04-US3] Testar as regras com `user-a` e `user-b` no `group-01`: o autor edita os campos permitidos com `updatedAt == request.time`; outro usuário é negado; alterar `createdByUid`, `createdAt` ou `source` é negado; exclusão é negada; parecer do seed não é editável, em `tests/rules.test.ts`
- [ ] T084 [F04-US3] Testar no navegador: pareceres em ordem decrescente; editar → "Editado em"; parecer do seed com "Exemplo" e sem "Editar"; projeto sem pareceres mostra estado vazio, em `tests/e2e/human-review.spec.ts`
- [ ] T088 Testar o fluxo completo no navegador: cadastro público → login → lista → detalhe → análise de IA interceptada e salva → parecer → selos na lista, em `tests/e2e/full-flow.spec.ts`

Implementação:

- [ ] T085 [F04-US3] Implementar `canEditOwnHumanEvaluation()` e manter `delete: false` em `firestore.rules`
- [ ] T086 [F04-US3] Criar `updateReview` com `updateDoc` (só os campos permitidos e `updatedAt`) em `src/features/human-review/saveReview.ts`
- [ ] T087 [F04-US3] Exibir a lista de pareceres, "Editar" só para o autor, "Editado em" e o `beforeunload` com texto não salvo em `src/features/human-review/HumanReviewSection.tsx`

Fechamento:

- [ ] T089 Executar o bloco de verificações do `README.md` (`yarn lint`, `yarn typecheck`, `yarn test:firebase`, `yarn test:e2e:emulador:visual`, `yarn build`) e corrigir as falhas
- [ ] T090 Executar um caso de borda manual por funcionalidade (quickstarts) e registrar o resultado
- [ ] T091 Revisar o código com `docs/revisao-de-codigo.md`, comparando com `base-oficina`
- [ ] T092 Registrar as pendências reais (integração de IA, publicação das regras pelo instrutor, riscos aceitos do ADR 005) em `specs/tasks.md`

---

## Oportunidades de paralelismo

- F03.1 é independente da tela e pode ser feita por outra pessoa enquanto a F02 avança.
- Dentro de cada tarefa, os subitens `[P]` (testes unitários, funções puras, `options.ts` e `format.ts`) podem ser feitos ao mesmo tempo.
- F03.2 e F04.1 alteram `firestore.rules`, `tests/rules.test.ts` e `ProjectDetailPage.tsx`; não as faça em paralelo.
