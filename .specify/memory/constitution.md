# Constituição do Fomentu — treinamento

## Princípios Fundamentais

### I. Escopo Pequeno e Grupos Independentes
O produto DEVE se limitar a cadastrar projetos, consultar listagem e detalhes, gerar avaliações de
IA e registrar pareceres humanos. Cada um dos dez grupos desenvolve sua própria aplicação completa,
sem depender de entregas ou integração de código com outros grupos. Editais, etapas de seleção,
ranking, notas ponderadas e configuração institucional NÃO fazem parte do exercício obrigatório.
O trabalho DEVE caber nos 140 minutos de prática da oficina.
O cadastro de projeto DEVE ser público e solicitar nome e e-mail do proponente. Cada site DEVE
encaminhar os projetos para a área do seu grupo. A gestão dos projetos e avaliações DEVE ocorrer
em uma área autenticada.

### II. Projetos e Avaliações Persistidos
Projetos e avaliações DEVEM ser persistidos no Cloud Firestore. Pareceres humanos e análises de IA
DEVEM permanecer identificáveis separadamente. Campos, telas, validações e critérios de aceite
DEVEM ser definidos pelos participantes, sem uma solução funcional antecipada no boilerplate.

### III. IA Identificável e Controlada
A análise de IA DEVE apoiar a compreensão da ideia, sem representar decisão oficial de seleção.
Respostas reais e simuladas DEVEM ser identificadas; uma falha real NÃO DEVE virar uma resposta
fictícia silenciosamente. Chamadas DEVEM usar o backend autenticado preparado pelo instrutor,
com limites de consumo por grupo e segredos do provedor mantidos no servidor.

### IV. Isolamento entre Grupos
O acesso à área de gestão DEVE usar Firebase Authentication, a claim `groupId` do token e Security Rules.
Projetos DEVEM ficar em `/groups/{groupId}/projects/{projectId}`, com avaliações na subcoleção
`evaluations`. A gestão DEVE usar os helpers de grupo e o SDK web autenticado; dados do cliente
NÃO concedem autorização para leitura ou gestão. O cadastro público DEVE ter um mecanismo próprio
de envio, sem conceder leitura ou alteração dos dados existentes. Credenciais administrativas NÃO DEVEM ser distribuídas aos participantes.
Provisionamento, seed, restauração e deploy da infraestrutura comum são tarefas do instrutor.

### V. Simplicidade e Funcionamento Verificado
O desenvolvimento DEVE usar a stack preparada e Yarn, evitando abstrações e funcionalidades além
do exercício. A interface DEVE tratar carregamento, erro e ausência de dados de forma compreensível.
Testes DEVEM nascer dos critérios de aceite e incluir um fluxo com projeto criado pelo aplicativo.
Testes automatizados de IA DEVEM usar simulação determinística; a integração real DEVE ser
verificada separadamente. Falhas, simulações e pendências DEVEM ser relatadas com precisão.

## Restrições Adicionais

- A base DEVE entregar autenticação, conexão ao Firebase, isolamento, seed fictício, transporte de
  IA e ferramentas de teste funcionando antes da oficina.
- A distribuição inicial DEVE conter apenas rascunhos das quatro funcionalidades em um arquivo,
  sem especificações detalhadas, planos, tarefas ou funcionalidades prontas do miniapp.
- O seed DEVE criar apenas exemplos ausentes. A restauração DEVE ser separada, limitada ao grupo
  solicitado e incluir suas subcoleções.
- Interface, documentação e comentários DEVEM ser escritos em português brasileiro, conforme
  `AGENTS.md`. Identificadores de código DEVEM permanecer em inglês.
- Uma referência funcional do instrutor PODE existir separadamente da cópia dos participantes.

## Fluxo de Desenvolvimento

1. Ler esta constituição, os rascunhos e o guia de ambiente.
2. Especificar as funcionalidades com IA e revisar decisões e critérios de aceite com o grupo.
3. Gerar plano e tarefas; implementar em partes usando a infraestrutura preparada.
4. Executar as verificações ao final do bloco de trabalho, corrigir falhas e registrar pendências.

Os grupos PODEM especificar cada funcionalidade ou reunir as quatro em uma especificação curta.
Não é obrigatório apresentar o resultado, integrar código entre grupos ou fazer deploy individual.

## Governança

Esta constituição orienta o miniapp da oficina e substitui o escopo anterior de plataforma completa.
Mudanças DEVEM ser revisadas pelos responsáveis e registrar justificativa, versão e data.
Redefinições de princípios exigem versão MAJOR; novos requisitos, MINOR; esclarecimentos, PATCH.
Antes de concluir uma entrega, verificar sua conformidade com o escopo, o isolamento e os testes.

**Versão**: 3.0.0 | **Ratificada em**: TODO(RATIFICATION_DATE): confirmar data original de ratificação | **Última alteração**: 2026-11-08
