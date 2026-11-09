# Plano de implementação: Avaliar com IA (F03)

**Branch**: `004-avaliar-com-ia` | **Data**: 2026-11-09 | **Spec**: [spec.md](spec.md)

**Entrada**: especificação em `specs/004-avaliar-com-ia/spec.md` e
[ADR 004](../../docs/adr/004-tratamento-de-falhas-da-ia.md).

## Resumo

Adicionar ao detalhe do projeto (F02) uma seção de análise de IA. O app monta um pedido em PT-BR
com os dados do projeto delimitados como dados, chama a função existente `generateText` e valida
a resposta real como **JSON** com resumo e cinco critérios. A prévia é exibida com selo de modo e
aviso fixo, e o registro em `evaluations` só é criado quando o avaliador escolhe salvar. Falhas,
demora e confirmação seguem o ADR 004. A função de IA da base **não é alterada**.

## Contexto técnico

**Linguagem/versão**: TypeScript 5.8 e React 19.

**Dependências principais**: `firebase/functions` (`httpsCallable`), já usado em
`src/lib/firebase.ts`. Nenhuma dependência nova; a validação do JSON é feita à mão.

**Armazenamento**: `groups/{groupId}/projects/{projectId}/evaluations/{id}` com `source: 'ai'`
(modelo em [data-model.md](data-model.md)).

**Testes**: Vitest para montagem do pedido, validação da resposta e classificação de erros;
Playwright com **interceptação de `generateText`** (`page.route`) e relógio simulado
(`page.clock`) para respostas, falhas e demora.

**Plataforma alvo**: navegador, área autenticada.

**Tipo de projeto**: aplicação web de página única.

**Metas de desempenho**: gerar, revisar e salvar em até 1 minuto (SC-001); tempo-limite de 35 s
no cliente.

**Restrições**: pedido com até 4.000 caracteres; cota de 100 chamadas por grupo por dia, debitada
antes do provedor; nenhuma chave de IA no frontend; falha nunca vira resposta simulada.

**Escala/escopo**: uma seção no detalhe, com prévia, histórico e três funções puras.

## Verificação da constituição

| Princípio | Situação |
| --- | --- |
| I. Escopo pequeno | ✅ Análise qualitativa, sem nota nem decisão. |
| II. Persistência | ✅ Análises em `evaluations` com `source: 'ai'`, separadas dos pareceres. |
| III. IA identificável e controlada | ✅ Usa o backend autenticado do instrutor; modo real ou simulado exibido e gravado; falhas tratadas pelo ADR 004, sem conversão para resposta simulada. |
| IV. Isolamento | ✅ Gravação na subcoleção do projeto do grupo; regra exige membro e autor igual ao usuário. |
| V. Simplicidade e verificação | ✅ Simulação determinística nos testes; a integração real é verificada à parte e registrada como pendência enquanto não estiver configurada. |

## Estrutura do projeto

### Documentação (esta feature)

```text
specs/004-avaliar-com-ia/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ai-analysis.md        # pedido, resposta JSON e erros de generateText
└── (tarefas em ../tasks.md, único para F01–F04)
```

### Código-fonte

```text
src/
├── lib/firebase.ts                     # generateText com { timeout: 35_000 }
├── shared/evaluations.ts               # (F02) classificação; reutilizada no histórico
└── features/ai-analysis/
    ├── prompt.ts                       # PROMPT_VERSION, buildPrompt(project) e verificação de 4.000 caracteres
    ├── parseAnalysis.ts                # extrai e valida o JSON (puro)
    ├── aiErrors.ts                     # classifyAiError(): mensagem PT-BR e se permite nova tentativa (ADR 004)
    ├── saveAnalysis.ts                 # addDoc em evaluations
    └── AiAnalysisSection.tsx           # botão, espera (aviso aos 10 s), prévia, salvar/descartar, histórico

firestore.rules                         # validAiEvaluation() (estrutura da F01)

tests/
├── unit/ai-prompt.test.ts
├── unit/ai-parse.test.ts
├── unit/ai-errors.test.ts
├── rules.test.ts                       # casos de criação de análise de IA
└── e2e/ai-analysis.spec.ts             # com page.route('**/generateText') e page.clock
```

## Integrações

- **`generateText`** (Cloud Function da base): chamada com `{ prompt }` e resposta
  `{ text, mode, model? }`. Contrato e erros em [contracts/ai-analysis.md](contracts/ai-analysis.md).
- **Tempo-limite**: a opção `timeout` do `httpsCallable` passa a 35.000 ms, e um `setTimeout` de
  10 s exibe o aviso de demora. Quando o tempo esgota, o SDK rejeita com `deadline-exceeded` e a
  resposta tardia é ignorada.
- **Confirmação antes de gerar**: se houver análise com `promptVersion` igual à atual, a tela usa
  `window.confirm` com o aviso de consumo de cota.
- **Saída da tela com prévia pendente**: evento `beforeunload`, já que a navegação recarrega a
  página.
- **Firestore**: `addDoc(evaluationsRef(group, projectId), {...})` com `serverTimestamp()`.

## Testes (a partir dos critérios de aceite)

1. **Unitários**:
   - `buildPrompt`: inclui todos os campos e "Não informado" nos ausentes; delimita os dados do
     proponente; rejeita pedido acima de 4.000 caracteres.
   - `parseAnalysis`: aceita o JSON válido, inclusive envolvido em um único bloco ```` ```json ````;
     rejeita texto extra, chave faltando, tipo errado e listas vazias ou longas demais.
   - `classifyAiError`: cobre cada linha da tabela do ADR 004.
2. **Regras**: membro cria análise de IA válida; autor diferente do usuário, `source` inválida,
   chave extra, alteração ou exclusão são negados.
3. **Navegador** (com `page.route`): resposta real válida → prévia por critério com selo "Análise
   de IA" → salvar → histórico; resposta `mock` → texto simples com selo "simulada"; resposta real
   fora do formato → erro sem salvar; `RESOURCE_EXHAUSTED` e `FAILED_PRECONDITION` sem "Tentar
   novamente"; `UNAVAILABLE` com "Tentar novamente"; `page.clock` para o aviso aos 10 s e o
   tempo-limite aos 35 s; confirmação ao gerar de novo; fluxo com projeto criado pela F01.
4. **Integração real** (manual, separada): quando o instrutor configurar o provedor, gerar 3
   análises reais e conferir o SC-004. Até lá, registrar como pendência.

## Riscos

- **Análise de IA forjada**: a regra não consegue provar que o conteúdo veio da função; um membro
  poderia gravar um documento `source: 'ai'` à mão. Isso é aceito para a oficina e registrado no
  ADR 005. A garantia exigiria que a própria função gravasse a análise, o que está fora do escopo.
- A integração real ainda está pendente na base.
- Cota e tokens são gastos inclusive em falhas, por decisão da base (ADR 004).

## Acompanhamento de complexidade

Nenhuma violação a justificar.
