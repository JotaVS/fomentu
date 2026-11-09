# ADR 005 — Regras de segurança do miniapp

**Estado:** aceito pelo grupo em 2026-11-09, incluindo o ajuste do teste de isolamento existente.

## Contexto

As regras da base concedem leitura e escrita a qualquer membro em todo o grupo, pelo curinga
`match /groups/{groupId}/{document=**}`. As especificações exigem três comportamentos que essa
regra não permite:

- **F01**: um visitante sem login cria projetos validados, sem nenhuma leitura pública;
- **F04**: só a conta autora edita um parecer, e ninguém exclui avaliações;
- **F02 e F03**: projetos e análises de IA não podem ser alterados depois de criados.

Nas Security Rules, as permissões são combinadas por "OU": enquanto o curinga conceder escrita,
nenhuma restrição mais específica tem efeito. As regras também valem para o projeto Firebase
inteiro, ou seja, para os dez grupos.

## Opções consideradas

1. Manter o curinga e aplicar as restrições apenas na interface.
2. Substituir o curinga por regras explícitas por coleção, com validação de dados.
3. Mover as gravações para Cloud Functions com Admin SDK.

## Decisão

Adotar a opção 2. Manter `isMember()` (login e `groupId` do token iguais ao grupo do caminho) e
definir regras explícitas:

- **documento do grupo**: leitura por membros;
- **`diagnostics`**: leitura e escrita por membros, como hoje;
- **`projects`**: leitura por membros; criação por qualquer cliente, só com dados válidos e
  `createdBy == 'public-form'`; sem alteração nem exclusão;
- **`evaluations`**: leitura por membros; criação por membros, com autor igual ao usuário e dados
  válidos por tipo; edição só de pareceres humanos pela conta autora; sem exclusão.

Os contratos detalhados estão em `specs/002-cadastrar-projeto/contracts/` e
`specs/005-avaliar-como-humano/contracts/`.

## Consequências

- As restrições das specs passam a valer fora da interface e são verificáveis no emulador.
- O teste existente de isolamento (`tests/rules.test.ts`) grava `{ value: 1 }` e precisa usar
  documentos válidos. As verificações de isolamento continuam as mesmas; o ajuste deve ser revisado
  pelo grupo, conforme o ADR 002.
- As regras validam campos definidos por este grupo. Como valem para todos os grupos, a publicação
  no ambiente real depende do instrutor e de acordo entre os grupos.
- **Riscos aceitos para a oficina**:
  - o grupo do envio público vem da configuração do site e pode ser adulterado;
  - não há limite de envios públicos;
  - um membro pode gravar à mão um documento `source: 'ai'` que não veio da função de IA.
  
  Eliminar esses riscos exigiria gravar pelo servidor (opção 3), o que está fora do escopo.
