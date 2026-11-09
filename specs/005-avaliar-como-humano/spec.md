# Especificação da funcionalidade: Avaliar como humano (F04)

**Branch da funcionalidade**: `005-avaliar-como-humano`

**Criada em**: 2026-11-09

**Estado**: Rascunho

**Entrada**: rascunho F04 de `docs/features-draft.md`: "Registrar, salvar e consultar um parecer
humano sobre um projeto."

**Referência de regras**: Edital de Retificação nº 02 ao Edital PROINOVA nº 03/2025 do Critt/UFJF,
em especial o item 7.2 (critérios do Momento de Avaliação 1), o item 7.2.1 (avaliação por mais de
um membro), o item 12.4 (confidencialidade) e o item 12.9 (julgamento exclusivo da banca). Usa os
dados da F01 ([spec](../002-cadastrar-projeto/spec.md)), o detalhe da F02
([spec](../003-consultar-projetos/spec.md)) e, como consulta, as análises da F03
([spec](../004-avaliar-com-ia/spec.md)).

## Contexto

O parecer humano é a leitura qualificada de um membro do grupo sobre o projeto. Ele usa os mesmos
cinco critérios do Momento de Avaliação 1 do edital que organizam a análise de IA, o que permite
comparar as duas visões, mas permanece **separado** dela: o parecer é sempre de origem humana e
nunca é preenchido automaticamente pela IA.

O edital prevê que vários avaliadores leiam a mesma proposta (item 7.2.1); por isso um projeto pode
ter vários pareceres. O parecer é **qualitativo**: não tem nota, média, aprovação, reprovação nem
encaminhamento para etapa, pois a constituição exclui seleção por etapas, ranking e notas
ponderadas.

## Cenários de usuário e testes *(obrigatório)*

### História 1 — Avaliador registra um parecer (Prioridade: P1)

No detalhe de um projeto, o avaliador abre o formulário de parecer, informa seu nome, escreve
uma síntese e, se quiser, comentários por critério, e salva. O parecer passa a constar do
projeto como "Parecer humano".

**Por que esta prioridade**: é o fluxo central da funcionalidade e cobre registrar e salvar.

**Teste independente**: no emulador, abrir um projeto criado pelo aplicativo, registrar um
parecer e verificar o registro gravado na subcoleção de avaliações do projeto correto,
identificado como parecer humano, com autor e data.

**Cenários de aceite**:

1. **Dado** o detalhe de um projeto do grupo, **quando** o avaliador escolhe "Registrar parecer",
   **então** vê um formulário com nome do avaliador, síntese geral e um campo de comentário para
   cada um dos cinco critérios do MA1, com a orientação de cada critério.
2. **Dado** o formulário aberto, **quando** o avaliador o observa, **então** continua vendo os
   dados do projeto e pode consultar as análises de IA salvas, claramente identificadas como de IA.
3. **Dado** nome e síntese válidos, **quando** o avaliador salva, **então** o parecer é gravado,
   aparece no topo dos pareceres do projeto e uma confirmação é exibida.
4. **Dado** que o salvamento está em andamento, **quando** o avaliador clica novamente em salvar,
   **então** nenhum parecer duplicado é criado.
5. **Dado** um parecer salvo, **quando** a lista de projetos (F02) é recarregada, **então** o
   projeto exibe o selo "Parecer humano" com a contagem atualizada.

---

### História 2 — Avaliador corrige dados inválidos antes de salvar (Prioridade: P2)

O formulário indica o que está faltando ou excede os limites, sem perder o texto já escrito.

**Por que esta prioridade**: evita pareceres vazios e perda de texto, mas o fluxo principal já
entrega valor sem as mensagens detalhadas.

**Teste independente**: tentar salvar sem nome, sem síntese, com síntese curta e com textos acima
do limite; verificar as mensagens e que nada foi gravado.

**Cenários de aceite**:

1. **Dado** nome do avaliador ou síntese vazios, **quando** o avaliador tenta salvar, **então** o
   salvamento é bloqueado e o campo exibe mensagem em português.
2. **Dado** uma síntese com menos de 30 caracteres, **quando** tenta salvar, **então** o
   salvamento é bloqueado com mensagem sobre o tamanho mínimo.
3. **Dado** um texto acima do limite, **quando** o avaliador digita, **então** vê um contador de
   caracteres e o salvamento fica bloqueado enquanto o limite estiver excedido.
4. **Dado** que todos os comentários por critério estão vazios, **quando** a síntese é válida,
   **então** o parecer pode ser salvo.
5. **Dado** uma falha ao salvar, **quando** ela ocorre, **então** aparece uma mensagem de erro
   compreensível, o texto digitado é mantido e o avaliador pode tentar de novo.

---

### História 3 — Avaliador consulta e edita pareceres (Prioridade: P2)

No detalhe do projeto, o avaliador vê todos os pareceres humanos, separados das análises de IA, e
pode editar apenas os pareceres registrados pela própria conta.

**Por que esta prioridade**: completa o "consultar" do rascunho e permite corrigir um parecer sem
duplicá-lo.

**Teste independente**: com pareceres de duas contas no emulador, verificar ordem, identificação e
que só o autor vê e consegue usar a ação de editar.

**Cenários de aceite**:

1. **Dado** um projeto com pareceres, **quando** o detalhe é aberto, **então** os pareceres
   aparecem do mais recente para o mais antigo, cada um com nome do avaliador, data de criação,
   síntese e comentários preenchidos, separados das análises de IA.
2. **Dado** um parecer registrado pela conta do usuário, **quando** ele escolhe "Editar",
   **então** o formulário abre com o conteúdo atual e, ao salvar, o parecer é atualizado e passa a
   exibir "Editado em" com a data e hora da edição.
3. **Dado** um parecer registrado por outra conta, **quando** o usuário o visualiza, **então** a
   ação "Editar" não é oferecida, e uma tentativa de alteração fora da interface é negada.
4. **Dado** um parecer do seed (texto simples, sem autor), **quando** é exibido, **então** aparece
   como texto com a etiqueta "Exemplo" e não pode ser editado.
5. **Dado** um projeto sem pareceres, **quando** o detalhe é aberto, **então** a seção informa que
   ainda não há pareceres e oferece "Registrar parecer".

---

### Casos de borda

- **Conta compartilhada**: a base fornece uma conta por grupo, então todos os membros têm a mesma
  conta e podem editar os pareceres dela. O nome do avaliador, informado em cada parecer, é o que
  identifica a pessoa; ele não concede permissões.
- **Sair com texto não salvo** (registro ou edição): o avaliador é avisado de que o texto será
  perdido.
- **Edição simultânea do mesmo parecer**: prevalece o último salvamento; não há controle de
  conflito nesta versão.
- **Texto colado da análise de IA**: o avaliador pode copiar manualmente trechos da IA, mas o
  registro continua sendo um parecer humano; o sistema nunca preenche o parecer com a IA.
- **Espaços em branco**: textos são aparados antes da validação; um campo só com espaços é vazio.
- **Projeto inexistente ou de outro grupo**: o registro não é oferecido e vale o tratamento de
  "Projeto não encontrado" da F02.
- **Usuário sem grupo válido ou sem login**: segue o tratamento da base (login ou mensagem de
  grupo inválido); nada é gravado.
- **Exibição**: os textos do parecer são exibidos como texto simples, preservando quebras de
  linha e sem interpretar HTML.

## Requisitos *(obrigatório)*

### Requisitos funcionais

- **FR-001**: O detalhe do projeto DEVE oferecer "Registrar parecer" somente na área autenticada e
  para projetos do grupo do usuário.
- **FR-002**: O formulário DEVE ter os campos da tabela abaixo, com orientações curtas por
  critério baseadas no edital, e exibir os dados do projeto durante o preenchimento.
- **FR-003**: O formulário DEVE permitir consultar as análises de IA salvas do projeto, somente
  para leitura e identificadas como IA; o parecer NUNCA DEVE ser preenchido automaticamente com
  conteúdo da IA.
- **FR-004**: O sistema DEVE validar os campos antes de salvar, exibir mensagens em português junto
  ao campo e um contador de caracteres, preservando o texto digitado.
- **FR-005**: Ao salvar, o sistema DEVE criar um novo registro na subcoleção de avaliações do
  projeto, identificado como parecer humano, contendo os campos do formulário, o identificador e o
  e-mail da conta autora e a data e hora de criação pelo relógio do servidor.
- **FR-006**: Um projeto DEVE aceitar vários pareceres, inclusive da mesma conta.
- **FR-007**: Somente a conta autora DEVE poder editar um parecer; a edição altera os campos do
  formulário, registra a data e hora da última edição e preserva autor e data de criação. A
  restrição DEVE valer também fora da interface, e não apenas pela ocultação do botão.
- **FR-008**: O sistema NÃO DEVE permitir excluir pareceres nem editar pareceres do seed.
- **FR-009**: O detalhe DEVE exibir os pareceres do mais recente para o mais antigo, separados das
  análises de IA, com nome do avaliador, datas de criação e edição, síntese e comentários
  preenchidos; comentários vazios não aparecem.
- **FR-010**: O sistema DEVE impedir salvamentos duplicados por clique repetido e avisar antes de
  descartar texto não salvo.
- **FR-011**: O parecer NÃO DEVE conter nota, média, aprovação, reprovação ou encaminhamento para
  etapa.
- **FR-012**: O sistema DEVE tratar carregamento, erro (com nova tentativa) e ausência de pareceres
  com mensagens em português.

#### Campos do parecer

| Campo | Obrigatório | Regra | Referência |
| --- | --- | --- | --- |
| Nome do avaliador | Sim | 2 a 120 caracteres | Item 7.2.1 (vários avaliadores) |
| Síntese geral | Sim | 30 a 3.000 caracteres | — |
| Modelo de negócio | Não | até 1.000 caracteres | Item 7.2; item 1.1.7 |
| Grau de inovação | Não | até 1.000 caracteres | Item 7.2; item 1.1.4 |
| Potencial de mercado | Não | até 1.000 caracteres | Item 7.2 |
| Maturidade tecnológica (TRL) | Não | até 1.000 caracteres | Item 7.2; itens 1.1.8 e 7.2.5 |
| Aderência ao PARTEC-JF | Não | até 1.000 caracteres | Item 7.2; item 1.2 |

### Entidades principais

- **Parecer humano**: avaliação de origem humana de um projeto. Atributos: nome do avaliador,
  síntese, comentários por critério (opcionais), conta autora (identificador e e-mail), data de
  criação e data da última edição. Pertence a exatamente um projeto.
- **Análise de IA**: definida na F03; somente consultada durante o preenchimento.
- **Projeto**: definido na F01; somente lido por esta funcionalidade.

## Critérios de sucesso *(obrigatório)*

### Resultados mensuráveis

- **SC-001**: O avaliador registra um parecer com síntese e dois comentários por critério em até 5
  minutos, partindo da leitura do projeto.
- **SC-002**: 100% dos pareceres salvos aparecem como "Parecer humano" e nunca como análise de IA,
  verificado por teste.
- **SC-003**: 100% das tentativas de editar um parecer de outra conta são negadas, inclusive fora
  da interface, verificado por teste no emulador.
- **SC-004**: Todos os casos de validação da História 2 são cobertos por testes e exibem mensagens
  em português.
- **SC-005**: Um teste de fluxo completo no navegador registra um parecer para um projeto criado
  pelo aplicativo na F01 e o encontra no detalhe e no selo da lista.

## Decisões registradas

- **Critérios do MA1 opcionais e síntese obrigatória** (decisão do grupo em 2026-11-09).
  Alternativas descartadas: texto livre (sem relação com o edital) e todos os critérios
  obrigatórios (lento na oficina).
- **Sem conclusão formal** (decisão do grupo em 2026-11-09). Alternativa descartada:
  encaminhamento sugerido (pré-incubação, pitch ou mais informações), que aproximaria o miniapp da
  seleção por etapas, fora do escopo.
- **Vários pareceres; só a conta autora edita; sem exclusão** (decisão do grupo em 2026-11-09).
  Alternativas descartadas: pareceres imutáveis (acumulam versões) e um parecer por avaliador
  (com uma conta por grupo, viraria um parecer por projeto).
- **Nome do avaliador informado no parecer**: necessário porque a conta é compartilhada pelo grupo;
  serve apenas para identificação.

## Premissas

- A base fornece uma conta por grupo; a restrição de edição por autor passa a ter efeito real
  apenas se houver mais de uma conta por grupo.
- Não é mantido histórico das versões anteriores de um parecer editado; apenas a data da última
  edição.
- Projetos do seed podem receber pareceres normalmente; os campos ausentes aparecem como "Não
  informado", conforme a F02.

## Riscos e dependências

- **Regras compartilhadas**: as regras atuais permitem que qualquer conta do grupo altere qualquer
  registro do grupo. Garantir a edição só pelo autor e impedir exclusões exige ajustar as Security
  Rules, testar no emulador sem regredir o isolamento e depender do instrutor para publicar no
  ambiente real. Registrar a decisão em um ADR no planejamento.
- **Dados pessoais (LGPD e item 12.4 do edital)**: pareceres e e-mails dos autores ficam restritos
  à área autenticada do grupo.
