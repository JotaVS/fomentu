# ADR 006 — Tratamento de falhas da IA

**Estado:** aceito pelo grupo em 2026-11-09.

## Contexto

A análise de IA (F03, `specs/004-avaliar-com-ia/spec.md`) chama a função `generateText` da base.
A função tem limite de 30 segundos no servidor e aceita pedidos de até 4.000 caracteres. Ela
desconta a cota diária do grupo (100 chamadas) **antes** de chamar o provedor. Por isso, toda
tentativa consome cota e, no modo real, tokens, mesmo quando falha ou é descartada. O cliente do
Firebase espera até 70 segundos por padrão.

A constituição exige que uma falha real nunca vire uma resposta simulada silenciosamente e que a
interface trate erros de forma compreensível. É preciso decidir como reagir a falhas e demoras,
quando permitir nova tentativa e como evitar registros incompletos, duplicados e gasto desnecessário.

## Opções consideradas

1. **Retentativa:** somente manual; ou uma retentativa automática seguida de manual.
2. **Demora:** aviso com tempo-limite no cliente; ou aviso com botão "Parar de esperar".
3. **Duplicidade:** confirmar antes de gerar quando já existe análise salva; bloquear nova geração;
   ou não ter controle extra.
4. **Registro de falhas:** não registrar; ou gravar uma coleção técnica separada.

## Decisão

- **Retentativa somente manual.** Não há retentativa automática. Em falha temporária, a tela
  oferece "Tentar novamente"; em falha permanente, não oferece. O avaliador decide cada gasto.
- **Demora com aviso e tempo-limite de 35 segundos no cliente.** O indicador de processamento
  aparece desde o início. Depois de 10 segundos, a tela mostra "Isso pode levar até 30 segundos".
  Aos 35 segundos (30 do servidor mais margem), o cliente desiste e trata a demora como tempo
  esgotado. Não há botão de cancelar, porque cancelar não devolve a cota nem os tokens já gastos.
- **Confirmação antes de gerar.** Se o projeto já tem análise salva com a mesma versão das
  instruções, a tela pede confirmação, informando que a nova geração consome cota. Os botões de
  gerar e salvar ficam indisponíveis durante a chamada e o salvamento. Nada é gravado antes de o
  avaliador escolher "Salvar análise".
- **Falhas não são gravadas.** A falha aparece somente na tela e nunca vira registro na
  subcoleção `evaluations`. A cota já é contada pela função.

Classificação das falhas (códigos de `HttpsError` da função ou do cliente):

| Situação | Código | Tipo | Retentativa |
| --- | --- | --- | --- |
| Sem login ou sem grupo válido | `unauthenticated`, `permission-denied` | Permanente | Não |
| Limite diário atingido | `resource-exhausted` | Permanente no dia | Não |
| Integração real não configurada | `failed-precondition` | Permanente | Não |
| Pedido vazio ou acima de 4.000 caracteres | `invalid-argument` | Permanente (erro do app) | Não |
| Tempo esgotado no servidor ou no cliente | `deadline-exceeded` | Temporária | Manual |
| Serviço indisponível, falha interna ou rede | `unavailable`, `internal`, `unknown` | Temporária | Manual |
| Resposta real fora do formato esperado | — (validação no app) | Temporária | Manual |

Toda mensagem é escrita em português, sem detalhes técnicos, e informa quando a tentativa já
consumiu cota. Em nenhum caso a tela exibe ou salva uma resposta simulada no lugar de uma falha.

Para conter o custo de tokens, o pedido usa instruções curtas e versionadas e os campos do projeto
dentro dos limites da F01. O pedido nunca é enviado se exceder 4.000 caracteres, e os testes
automatizados usam simulação determinística, sem consumir o serviço real.

## Consequências

- O avaliador sempre sabe quando gasta cota, e o grupo não perde cota com repetições automáticas.
- Falhas temporárias exigem uma ação do usuário para nova tentativa, o que é um pouco menos cômodo.
- A subcoleção `evaluations` só contém análises completas e revisadas.
- Sem registro das falhas, o grupo não tem estatística de erros; a cota diária continua
  visível apenas pelo efeito do limite.
- Uma resposta que chegue depois dos 35 segundos do cliente é descartada, mas já consumiu cota.
- Ficam fora do alcance do grupo e são sugestões ao instrutor: descontar a cota apenas em
  chamadas bem-sucedidas e limitar o tamanho da resposta no servidor (máximo de tokens de saída).
- Os testes precisam simular cada linha da tabela de falhas e o tempo-limite do cliente.
