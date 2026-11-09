# ADR 003 — Organização das telas e componentes

**Estado:** aceito para a base do treinamento.

## Contexto

A base já fornece navegação, layout e pontos de entrada. Os grupos vão construir cadastro público,
consulta de projetos e avaliações em tempo limitado, precisando equilibrar clareza e reaproveitamento.

## Opções consideradas

1. Manter todas as telas e toda a lógica em um único componente.
2. Separar as áreas por responsabilidade e extrair componentes compartilhados quando houver uso real.
3. Criar antecipadamente uma estrutura genérica com muitas camadas e componentes para possíveis usos futuros.

## Decisão

Organizar o código por área de responsabilidade. Manter as telas, componentes e lógica específicos
próximos de sua área, e separar os componentes do layout administrativo, como menu, sidebar e
cabeçalho. Compartilhar componentes, tipos e funções quando houver uso em mais de uma área ou
quando a separação tornar o código mais claro. Evitar abstrações antecipadas sem necessidade.

Como referência, usar áreas como `admin`, `public` e `auth`, com código compartilhado em `shared`
e infraestrutura em `lib`. A disposição específica dos arquivos pode evoluir sem abandonar a
organização por área. `src/main.tsx` inicia a aplicação; as áreas e os componentes do layout
ficam em arquivos separados.

## Consequências

- As equipes podem dividir o trabalho e localizar as partes relacionadas a cada funcionalidade.
- Alguma separação inicial exige esforço, mas evita que toda a implementação cresça em um só arquivo.
- Uma duplicação pequena pode ser aceitável; extrair uma abstração exige avaliar se ela realmente simplifica.
- As equipes seguem a organização por área ao acrescentar código e podem decidir os detalhes internos.
