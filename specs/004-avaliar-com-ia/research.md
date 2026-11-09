# Pesquisa e decisões técnicas: Avaliar com IA (F03)

## 1. Formato da resposta: JSON validado à mão

- **Decisão**: as instruções pedem apenas um objeto JSON com chaves fixas em inglês (contrato em
  [contracts/ai-analysis.md](contracts/ai-analysis.md)). O app aplica `JSON.parse` e uma função
  pura de validação.
- **Tolerância**: aceitar o JSON dentro de um único bloco ```` ```json ```` (comportamento comum
  dos modelos); qualquer outro texto extra conta como "fora do formato".
- **Motivo**: é fácil de testar e não acrescenta dependência (decisão do grupo em 2026-11-09).
- **Alternativas descartadas**: texto com marcadores (parser frágil) e zod (dependência nova).

## 2. Instruções versionadas

- **Decisão**: constante `PROMPT_VERSION = 'ai-analysis-v1'` gravada em cada análise. Ela muda
  sempre que as instruções mudarem.
- **Motivo**: rastreabilidade (FR-009) e base da confirmação antes de gerar de novo (ADR 004).

## 3. Proteção contra injeção no pedido

- **Decisão**: as instruções vêm primeiro. Os dados do proponente vão entre delimitadores fixos
  (`<<<DADOS_DO_PROJETO` … `DADOS_DO_PROJETO>>>`), com a orientação de tratá-los como conteúdo a
  analisar. Antes de montar o pedido, os delimitadores são removidos do texto do proponente.
- **Motivo**: FR-003. Não é uma garantia total; por isso a revisão humana antes de salvar e o aviso
  fixo continuam obrigatórios.

## 4. Resposta simulada

- **Decisão**: com `mode == 'mock'`, o texto é exibido e salvo como texto simples, sem validação de
  formato.
- **Motivo**: a função da base devolve um texto fixo no modo simulado (decisão registrada na spec).

## 5. Tempo-limite e aviso

- **Decisão**: `httpsCallable(functions, 'generateText', { timeout: 35_000 })` e aviso aos 10 s
  (ADR 004).
- **Observação**: a alteração em `src/lib/firebase.ts` é pequena e só afeta a chamada do cliente; a
  função do servidor não muda.

## 6. Simulação nos testes de navegador

- **Decisão**: `page.route('**/generateText', ...)` responde no formato do protocolo de funções
  chamáveis: sucesso `{"result": {...}}` e erro `{"error": {"status": "...", "message": "..."}}` com
  o status HTTP correspondente. O relógio é controlado com `page.clock`.
- **Motivo**: é determinístico, cobre todas as falhas do ADR 004 e não exige o emulador de
  Functions nem mudança de scripts (decisão do grupo em 2026-11-09).
- **Alternativas descartadas**: emulador de Functions (só cobre o texto fixo simulado) e fake
  dentro do app (código de teste no produto).
- **Observação**: com `VITE_USE_EMULATORS=true`, o SDK chama
  `http://127.0.0.1:5001/demo-fomentu/us-central1/generateText`. A interceptação acontece antes, sem
  emulador ativo.

## 7. Onde fica o conteúdo

- **Decisão**: `content` guarda sempre um texto legível (o resumo, na análise estruturada, ou o texto
  simulado), e `analysis` guarda a estrutura completa quando existir.
- **Motivo**: a F02 exibe um resumo usando `content` para qualquer avaliação, inclusive as do seed.
