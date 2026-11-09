# Especificação da funcionalidade: Cadastrar projeto (F01)

**Branch da funcionalidade**: `002-cadastrar-projeto`

**Criada em**: 2026-11-09

**Estado**: Rascunho

**Entrada**: rascunho F01 de `docs/features-draft.md`: "Permitir que o proponente cadastre uma ideia
publicamente, informando nome e e-mail; cada site recebe projetos para seu próprio grupo."

**Referência de regras**: Edital de Retificação nº 02 ao Edital PROINOVA nº 03/2025 do Critt/UFJF
(Incubadora de Base Tecnológica), em especial o item 7.2 (critérios do Momento de Avaliação 1),
o item 7.2.5 (TRL e MVP) e o Anexo V (espelho do formulário de inscrição).

## Contexto

O cadastro é a porta de entrada do miniapp. Ele adota um **núcleo** do formulário do Anexo V do
edital: apenas os campos necessários para que a análise de IA (F03) e o parecer humano (F04)
consigam discutir os critérios do Momento de Avaliação 1 — modelo de negócio, grau de inovação,
potencial de mercado, maturidade tecnológica (TRL) e aderência às áreas do PARTEC-JF.

Ficam de fora documentos pessoais, CNPJ, dados demográficos, dados de equipe e os demais campos do
Anexo V, pois pertencem à formalização e às etapas seletivas, que a constituição exclui do exercício.

## Cenários de usuário e testes _(obrigatório)_

### História 1 — Proponente envia uma ideia (Prioridade: P1)

Um proponente, sem conta no sistema, acessa a página pública do site do grupo, preenche o
formulário com seus dados e as informações essenciais da ideia, aceita os termos e envia. O
projeto fica registrado na área do grupo dono do site e o proponente recebe uma confirmação.

**Por que esta prioridade**: sem projetos criados pelo aplicativo não há o que consultar nem
avaliar; a constituição exige que o fluxo final use um projeto criado pelo app.

**Teste independente**: preencher e enviar o formulário com dados válidos, sem login; depois,
entrar na área autenticada do mesmo grupo (ou consultar o banco no emulador com um usuário do
grupo) e verificar que o projeto existe com os dados enviados.

**Cenários de aceite**:

1. **Dado** um visitante sem login na página pública, **quando** preenche todos os campos
   obrigatórios com valores válidos, marca os aceites e envia, **então** vê uma mensagem de
   sucesso e o projeto é gravado na área do grupo dono do site.
2. **Dado** um envio bem-sucedido, **quando** a confirmação aparece, **então** o formulário é
   limpo e a confirmação não exibe dados de outros projetos.
3. **Dado** que o envio está em andamento, **quando** o proponente clica novamente em enviar,
   **então** nenhum segundo projeto é criado (o botão fica indisponível até a resposta).
4. **Dado** um projeto enviado pelo site do grupo A, **quando** um usuário do grupo B consulta
   seus projetos, **então** esse projeto não aparece para ele.

---

### História 2 — Proponente corrige dados inválidos antes do envio (Prioridade: P2)

O formulário indica, campo a campo, o que está faltando ou incorreto, sem perder o que já foi
digitado.

**Por que esta prioridade**: evita registros incompletos, que prejudicariam a análise de IA e o
parecer; o próprio edital alerta que a falta de informações pode eliminar a proposta.

**Teste independente**: tentar enviar com campos vazios, e-mail inválido, textos acima do limite
e MVP "Sim" sem link; verificar as mensagens e que nada foi gravado.

**Cenários de aceite**:

1. **Dado** um campo obrigatório vazio, **quando** o proponente tenta enviar, **então** o envio
   não ocorre e o campo exibe uma mensagem em português explicando o problema.
2. **Dado** um e-mail em formato inválido, **quando** tenta enviar, **então** o envio é bloqueado
   com mensagem sobre o e-mail.
3. **Dado** um texto acima do limite de caracteres, **quando** o proponente digita, **então** vê
   um contador de caracteres e o envio é bloqueado enquanto o limite estiver excedido.
4. **Dado** que marcou "Possui MVP validado: Sim", **quando** deixa o link vazio, **então** o
   envio é bloqueado com mensagem dizendo que o edital exige comprovação do MVP.
5. **Dado** que os aceites (LGPD e declaração) não foram marcados, **quando** tenta enviar,
   **então** o envio é bloqueado com mensagem indicando os aceites pendentes.

---

### História 3 — Envio público não expõe dados existentes (Prioridade: P1)

O mecanismo de envio permite somente **criar** projetos na área do grupo do site. Um visitante
não consegue ler, alterar ou apagar projetos e avaliações, nem gravar em outro grupo.

**Por que esta prioridade**: é exigência da constituição (princípio IV) e o item 12.4 do edital
determina que as informações dos proponentes sejam tratadas como confidenciais.

**Teste independente**: testes de regras no emulador, com cliente **não autenticado**, cobrindo
criação válida, criação inválida, leitura, alteração, exclusão e escrita em avaliações.

**Cenários de aceite**:

1. **Dado** um cliente não autenticado, **quando** cria um projeto válido no grupo do site,
   **então** a criação é aceita.
2. **Dado** um cliente não autenticado, **quando** tenta ler, listar, alterar ou excluir
   projetos, **então** a operação é negada.
3. **Dado** um cliente não autenticado, **quando** tenta criar um projeto com campos extras,
   campos faltando, tipos errados ou textos acima dos limites, **então** a criação é negada.
4. **Dado** um cliente não autenticado, **quando** tenta criar documentos na subcoleção de
   avaliações ou em outra coleção, **então** a operação é negada.
5. **Dado** um usuário autenticado do grupo, **quando** acessa os projetos, **então** o acesso
   existente continua funcionando (sem regressão nos testes de isolamento da base).

---

### Casos de borda

- **Falha de rede ou do servidor no envio**: o proponente vê uma mensagem de erro compreensível,
  os dados digitados são mantidos e ele pode tentar de novo. Nunca exibir sucesso sem confirmação.
- **Envio negado pelas regras** (por exemplo, dados adulterados no navegador): mensagem genérica
  de erro, sem detalhes técnicos.
- **Site sem grupo configurado ou com grupo inválido**: o formulário não é exibido para envio e
  aparece uma mensagem orientando a procurar o responsável.
- **Configuração do grupo adulterada no navegador**: a versão da oficina não garante que uma
  requisição modificada não crie um projeto em outro grupo; esse risco é aceito para o exercício.
- **Espaços em branco**: textos são aparados antes da validação; um campo só com espaços é vazio.
- **E-mail com maiúsculas**: gravado em minúsculas para facilitar a identificação.
- **MVP "Não" ou "Em fase de validação"**: o link é opcional; se informado, deve ser uma URL
  `http(s)` válida.
- **Mesmo proponente envia duas ideias**: permitido; cada envio gera um projeto independente.
- **Envios abusivos em massa**: não há limitação de taxa nesta versão (ver Riscos).

## Requisitos _(obrigatório)_

### Requisitos funcionais

- **FR-001**: O sistema DEVE oferecer uma página pública de cadastro, acessível sem login.
- **FR-002**: O aplicativo DEVE encaminhar cada projeto para a área do grupo definida na
  configuração pública do site, sem solicitar o grupo ao proponente.
- **FR-003**: O formulário DEVE solicitar os campos da tabela abaixo, com as regras indicadas.
- **FR-004**: O sistema DEVE validar os campos antes do envio e exibir mensagens em português
  junto ao campo com problema, preservando o que foi digitado.
- **FR-005**: O sistema DEVE exibir contador de caracteres nos campos de texto longo.
- **FR-006**: O sistema DEVE exigir o link do MVP quando "Possui MVP validado" for "Sim",
  conforme o item 7.2.5-II e a pergunta 57 do Anexo V do edital.
- **FR-007**: O sistema DEVE exigir os dois aceites (LGPD e declaração de veracidade) e registrar
  a data e hora do aceite junto ao projeto.
- **FR-008**: O sistema DEVE registrar a data e a hora de criação pelo relógio do servidor e a
  origem do registro como envio público, distinguindo-o dos exemplos do seed.
- **FR-009**: O sistema DEVE gravar o nome da solução e a descrição da solução de forma que sejam
  lidos pelos mesmos campos de título e descrição usados pelos projetos do seed, permitindo que a
  consulta (F02) trate ambos de maneira uniforme.
- **FR-010**: O mecanismo de envio público DEVE validar os campos, tipos e tamanhos e DEVE negar a
  clientes não autenticados leitura, listagem, alteração e exclusão de dados, inclusive avaliações.
  O aplicativo DEVE usar o grupo configurado para o site ao criar o projeto; nesta versão, essa
  associação é configuração pública do cliente e não impede que uma requisição deliberadamente
  adulterada tente criar um projeto em outro grupo.
- **FR-011**: O sistema DEVE impedir envios duplicados por clique repetido durante o envio.
- **FR-012**: O sistema DEVE exibir confirmação de sucesso somente após a confirmação da gravação
  e exibir mensagem de erro compreensível em caso de falha, permitindo nova tentativa.
- **FR-013**: O formulário NÃO DEVE solicitar documentos pessoais, CPF, CNPJ, endereço, idade,
  gênero ou telefone, pois são dados da formalização e não são necessários ao exercício.

#### Campos do formulário

Referência entre parênteses: pergunta do Anexo V ou item do edital.

| Campo                                        | Obrigatório  | Regra                                                                                                                                                                           | Referência                                  |
| -------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| Nome completo do proponente                  | Sim          | 3 a 120 caracteres                                                                                                                                                              | Constituição; Anexo V, q. 4                 |
| E-mail do proponente                         | Sim          | formato de e-mail; até 254 caracteres                                                                                                                                           | Constituição; Anexo V, q. 10                |
| Perfil do proponente                         | Sim          | uma opção: Estudante; TAE ou terceirizado da UFJF; Docente; Sociedade em geral; Pessoa jurídica (exceto MEI e sem fins lucrativos)                                              | Anexo V, q. 3; item 5                       |
| Nome da solução/empresa                      | Sim          | 3 a 100 caracteres (título do projeto)                                                                                                                                          | Anexo V, q. 38                              |
| Área prioritária do PARTEC-JF                | Sim          | uma opção: Saúde e Bem-Estar; Logística e Transportes; Tecnologia da Informação; Economia Criativa; Agroalimentar; Sistemas Elétricos e Energia; Nenhuma das áreas prioritárias | Item 1.2; critério de aderência do item 7.2 |
| Problema ou oportunidade de mercado          | Sim          | 30 a 1.000 caracteres                                                                                                                                                           | Anexo V, q. 47                              |
| Descrição da solução                         | Sim          | 30 a 1.000 caracteres (descrição do projeto)                                                                                                                                    | Anexo V, q. 45                              |
| Estágio de desenvolvimento                   | Sim          | uma opção: Ideação; Prototipação; MVP em validação; Operação; Tração; Escala                                                                                                    | Anexo V, q. 55                              |
| Possui MVP validado                          | Sim          | uma opção: Sim; Não; Em fase de validação                                                                                                                                       | Anexo V, q. 56                              |
| Link de comprovação do MVP                   | Se MVP = Sim | URL `http(s)`; até 500 caracteres                                                                                                                                               | Anexo V, q. 57; item 7.2.5-II               |
| Aceite LGPD                                  | Sim          | marcação obrigatória                                                                                                                                                            | Anexo V, item 1                             |
| Declaração de veracidade e ciência do edital | Sim          | marcação obrigatória                                                                                                                                                            | Anexo V, item 2                             |

Os limites de texto somam no máximo cerca de 2.900 caracteres de conteúdo do proponente, o que
deixa espaço para as instruções da análise de IA dentro do limite de 4.000 caracteres da função
compartilhada.

### Entidades principais

- **Projeto**: ideia submetida por um proponente, pertencente a exatamente um grupo. Contém os
  campos da tabela acima, data e hora de criação, data e hora do aceite e a origem (envio público
  ou seed). Não possui situação de seleção, nota nem classificação.
- **Proponente**: não é uma conta; é representado apenas pelo nome, e-mail e perfil gravados no
  próprio projeto.

## Critérios de sucesso _(obrigatório)_

### Resultados mensuráveis

- **SC-001**: Um proponente consegue preencher e enviar o cadastro em até 5 minutos, partindo
  de textos já redigidos.
- **SC-002**: 100% dos envios válidos feitos pelo site de um grupo aparecem somente na área desse
  grupo, verificado por teste automatizado.
- **SC-003**: 100% das tentativas não autenticadas de leitura, alteração, exclusão ou criação
  inválida são negadas nos testes de regras no emulador.
- **SC-004**: Todos os casos de validação da História 2 são cobertos por testes e exibem mensagens
  em português.
- **SC-005**: Um teste de fluxo completo no navegador cria um projeto pelo aplicativo, e esse
  projeto é usado nos fluxos de consulta e avaliação (F02 a F04).

## Decisões registradas

- **Campos**: núcleo do edital (decisão do grupo em 2026-11-09). Alternativas descartadas:
  formulário mínimo (insuficiente para os critérios do edital) e formulário ampliado (arrisca o
  tempo da oficina e o limite do prompt).
- **Mecanismo de envio público**: o aplicativo usa a configuração pública do site para direcionar
  a criação ao grupo correspondente; as regras validam os dados e não permitem leitura pública
  (decisão do grupo em 2026-11-09). A configuração no cliente não impede adulteração deliberada
  do grupo na requisição. Uma função pública dedicada, que validasse a associação no servidor, foi
  descartada para manter o exercício dentro do escopo da oficina. Registrar esta decisão em um ADR
  no planejamento.

## Premissas

- O identificador do grupo é definido na configuração pública de build/site (por exemplo, uma
  variável de ambiente incorporada ao aplicativo), e não informado pelo proponente. Essa
  configuração orienta o fluxo normal, mas não é um segredo nem uma prova de origem da requisição.
- O proponente não acompanha nem edita o projeto depois do envio; o miniapp não envia e-mails.
- Etapas de seleção, notas, classificação, pagamento, documentos e recursos do edital ficam fora
  do escopo, conforme a constituição.
- Os projetos do seed têm apenas título e descrição; as funcionalidades F02 a F04 devem tolerar a
  ausência dos demais campos.

## Riscos e dependências

- **Roteamento público entre grupos**: as Security Rules valem para o projeto Firebase inteiro e
  não conseguem comprovar qual site originou uma requisição. Como o grupo vem de configuração
  pública no cliente, uma pessoa que adulterar a requisição pode tentar criar projetos em outro
  grupo. O risco é aceito para a oficina; a configuração padrão e os testes devem comprovar o
  encaminhamento correto no uso normal. Para impedir essa adulteração, seria necessário validar o
  grupo no servidor, fora do escopo atual.
- **Abuso**: sem limitação de taxa nem CAPTCHA, um visitante pode criar muitos projetos. Aceito
  para a oficina; registrar como pendência para uso real.
- **Confidencialidade (item 12.4 do edital)**: garantida pela ausência de leitura pública; os
  dados só aparecem na área autenticada do grupo.
