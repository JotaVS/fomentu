# Pesquisa e decisões técnicas: Avaliar como humano (F04)

## 1. Formulário em linha no detalhe

- **Decisão**: registrar e editar no próprio detalhe do projeto, sem rota nova.
- **Motivo**: a spec pede os dados do projeto e as análises de IA visíveis durante o
  preenchimento, e o detalhe já carrega tudo isso.

## 2. Síntese gravada em `content`

- **Decisão**: a síntese geral fica em `content` e os comentários por critério em `criteria`.
- **Motivo**: os pareceres do seed têm apenas `content`; assim, a F02 exibe todas as avaliações da
  mesma forma.

## 3. Autoria garantida pelas regras

- **Decisão**: `createdByUid == request.auth.uid` na criação. A edição só é permitida quando
  `resource.data.createdByUid == request.auth.uid` e altera apenas `reviewerName`, `content`,
  `criteria` e `updatedAt` (`diff().affectedKeys().hasOnly(...)`). Exclusão sempre negada.
- **Motivo**: o FR-007 exige que a restrição valha fora da interface.
- **Dependência**: exige a reestruturação das regras feita na F01 (ADR 005). Com o curinga atual,
  qualquer membro poderia alterar ou excluir.

## 4. Chaves dos critérios

- **Decisão**: as mesmas chaves da F03 (`businessModel`, `innovation`, `market`, `trl`, `partec`).
- **Motivo**: facilita comparar e reaproveitar os rótulos em PT-BR.

## 5. Testes das regras com dois usuários

- **Decisão**: `env.authenticatedContext('user-a', { groupId: 'group-01', email: ... })` e
  `user-b` no mesmo grupo.
- **Motivo**: a base tem uma conta por grupo; só o teste de regras consegue comprovar a restrição
  por autor (SC-003).
