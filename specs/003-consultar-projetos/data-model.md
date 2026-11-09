# Modelo de dados: Consultar projetos (F02)

A F02 não grava dados. Ela lê o **Projeto**
([../002-cadastrar-projeto/data-model.md](../002-cadastrar-projeto/data-model.md)) e as
**Avaliações** ([../005-avaliar-como-humano/data-model.md](../005-avaliar-como-humano/data-model.md))
e calcula os tipos abaixo, sem persistência.

## Tipo de avaliação (derivado)

| Dados da avaliação | Tipo | Selo / seção |
| --- | --- | --- |
| `source == 'ai'` e `mode == 'live'` | `ai` | IA / Análise de IA |
| `source == 'ai'` e `mode == 'mock'` ou sem `mode` | `ai-mock` | IA simulada / Análise de IA simulada |
| `source == 'human'` | `human` | Parecer humano |
| qualquer outro | `unknown` | Avaliação de origem não identificada (sem selo) |

## Resumo por projeto (derivado)

`{ ai: number, aiMock: number, human: number, unknown: number }`

## Filtros (query string)

| Parâmetro | Valores |
| --- | --- |
| `area` | valores de `partecArea` ou `nao-informado` |
| `estagio` | valores de `stage` ou `nao-informado` |
| `mvp` | valores de `mvpStatus` ou `nao-informado` |
| `avaliacao` | `sem-avaliacao` (nenhuma de tipo conhecido), `sem-parecer` (`human == 0`), `sem-ia` (`ai + aiMock == 0`), `ambas` (`human > 0` e `ai + aiMock > 0`) |

Um parâmetro ausente ou com valor desconhecido na URL é ignorado, ou seja, não filtra.

## Projeto exibido

- É **exemplo** quando `createdBy == 'seed'`.
- Campo ausente ou com valor fora das opções: no detalhe, mostra o valor bruto ou "Não informado";
  nos filtros, conta como `nao-informado`.
- Sem `createdAt`: aparece no fim da lista com "Data não informada".
