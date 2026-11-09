# Plano de implementação: Consultar projetos (F02)

**Branch**: `003-consultar-projetos` | **Data**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Entrada**: especificação em `specs/003-consultar-projetos/spec.md`.

## Resumo

Substituir os painéis vazios de `/admin/projetos` por uma lista dos projetos do grupo, com filtros
na URL. Criar a rota de detalhe `/admin/projetos/{projectId}`, que exibe os dados do projeto e as
seções de avaliação. É nesse detalhe que as F03 e F04 se encaixam. Os dados são lidos com os
helpers existentes (`projectsRef`, `evaluationsRef`) e nenhuma regra nova é necessária além da
reestruturação feita na F01.

## Contexto técnico

**Linguagem/versão**: TypeScript 5.8 e React 19, com Vite 6.

**Dependências principais**: `firebase` 11.10. Nenhuma dependência nova; o roteamento continua
manual, por `window.location`.

**Armazenamento**: leitura de `groups/{groupId}/projects` e da subcoleção `evaluations` de cada
projeto. Modelo em [../002-cadastrar-projeto/data-model.md](../002-cadastrar-projeto/data-model.md)
e [../005-avaliar-como-humano/data-model.md](../005-avaliar-como-humano/data-model.md).

**Testes**: Vitest para filtros, classificação de avaliações e formatação; Playwright com
emuladores.

**Plataforma alvo**: navegador, área autenticada.

**Tipo de projeto**: aplicação web de página única.

**Metas de desempenho**: lista com cerca de 20 projetos carregada em poucos segundos (SC-001).

**Restrições**: somente leitura; sem nota nem ranking; textos exibidos como texto simples (o React
já escapa HTML; não usar `dangerouslySetInnerHTML`).

**Escala/escopo**: duas telas (lista e detalhe), sem paginação.

## Verificação da constituição

| Princípio | Situação |
| --- | --- |
| I. Escopo pequeno | ✅ Lista e detalhe; sem ranking, notas ou etapas. |
| II. Persistência | ✅ Lê o Firestore; humano e IA aparecem separados. |
| III. IA identificável | ✅ Selos "IA", "IA simulada" e "Parecer humano"; IA sem modo é tratada como simulada. |
| IV. Isolamento | ✅ Usa `groupFor` e os helpers do grupo; teste com dois grupos. |
| V. Simplicidade | ✅ Sem roteador nem cache novo; estados de carregamento, erro e vazio tratados. |

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/003-consultar-projetos/
├── spec.md
├── plan.md
├── research.md
├── data-model.md        # tipos derivados (filtros e resumo de avaliações)
├── quickstart.md
└── (tarefas em ../tasks.md, único para F01–F04)
```

### Código-fonte

```text
src/
├── main.tsx                          # roteia /admin/projetos e /admin/projetos/{id}; ajusta o menu
├── shared/
│   ├── options.ts                    # (F01) rótulos das opções
│   ├── evaluations.ts                # classifyEvaluation(): 'ai' | 'ai-mock' | 'human' | 'unknown'; contagem por tipo
│   └── format.ts                     # data pt-BR (America/Sao_Paulo), "Não informado"
└── features/projects/
    ├── projectFilters.ts             # ler/gravar filtros na query string e aplicar filtros (puro)
    ├── loadProjects.ts               # lê projetos e avaliações de cada projeto em paralelo
    ├── ProjectListPage.tsx           # lista, filtros, contagem, estados
    └── ProjectDetailPage.tsx         # campos, link do MVP, seções de avaliação, pontos de entrada F03/F04

admin/emulator-test-setup.js          # cria também usuário do group-02 e exemplos do seed no emulador

tests/
├── unit/project-filters.test.ts
├── unit/evaluations.test.ts
├── unit/format.test.ts
└── e2e/projects.spec.ts
```

**Decisão de estrutura**: ADR 003. As F03 e F04 inserem suas seções no `ProjectDetailPage` com
componentes próprios em `src/features/ai-analysis/` e `src/features/human-review/`.

## Integrações

- **Leitura**: `getDocs(query(projectsRef(group), orderBy('createdAt', 'desc')))`. Uma ordenação
  por um único campo não exige índice composto. A filtragem é feita no cliente, porque o volume é
  pequeno e há o valor "Não informado", que o Firestore não consulta diretamente.
- **Avaliações por projeto**: `Promise.all` de `getDocs(evaluationsRef(group, id))`. Consultas
  `collectionGroup` exigiriam outra regra; foram descartadas (risco registrado na spec).
- **Detalhe**: `getDoc` do projeto mais `getDocs` das avaliações. Se o projeto não existir ou a
  leitura for negada, a tela mostra "Projeto não encontrado".
- **Menu existente**: os itens "Avaliação com IA" e "Parecer humano" passam a apontar para a lista
  com o filtro de situação já aplicado (`?avaliacao=sem-ia` e `?avaliacao=sem-parecer`), em vez de
  telas próprias. Assim, seguem úteis sem criar novas páginas.

## Testes (a partir dos critérios de aceite)

1. **Unitários**: filtros isolados e combinados, "Não informado", valores desconhecidos tratados
   como "Não informado", leitura e escrita da query string; classificação de avaliações (`ai` +
   `live`, `ai` + `mock`, `ai` sem modo como simulada, `human`, origem desconhecida); formatação de
   datas e de campos ausentes.
2. **Navegador** (`tests/e2e/projects.spec.ts`): login no grupo 01 → lista ordenada, sem projetos
   do grupo 02; filtro → detalhe → voltar mantém o filtro; detalhe de projeto do seed com
   "Exemplo" e "Não informado"; URL com ID inexistente → "Projeto não encontrado"; fluxo com
   projeto criado pelo cadastro da F01.

## Riscos

- Leituras de avaliações proporcionais ao número de projetos (aceito para a oficina).
- O `main.tsx` concentra o shell; a extração das páginas deve ser feita por partes, sem mudar o
  comportamento do login e do diagnóstico (o teste `login.spec.ts` deve continuar passando).

## Acompanhamento de complexidade

Nenhuma violação a justificar.
