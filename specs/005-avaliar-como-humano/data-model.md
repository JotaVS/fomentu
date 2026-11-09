# Modelo de dados: Avaliações e parecer humano

Caminho: `groups/{groupId}/projects/{projectId}/evaluations/{evaluationId}` (ID automático).

A subcoleção guarda dois tipos de avaliação, separados por `source`:

- `source: 'ai'`: análise de IA, descrita na
  [F03](../004-avaliar-com-ia/data-model.md);
- `source: 'human'`: parecer humano, descrito abaixo.

## Parecer humano

| Campo | Tipo | Regra |
| --- | --- | --- |
| `source` | string | sempre `'human'` |
| `reviewerName` | string | 2–120 |
| `content` | string | síntese geral, 30–3.000 |
| `criteria` | map | chaves opcionais `businessModel`, `innovation`, `market`, `trl`, `partec`; cada valor é string de 1 a 1.000; critérios vazios não são gravados |
| `createdByUid` | string | `request.auth.uid` na criação; imutável |
| `createdByEmail` | string | `request.auth.token.email`; imutável |
| `createdAt` | timestamp | hora do servidor; imutável |
| `updatedAt` | timestamp (opcional) | hora do servidor na última edição |

## Pareceres do seed (existentes)

`{ source: 'human', content, createdBy: 'seed', createdAt }`. Sem `createdByUid`, por isso não são
editáveis; aparecem com a etiqueta "Exemplo".

## Ciclo de vida

```text
criado (addDoc) ──► editado pela conta autora (updateDoc, quantas vezes quiser)
                    nunca excluído
```
