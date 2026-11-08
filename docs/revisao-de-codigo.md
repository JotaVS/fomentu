# Roteiro de revisão de código

Use este roteiro com o agente que seu grupo estiver usando, em uma nova sessão aberta na mesma
pasta do projeto. A revisão deve analisar mudanças já commitadas e alterações locais ainda não
commitadas, incluindo arquivos novos.

## Preparação

Antes de começar a implementação, registre o estado inicial do projeto criando uma branch local
chamada `base-oficina`: execute `git branch base-oficina` na raiz do projeto. Ela serve apenas como
referência de comparação; o grupo continua trabalhando na branch atual. Não mova essa referência
após começar a implementação.

Se a branch não existir e o trabalho já tiver começado, informe ao agente qual é o commit inicial
da oficina. Não crie a referência a partir do estado atual sem verificar qual era a base.

## Prompt

Copie e envie ao agente:

```text
Faça uma revisão de código das alterações do nosso grupo desde a base inicial da oficina.

Compare o trabalho com a branch local base-oficina. Considere os commits feitos desde essa base,
assim como alterações preparadas para commit, não preparadas e arquivos novos ainda não rastreados.
Confira o estado do Git e leia os arquivos novos relevantes. Se a base não existir ou não for uma
referência adequada, informe a limitação e peça o commit inicial; não invente uma base.

Leia a constituição, os ADRs da base em docs/adr/ e a especificação, o plano, as tarefas e os
ADRs que o grupo criou para esta funcionalidade. Compare a implementação com os requisitos e
critérios de aceite e verifique se as decisões arquiteturais aplicáveis foram respeitadas.
Uma orientação que o grupo tenha adaptado e justificado não é automaticamente um erro.
Se algum documento necessário estiver ausente, não suponha seu conteúdo; informe a limitação
quando ela impedir uma avaliação relevante.

Procure principalmente:
- comportamentos incorretos ou ausentes que afetem os critérios de aceite;
- erros de persistência, autenticação, acesso aos dados ou isolamento entre grupos;
- divergências relevantes em relação à especificação, à constituição e aos ADRs aplicáveis;
- testes ausentes para comportamentos importantes, testes frágeis ou alterações em testes que
  eliminem verificações necessárias;
- tratamento incorreto de erros, dados ausentes ou respostas da IA.

Retorne apenas problemas que precisam de correção ou merecem atenção. Evite elogios, resumo
extenso, sugestões cosméticas e hipóteses sem evidência. Não invente problemas para preencher
uma lista. Não trate código anterior à base como alteração do grupo, mas mencione uma dependência
anterior se ela impedir o funcionamento do trabalho revisado.

Para cada achado, indique prioridade (alta, média ou baixa), arquivo e linha, problema, consequência
prática e correção sugerida. Quando houver divergência documental, cite o requisito ou ADR específico.
Se não encontrar problemas relevantes, diga isso claramente. Informe limitações que afetem a
confiança da revisão e não afirme que os testes passaram se não tiver evidência.

Não altere arquivos, testes ou configurações, não faça commits e não execute deploy. Esta é uma
revisão: apresente os achados para o grupo decidir o que corrigir.
```

Depois da revisão, o grupo decide quais pontos corrigir e executa os testes. Um agente não deve
alterar um teste revisado apenas para fazê-lo passar; correções necessárias no teste devem ser
explicadas e revisadas pelo grupo.
