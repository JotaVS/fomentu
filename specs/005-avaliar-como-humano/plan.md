# Plano de implementação: Avaliar como humano (F04)

**Branch**: `005-avaliar-como-humano` | **Data**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Entrada**: especificação em `specs/005-avaliar-como-humano/spec.md`.

## Resumo

Adicionar ao detalhe do projeto (F02) uma seção "Pareceres humanos" com um formulário em linha:
nome do avaliador, síntese e cinco comentários opcionais por critério. O formulário é usado para
registrar e para editar. Ao lado, ficam visíveis os dados do projeto e as análises de IA salvas,
somente para leitura. O parecer é gravado em `evaluations` com `source: 'human'` e a conta autora.
As Security Rules garantem que só a conta autora edite e que ninguém exclua.

## Contexto técnico

**Linguagem/versão**: TypeScript 5.8 e React 19.

**Dependências principais**: `firebase` 11.10. Nenhuma dependência nova.

**Armazenamento**: `groups/{groupId}/projects/{projectId}/evaluations/{id}` com `source: 'human'`
(modelo em [data-model.md](data-model.md)).

**Testes**: Vitest para a validação e as regras (`authenticatedContext` com dois `uid` no mesmo
grupo); Playwright com emuladores.

**Plataforma alvo**: navegador, área autenticada.

**Tipo de projeto**: aplicação web de página única.

**Metas de desempenho**: registrar um parecer em até 5 minutos (SC-001).

**Restrições**: sem nota, conclusão ou exclusão; nenhum preenchimento automático com a IA; uma
conta por grupo na base.

**Escala/escopo**: uma seção no detalhe, um formulário e regras de criação e edição.

## Verificação da constituição

| Princípio | Situação |
| --- | --- |
| I. Escopo pequeno | ✅ Parecer qualitativo; sem notas, ranking ou etapas. |
| II. Persistência e separação | ✅ `source: 'human'`, separado das análises de IA na gravação e na tela. |
| III. IA controlada | ✅ A IA aparece só como consulta identificada; o parecer não é preenchido por ela. |
| IV. Isolamento | ✅ Regras exigem membro do grupo; edição só pela conta autora. |
| V. Simplicidade e verificação | ✅ Formulário único para criar e editar; testes de regras com dois usuários. |

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/005-avaliar-como-humano/
├── spec.md
├── plan.md
├── research.md
├── data-model.md                 # avaliações em geral e parecer humano
├── quickstart.md
├── contracts/
│   └── firestore-rules-evaluations.md
└── (tarefas em ../tasks.md, único para F01–F04)
```

### Código-fonte

```text
src/
├── shared/CharCounter.tsx                 # (F01) reutilizado
└── features/human-review/
    ├── reviewForm.ts                      # normalização e validação puras
    ├── saveReview.ts                      # addDoc (novo) e updateDoc (edição)
    └── HumanReviewSection.tsx             # lista, formulário de registro e edição, aviso de saída

firestore.rules                            # validHumanEvaluation() e canEditOwnHumanEvaluation()

tests/
├── unit/review-form.test.ts
├── rules.test.ts                          # criação, edição pelo autor, edição por outro uid, exclusão
└── e2e/human-review.spec.ts
```

## Integrações

- **Criação**: `addDoc(evaluationsRef(group, projectId), { source: 'human', reviewerName, content,
  criteria, createdByUid, createdByEmail, createdAt: serverTimestamp() })`.
- **Edição**: `updateDoc` só com `reviewerName`, `content`, `criteria` e
  `updatedAt: serverTimestamp()`. O botão "Editar" aparece quando `createdByUid == auth.currentUser.uid`.
- **Consulta da IA**: reaproveita as avaliações já carregadas pelo detalhe (F02) e a apresentação
  da F03, somente leitura.
- **Texto não salvo**: `beforeunload` enquanto o formulário tiver alterações.

## Testes (a partir dos critérios de aceite)

1. **Unitários** (`review-form.test.ts`): nome e síntese obrigatórios; síntese com mínimo de 30 e
   máximo de 3.000; comentários com até 1.000; critérios vazios são omitidos; trim.
2. **Regras**: membro cria parecer válido; `createdByUid` diferente do usuário é negado; o autor
   edita os campos permitidos; outro `uid` do mesmo grupo não edita; alterar `createdByUid`,
   `createdAt` ou `source` é negado; exclusão é negada; parecer do seed (sem `createdByUid`) não é
   editável; membro de outro grupo não lê nem escreve.
3. **Navegador**: registrar parecer em projeto criado pela F01 → aparece no detalhe e no selo da
   lista; validações visíveis; editar → "Editado em"; projeto do seed com parecer "Exemplo" sem
   "Editar"; fluxo completo F01 → F02 → F03 → F04.

## Riscos

- Com uma conta por grupo, a regra de autoria não diferencia pessoas; o nome do avaliador é só
  identificação (registrado na spec).
- Depende da reestruturação das regras (F01, ADR 005) e da publicação pelo instrutor.

## Acompanhamento de complexidade

Nenhuma violação a justificar.
