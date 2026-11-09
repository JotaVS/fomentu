# Especificação da funcionalidade: Consultar projetos (F02)

**Branch da funcionalidade**: `003-consultar-projetos`

**Criada em**: 2026-11-09

**Estado**: Rascunho

**Entrada**: rascunho F02 de `docs/features-draft.md`: "Listar os projetos do grupo e consultar
seus detalhes."

**Referência de regras**: Edital de Retificação nº 02 ao Edital PROINOVA nº 03/2025 do Critt/UFJF,
em especial o item 1.2 (áreas do PARTEC-JF), o item 7.2.5 (MVP e maturidade) e o item 12.4
(confidencialidade). Os campos exibidos são os definidos na F01
([spec](../002-cadastrar-projeto/spec.md)).

## Contexto

A consulta é a área de trabalho do avaliador do grupo. Ela permite fazer a **triagem** dos
projetos recebidos: localizar por área, estágio e MVP, ver quais ainda não foram avaliados e abrir
o detalhe para ler a proposta antes de gerar uma análise de IA (F03) ou registrar um parecer (F04).

A consulta não ordena por mérito, não calcula notas e não classifica projetos: rankings e notas
ponderadas estão fora do escopo pela constituição.

## Cenários de usuário e testes *(obrigatório)*

### História 1 — Avaliador vê a lista de projetos do grupo (Prioridade: P1)

Um membro do grupo, autenticado, abre a área de projetos e vê todos os projetos do seu grupo,
dos mais recentes para os mais antigos, com as informações essenciais e a situação de avaliação.

**Por que esta prioridade**: é o ponto de partida para avaliar; sem a lista não se chega aos
projetos.

**Teste independente**: com o seed carregado no emulador e um projeto criado pelo aplicativo,
entrar como usuário do grupo e verificar que a lista mostra todos os projetos do grupo, na ordem
esperada, e nenhum projeto de outro grupo.

**Cenários de aceite**:

1. **Dado** um usuário autenticado do grupo A, **quando** abre a lista, **então** vê todos os
   projetos do grupo A, ordenados do mais recente para o mais antigo, e nenhum de outro grupo.
2. **Dado** a lista carregada, **quando** o usuário observa um item, **então** vê o nome da
   solução, o nome do proponente, a área do PARTEC-JF, o estágio de desenvolvimento, a resposta
   sobre MVP, a data de envio e os selos de avaliação.
3. **Dado** que a lista está sendo carregada, **quando** os dados ainda não chegaram, **então** é
   exibido um indicador de carregamento.
4. **Dado** um grupo sem projetos, **quando** a lista é aberta, **então** aparece uma mensagem
   informando que ainda não há projetos e indicando o endereço do cadastro público.
5. **Dado** uma falha ao carregar, **quando** a lista é aberta, **então** aparece uma mensagem de
   erro compreensível com a opção de tentar novamente.

---

### História 2 — Avaliador consulta o detalhe de um projeto (Prioridade: P1)

Ao escolher um projeto, o avaliador vê todos os dados enviados pelo proponente e o resumo das
avaliações existentes, separadas por tipo.

**Por que esta prioridade**: as avaliações de IA e humanas partem da leitura completa da proposta.

**Teste independente**: abrir o detalhe de um projeto criado pelo aplicativo e conferir todos os
campos; abrir o detalhe de um projeto do seed e conferir "Não informado" e a etiqueta "Exemplo".

**Cenários de aceite**:

1. **Dado** um projeto do grupo, **quando** o usuário abre o detalhe, **então** vê todos os campos
   da F01: proponente (nome, e-mail, perfil), nome da solução, área do PARTEC-JF, problema ou
   oportunidade, descrição da solução, estágio, MVP, link do MVP, data de envio e data do aceite.
2. **Dado** um projeto com link de MVP, **quando** o usuário clica no link, **então** ele abre em
   uma nova aba, sem dar à página aberta acesso à aplicação.
3. **Dado** um projeto do seed, **quando** o detalhe é aberto, **então** os campos ausentes mostram
   "Não informado" e o projeto exibe a etiqueta "Exemplo".
4. **Dado** um projeto com avaliações, **quando** o detalhe é aberto, **então** as avaliações
   aparecem em seções separadas por tipo — "Análise de IA", "Análise de IA simulada" e "Parecer
   humano" — com data, ordenadas da mais recente para a mais antiga.
5. **Dado** um projeto sem avaliações, **quando** o detalhe é aberto, **então** cada seção indica
   que ainda não há avaliações daquele tipo.
6. **Dado** um identificador inexistente ou de outro grupo, **quando** o usuário acessa o detalhe
   diretamente pelo endereço, **então** vê "Projeto não encontrado" e um caminho de volta à lista,
   sem revelar se o projeto existe em outro grupo.

---

### História 3 — Avaliador filtra a lista para fazer a triagem (Prioridade: P2)

O avaliador combina filtros para encontrar, por exemplo, projetos de Saúde e Bem-Estar com MVP
validado que ainda não têm parecer humano.

**Por que esta prioridade**: torna a triagem viável quando o grupo tem muitos projetos, mas a
lista simples já entrega valor sem os filtros.

**Teste independente**: com projetos de áreas, estágios, MVP e situações de avaliação variadas,
aplicar filtros isolados e combinados e verificar os resultados.

**Cenários de aceite**:

1. **Dado** a lista carregada, **quando** o usuário escolhe uma área do PARTEC-JF, **então** só
   aparecem projetos daquela área.
2. **Dado** filtros de área, estágio, MVP e situação de avaliação, **quando** o usuário combina
   mais de um, **então** aparecem apenas projetos que atendem a todos (combinação por "E").
3. **Dado** um filtro aplicado, **quando** o usuário escolhe "Não informado", **então** aparecem os
   projetos sem aquele campo, como os do seed.
4. **Dado** filtros sem nenhum resultado, **quando** a lista é atualizada, **então** aparece uma
   mensagem dizendo que nenhum projeto atende aos filtros e uma ação para limpar os filtros.
5. **Dado** filtros aplicados, **quando** o usuário abre um detalhe e volta à lista, **então** os
   filtros continuam aplicados.
6. **Dado** filtros aplicados, **quando** o usuário escolhe "Limpar filtros", **então** a lista
   completa volta a aparecer e é exibida a quantidade de projetos mostrados.

---

### Casos de borda

- **Usuário não autenticado** tenta abrir a lista ou o detalhe: é levado ao login.
- **Usuário autenticado sem grupo válido**: mensagem da base orientando a procurar o instrutor;
  nenhuma consulta é feita.
- **Valor desconhecido** em área, estágio ou MVP (dado antigo ou fora da lista): exibido como
  recebido, sem quebrar a tela, e tratado como "Não informado" nos filtros.
- **Avaliação com tipo desconhecido** (sem origem humana ou de IA identificável): não é contada em
  nenhum selo e aparece no detalhe como "Avaliação de origem não identificada".
- **Análise de IA sem indicação de modo real ou simulado**: tratada como simulada, para nunca
  apresentar como real algo que não foi comprovado.
- **Textos longos**: na lista aparecem apenas o nome e dados curtos; o detalhe exibe os textos
  completos, preservando as quebras de linha e sem interpretar HTML enviado pelo proponente.
- **Projeto criado durante a consulta**: aparece ao recarregar a lista; atualização em tempo real
  não é exigida.
- **Datas**: exibidas no formato brasileiro e no fuso de Brasília; projeto sem data aparece no fim
  da lista com "Data não informada".

## Requisitos *(obrigatório)*

### Requisitos funcionais

- **FR-001**: A lista e o detalhe DEVEM estar disponíveis somente na área autenticada e exibir
  apenas projetos do grupo do usuário, de acordo com o grupo do token.
- **FR-002**: A lista DEVE ordenar os projetos pela data de envio, do mais recente para o mais
  antigo, e mostrar a quantidade de projetos exibidos.
- **FR-003**: Cada item da lista DEVE exibir nome da solução, nome do proponente, área do
  PARTEC-JF, estágio de desenvolvimento, resposta sobre MVP, data de envio e selos de avaliação.
- **FR-004**: A lista DEVE oferecer filtros por área do PARTEC-JF (as 7 opções da F01 e "Não
  informado"), estágio de desenvolvimento (as 6 opções e "Não informado"), MVP ("Sim", "Não",
  "Em fase de validação" e "Não informado") e situação de avaliação.
- **FR-005**: O filtro de situação de avaliação DEVE ter as opções "Sem avaliação", "Sem parecer
  humano", "Sem análise de IA" e "Com parecer humano e análise de IA". Análises reais e
  simuladas contam como análise de IA para o filtro.
- **FR-006**: Os filtros DEVEM ser combináveis por "E", preservados ao voltar do detalhe e
  removíveis por uma ação "Limpar filtros".
- **FR-007**: Os selos de avaliação DEVEM distinguir "IA", "IA simulada" e "Parecer humano",
  com a quantidade de cada tipo, e não devem aparecer para tipos sem avaliações.
- **FR-008**: O detalhe DEVE exibir todos os campos do projeto definidos na F01, incluindo o
  e-mail do proponente, as datas de envio e de aceite, e o link do MVP aberto em nova aba.
- **FR-009**: O detalhe DEVE exibir as avaliações em seções separadas por tipo, com data e
  conteúdo resumido, ordenadas da mais recente para a mais antiga, e DEVE oferecer os pontos de
  entrada para gerar análise de IA (F03) e registrar parecer humano (F04).
- **FR-010**: Projetos do seed DEVEM ser exibidos com a etiqueta "Exemplo", e todo campo ausente
  DEVE aparecer como "Não informado".
- **FR-011**: A lista e o detalhe DEVEM tratar carregamento, erro (com nova tentativa), ausência
  de dados e projeto não encontrado com mensagens em português.
- **FR-012**: Textos do proponente DEVEM ser exibidos como texto simples, sem interpretação de
  HTML ou scripts.
- **FR-013**: A consulta NÃO DEVE permitir editar ou excluir projetos, nem exibir nota, ranking
  ou situação de seleção.

### Entidades principais

- **Projeto**: definido na F01. Nesta funcionalidade é somente lido.
- **Avaliação**: registro na subcoleção de avaliações do projeto, identificado pela origem
  (humana ou IA) e, para IA, pelo modo (real ou simulado). Seu conteúdo é definido nas F03 e F04;
  aqui são usados apenas a origem, o modo, a data e um resumo do texto.
- **Situação de avaliação**: informação derivada das avaliações de um projeto (quantidade por
  tipo), não gravada separadamente.

## Critérios de sucesso *(obrigatório)*

### Resultados mensuráveis

- **SC-001**: O avaliador encontra um projeto específico e abre seu detalhe em até 30 segundos
  com o volume da oficina (seed mais os projetos criados no dia).
- **SC-002**: 0 projetos de outros grupos aparecem na lista ou no detalhe, verificado por teste
  com dois grupos no emulador.
- **SC-003**: 100% dos projetos do seed abrem sem erro, exibindo "Não informado" nos campos
  ausentes.
- **SC-004**: Os selos e as seções distinguem corretamente os três tipos de avaliação em 100% dos
  casos de teste, incluindo análise de IA sem modo informado.
- **SC-005**: Um teste de fluxo completo no navegador abre, pela lista, um projeto criado pelo
  aplicativo na F01 e confere seus dados no detalhe.

## Decisões registradas

- **Triagem com filtros do edital** (decisão do grupo em 2026-11-09): ordem por data e filtros por
  área, estágio, MVP e situação de avaliação. Alternativas descartadas: só ordem por data
  (dificulta achar pendentes) e busca por texto (não ajuda na triagem).
- **Selos na lista e seções no detalhe** (decisão do grupo em 2026-11-09). Alternativa
  descartada: avaliações somente no detalhe, que esconde o que está pendente.
- **Projetos do seed com "Não informado" e etiqueta "Exemplo"** (decisão do grupo em
  2026-11-09). Alternativa descartada: esconder campos ausentes, que não deixa claro o que é
  fictício.

## Premissas

- O volume por grupo é pequeno (dezenas de projetos), então não é exigida paginação nem busca no
  servidor.
- A consulta usa o acesso autenticado já preparado pela base; nenhuma regra nova é necessária.
- Os campos e as opções vêm da F01; se a F01 mudar, esta especificação deve ser revisada.
- O conteúdo completo de cada avaliação, e como criá-la, são definidos nas F03 e F04.

## Riscos e dependências

- **Leituras das avaliações**: para montar os selos e o filtro de situação, a lista precisa ler as
  avaliações de cada projeto. Com o volume da oficina isso é aceitável; com muitos projetos,
  seria preciso guardar um resumo no próprio projeto (decisão para o plano, se necessário).
- **Dados pessoais (LGPD e item 12.4 do edital)**: o e-mail do proponente aparece somente na área
  autenticada do grupo e não deve ser exibido em mensagens de erro nem registrado em logs.
