# Plano de implementação: Cadastrar projeto (F01)

**Branch**: `002-cadastrar-projeto` | **Data**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Entrada**: especificação em `specs/002-cadastrar-projeto/spec.md`.

## Resumo

Transformar a página pública `/cadastro`, hoje apenas informativa, em um formulário com os campos
do núcleo do edital. O envio grava um documento em `groups/{groupId}/projects` pelo Firebase Web
SDK, sem login. O grupo vem da configuração pública do site (`VITE_GROUP_ID`). As Security Rules
passam a permitir a **criação** pública de projetos com validação de chaves, tipos, tamanhos e
opções, e continuam negando qualquer leitura pública.

Esta feature também define o **modelo de Projeto** e a **reestruturação das regras** usados pelas
F02 a F04 (ver [data-model.md](data-model.md) e [contracts/](contracts/)).

## Contexto técnico

**Linguagem/versão**: TypeScript 5.8 e React 19, com Vite 6.

**Dependências principais**: `firebase` 11.10 (Auth, Firestore, Functions). Nenhuma dependência
nova.

**Armazenamento**: Cloud Firestore, em `groups/{groupId}/projects/{projectId}`, com ID automático.

**Testes**: Vitest para funções puras e regras (`@firebase/rules-unit-testing` no emulador) e
Playwright com emuladores de Auth e Firestore.

**Plataforma alvo**: navegador moderno; um site de Hosting por grupo.

**Tipo de projeto**: aplicação web de página única, sem backend próprio.

**Metas de desempenho**: o envio responde em poucos segundos, conforme o SC-001 da spec.

**Restrições**: sem login do proponente e sem leitura pública. O pedido montado na F03 precisa
caber em 4.000 caracteres, por isso os limites de texto da spec são obrigatórios. Interface em
PT-BR e identificadores em inglês.

**Escala/escopo**: uma tela pública e uma regra de criação; dezenas de projetos por grupo.

## Verificação da constituição

| Princípio | Situação |
| --- | --- |
| I. Escopo pequeno | ✅ Só o cadastro público com nome e e-mail; sem etapas, notas ou edital configurável. |
| II. Persistência no Firestore | ✅ Projeto gravado no Firestore com campos definidos pelo grupo. |
| III. IA controlada | — Não se aplica. |
| IV. Isolamento | ✅ Mecanismo próprio de envio (regra só de criação) sem conceder leitura. Risco aceito na spec: o grupo vem de configuração pública. |
| V. Simplicidade e verificação | ✅ Sem novas dependências; testes a partir dos critérios de aceite, incluindo projeto criado pelo app. |

Revisão após o desenho: sem violações. A reestruturação das regras é exigida pelas specs (F01 e
F04) e está justificada no ADR 005.

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/002-cadastrar-projeto/
├── spec.md
├── plan.md              # este arquivo
├── research.md          # decisões técnicas
├── data-model.md        # modelo de Projeto (compartilhado com F02–F04)
├── quickstart.md        # como verificar
├── contracts/
│   └── firestore-rules-projects.md
└── (tarefas em ../tasks.md, único para F01–F04)
```

### Código-fonte (raiz do repositório)

```text
src/
├── main.tsx                         # shell e roteamento existentes; passa a renderizar a página de cadastro
├── lib/firebase.ts                  # existente; ganha publicGroupId() lendo VITE_GROUP_ID
├── shared/
│   ├── options.ts                   # opções (valor em inglês → rótulo PT-BR) de perfil, área, estágio, MVP
│   └── CharCounter.tsx              # contador de caracteres reutilizado por F01 e F04
└── features/submission/
    ├── projectForm.ts               # normalização (trim, e-mail minúsculo) e validação pura
    ├── submitProject.ts             # monta o documento e chama addDoc
    └── SubmissionPage.tsx           # formulário, estados de envio, sucesso e erro

firestore.rules                      # reestruturado (ver contracts/)
.env.example                         # + VITE_GROUP_ID
package.json                         # scripts de e2e passam VITE_GROUP_ID=group-01

tests/
├── unit/project-form.test.ts        # validação e normalização
├── rules.test.ts                    # existente; ampliado e ajustado
└── e2e/submission.spec.ts           # envio público e verificação na área do grupo
```

**Decisão de estrutura**: seguir o ADR 003, com uma pasta por área em `src/features/` e itens
usados por mais de uma área em `src/shared/`. O `main.tsx` continua sendo o shell e o roteador.

## Integrações

- **Firestore (cliente, sem login)**: `addDoc(projectsRef(groupId), data)` com
  `serverTimestamp()` em `createdAt` e `consentAt`. A criação não exige leitura, então a regra
  continua sem `read` público.
- **Configuração por site**: `VITE_GROUP_ID` é embutido no build. Sem valor válido, a página mostra
  a mensagem de site não configurado (caso de borda da spec). O instrutor publica cada site com o
  valor do grupo correspondente.

## Testes (a partir dos critérios de aceite)

1. **Unitários** (`tests/unit/project-form.test.ts`): campos obrigatórios, limites mínimo e máximo,
   e-mail, URL `http(s)`, MVP "Sim" sem link, aceites, trim e e-mail em minúsculas.
2. **Regras** (`tests/rules.test.ts`): cliente não autenticado cria projeto válido; não lê, não
   lista, não altera e não exclui; criação com chave extra, chave faltando, tipo errado, texto
   longo, opção inválida, `createdBy` diferente ou data do cliente é negada; escrita pública em
   `evaluations` é negada. Os testes de isolamento existentes continuam passando, com o ajuste
   descrito no research.
3. **Navegador** (`tests/e2e/submission.spec.ts`): preencher e enviar sem login → sucesso e
   formulário limpo; validações visíveis; depois, login no grupo 01 e conferência do projeto pela
   lista (depende da F02) ou, antes dela, conferência pelo teste de regras.

## Riscos

- Mudança nas regras compartilhadas, com publicação pelo instrutor (ADR 005).
- Ajuste no teste de isolamento existente, que hoje grava `{ value: 1 }` em projetos e avaliações e
  passará a ser negado pelas novas validações (ver research).

## Acompanhamento de complexidade

Nenhuma violação a justificar.
