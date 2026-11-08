# ADR 003 — Organização das telas e componentes

**Estado:** orientação inicial para a oficina; o grupo pode adaptá-la no planejamento.

## Contexto

A base já fornece navegação, layout e pontos de entrada. Os grupos vão construir cadastro público,
consulta de projetos e avaliações em tempo limitado, precisando equilibrar clareza e reaproveitamento.

## Opções consideradas

1. Manter todas as telas e toda a lógica em um único componente.
2. Separar as áreas por responsabilidade e extrair componentes compartilhados quando houver uso real.
3. Criar antecipadamente uma estrutura genérica com muitas camadas e componentes para possíveis usos futuros.

## Decisão

Adotar a segunda opção como ponto de partida: separar as telas ou áreas à medida que forem
implementadas e manter próximos de cada área seus componentes e lógica específicos. Compartilhar
componentes de interface, tipos ou funções quando forem usados por mais de uma área ou quando a
separação tornar o código mais claro. Evitar criar abstrações antecipadamente sem necessidade.

A organização exata, os componentes, os campos e o fluxo das telas serão definidos pelos grupos na
especificação e no planejamento. A base atual ainda concentra a interface em `src/main.tsx`; este
ADR orienta sua evolução e não afirma que a separação já foi implementada.

## Consequências

- As equipes podem dividir o trabalho e localizar as partes relacionadas a cada funcionalidade.
- Alguma separação inicial exige esforço, mas evita que toda a implementação cresça em um só arquivo.
- Uma duplicação pequena pode ser aceitável; extrair uma abstração exige avaliar se ela realmente simplifica.
- O grupo pode revisar esta orientação e registrar uma decisão diferente, com sua justificativa.
