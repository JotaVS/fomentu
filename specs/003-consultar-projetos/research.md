# Pesquisa e decisões técnicas: Consultar projetos (F02)

## 1. Roteamento sem biblioteca

- **Decisão**: manter o roteamento manual do `main.tsx` (`window.location.pathname`) e
  reconhecer `/admin/projetos/{id}` com uma função pura `parseRoute`. A navegação usa links comuns,
  com recarga da página.
- **Motivo**: a base já funciona assim; um roteador seria uma dependência nova para três rotas.
- **Alternativa descartada**: `react-router`, por adicionar dependência e configuração.

## 2. Filtros na query string

- **Decisão**: os filtros ficam na URL (`?area=health&estagio=ideation&mvp=yes&avaliacao=sem-ia`).
- **Motivo**: como a navegação recarrega a página, a URL é o jeito mais simples de manter os
  filtros ao voltar do detalhe (FR-006). Também permite que o menu aponte para listas já filtradas.
- **Alternativa descartada**: `sessionStorage`, que tem mais estado escondido e precisa de
  tratamento de erros.

## 3. Filtragem no cliente

- **Decisão**: carregar todos os projetos do grupo e filtrar com `applyFilters()` puro.
- **Motivo**: volume pequeno; o valor "Não informado" (campo ausente) não é consultável no
  Firestore; e o código fica testável sem emulador.

## 4. Resumo de avaliações

- **Decisão**: ler a subcoleção `evaluations` de cada projeto em paralelo e calcular as contagens
  no cliente com `classifyEvaluation()`.
- **Motivo**: dispensa regra de `collectionGroup` e dados redundantes no projeto.
- **Limite**: com muitos projetos, gravar um resumo no projeto (risco registrado na spec).

## 5. Dados para testes de navegador

- **Decisão**: estender `admin/emulator-test-setup.js` para criar também um usuário do `group-02` e
  os exemplos do seed nos dois grupos, reaproveitando a lógica de `admin/manage.js` quando possível.
- **Motivo**: os testes de isolamento e de "Exemplo"/"Não informado" precisam de dados
  previsíveis no emulador.
- **A verificar na implementação**: se `admin/manage.js seed-group demo-fomentu <grupo>` funciona
  apontando para o emulador sem credenciais. Se não funcionar, criar os exemplos diretamente no
  script de setup.
- **Resultado (T004, 2026-11-09)**: funciona. Dentro de
  `firebase emulators:exec --only firestore --project demo-fomentu`, com `FIRESTORE_EMULATOR_HOST`
  definido e sem `GOOGLE_APPLICATION_CREDENTIALS`, `node admin/manage.js seed-group demo-fomentu
  group-01` criou os 13 projetos de exemplo e as avaliações do seed. Uma segunda execução não
  duplicou nada (continuaram 13 projetos). Por isso o `admin/emulator-test-setup.js` reaproveita o
  seed do admin em vez de criar os exemplos diretamente.
