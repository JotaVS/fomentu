# Modelo de dados: Análise de IA

Caminho: `groups/{groupId}/projects/{projectId}/evaluations/{evaluationId}` (ID automático).

| Campo | Tipo | Regra |
| --- | --- | --- |
| `source` | string | sempre `'ai'` |
| `mode` | enum | `'live'` ou `'mock'`, copiado da resposta da função |
| `model` | string ou null | modelo informado pela função; `null` se ausente |
| `content` | string | 1–20.000; resumo (análise estruturada) ou texto simples (simulada) |
| `analysis` | map (opcional) | estrutura validada (abaixo); ausente quando simulada |
| `promptVersion` | string | por exemplo, `'ai-analysis-v1'` |
| `createdAt` | timestamp | hora do servidor |
| `createdByUid` | string | `request.auth.uid` |
| `createdByEmail` | string | `request.auth.token.email` |

## Estrutura de `analysis`

```text
analysis
├── summary: string
└── criteria
    ├── businessModel: { strengths: string[], gaps: string[], questions: string[] }
    ├── innovation:    { ... }
    ├── market:        { ... }
    ├── trl:           { ... }
    └── partec:        { ... }
```

Limites de validação: `summary` de 1 a 1.500 caracteres. Cada lista tem de 1 a 5 itens, com 1 a
400 caracteres cada. Sem chaves extras.

| Chave | Rótulo PT-BR | Critério do edital (item 7.2) |
| --- | --- | --- |
| `businessModel` | Modelo de negócio | Modelo de negócio |
| `innovation` | Grau de inovação | Grau de inovação |
| `market` | Potencial de mercado | Potencial de mercado |
| `trl` | Maturidade tecnológica (TRL) | Grau de maturidade tecnológica |
| `partec` | Aderência ao PARTEC-JF | Aderência às áreas prioritárias |

## Avaliações de IA do seed (existentes)

`{ source: 'ai', mode: 'mock', content, createdBy: 'seed', createdAt }`. São exibidas como texto
simples, com o selo "simulada" e a etiqueta "Exemplo".

## Prévia (somente em memória)

`{ status: 'idle' | 'loading' | 'slow' | 'preview' | 'error', response?, error? }`. Não é persistida.

## Ciclo de vida

Uma análise só é criada pelo botão "Salvar análise". Ela nunca é alterada nem excluída.
