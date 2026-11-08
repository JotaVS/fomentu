# Base do treinamento

**Estado:** implementação parcial; preparação e validação da oficina pendentes.
**Responsável:** preparação pelo instrutor, antes da oficina.

## Objetivo

Entregar uma base simples e executável para que dez grupos independentes construam as quatro
funcionalidades descritas em `docs/features-draft.md`, respeitando a constituição do projeto.
Esta especificação descreve a infraestrutura pronta, sem resolver o exercício dos participantes.

## Requisitos e critérios de aceite

- A aplicação deve permitir entrar com e-mail e senha, mostrar o grupo do usuário e sair da sessão.
  Ausência de autenticação ou de uma claim `groupId` válida deve produzir uma mensagem compreensível.
- O Firebase Web SDK deve usar helpers com caminhos dentro de `groups/{groupId}`. As Security Rules
  devem permitir acesso ao próprio grupo e impedir acesso a outros grupos, inclusive avaliações.
  Os testes de isolamento devem usar clientes autenticados no emulador, incluindo usuário sem claim
  e usuário não autenticado; leituras administrativas não comprovam isolamento.
- O instrutor deve conseguir provisionar contas de um manifesto, atribuir claims e criar exemplos
  fictícios em `group-01` a `group-10`. O seed deve preservar documentos existentes. A restauração
  deve limitar-se a um grupo explicitamente informado, incluindo suas subcoleções.
- A interface deve oferecer entrada pública para o cadastro de projeto e área administrativa
  autenticada, com navegação simples e pontos de entrada para as funcionalidades. A página de
  diagnóstico deve identificar o grupo e testar leitura e escrita de um registro técnico. O cadastro
  público deve pedir nome e e-mail do proponente; sua implementação fica para os participantes.
- Cada site deve encaminhar as submissões públicas para seu próprio grupo, sem permitir consulta ou
  alteração pública dos dados existentes. O mecanismo seguro de envio e seu teste estão pendentes;
  as regras atuais continuam exigindo autenticação para acessar o Firestore.
- Uma Cloud Function compartilhada deve receber chamadas autenticadas de grupos válidos, encaminhar
  um prompt genérico ao provedor de IA e devolver texto com identificação do modelo e modo real ou
  simulado. Chaves ficam no servidor; entrada, saída, tempo e consumo por grupo devem ter limites.
  Falhas devem ser tratáveis, sem conversão silenciosa em resposta simulada.
- Os participantes devem definir prompt de avaliação, apresentação e persistência no projeto correto.
- As ferramentas de testes devem estar instaladas. Um teste mínimo com Playwright deve comprovar
  login e entrada na página autenticada, com o grupo correto. Testes de negócio ficam para os grupos.
- O projeto deve oferecer comandos Yarn reais para desenvolvimento, testes e verificações finais.
- A documentação de uso deve ser curta: README com configuração, execução e testes; este documento
  para a base; um arquivo com os rascunhos. Não produzir guias extensos ou ADRs sem necessidade.

## Configuração e decisões confirmadas

- Projeto Firebase: `fomentu-15f33`.
- Firebase criado e configurado e plano Blaze ativado, conforme informado pelo instrutor.
- Configuração pública recebida salva em `.env.local`; modelo de variáveis em `.env.example`.
- Frontend com React, TypeScript, Vite e Yarn; componentes e estilo mínimos.
- IA via Cloud Functions for Firebase, com OpenAI/GPT; modelo e segredo ainda pendentes.
- Dez contas de demonstração, uma por grupo.
- Firestore verificado em `nam5`; Functions configuradas localmente para `us-central1`, conforme
  a [recomendação do Firebase](https://firebase.google.com/docs/functions/locations).
- Firebase CLI `15.34.1` instalado; consulta autenticada aos metadados do Firestore concluída em
  2026-11-08. A primeira tentativa foi limitada pelo ambiente; a consulta fora dessa restrição funcionou.
- Documentos de planejamento registram intenção. Só marcar requisitos como concluídos após verificação.

## Publicação opcional

Decisão confirmada: um site de Firebase Hosting por grupo, no mesmo projeto, com um destino de
deploy específico, permitindo publicar os frontends independentemente.
Os identificadores dos sites precisam estar disponíveis; nenhum site foi criado ou publicado.
O instrutor deve controlar as publicações, sem distribuir credenciais administrativas aos grupos.
Deploy não é condição de conclusão da oficina.

Referências: [múltiplos sites](https://firebase.google.com/docs/hosting/multisites) e
[configuração do Hosting](https://firebase.google.com/docs/hosting/full-config).

## Tarefas de preparação

- [x] Atualizar a constituição para o escopo reduzido.
- [x] Documentar a base e os quatro rascunhos.
- [x] Salvar a configuração pública recebida do Firebase.
- [ ] Montar frontend simples, login e diagnóstico.
- [ ] Implementar helpers e regras; verificar isolamento entre grupos.
- [ ] Preparar contas, claims, seed e restauração por grupo.
- [ ] Implementar função de IA e verificar modos real e simulado.
- [ ] Instalar ferramentas e criar teste mínimo de login com Playwright.
- [ ] Escrever README curto e verificar a integração do Spec Kit.
- [ ] Executar as verificações finais, testar uma cópia limpa e registrar pendências reais.

## Pendências de validação

O CLI consultou o projeto e confirmou o banco Firestore Standard, modo nativo, em `nam5`.
Foram implementados frontend de login e diagnóstico, helpers, regras, scripts administrativos e
uma função de IA simulada. Os testes com o emulador Firestore passaram para dois grupos, avaliações,
usuário sem claim e usuário sem autenticação. Lint, tipos e build passaram.

Ainda faltam: implementar a chamada real ao provedor; configurar modelo e segredo; verificar o modo
simulado em execução; provisionar e verificar as contas e os dados dos demais grupos;
preparar os demais sites; testar seed e restauração; testar login real ou emulado com
Playwright; verificar o Spec Kit e uma cópia limpa. Os testes do Playwright atuais verificam somente
o formulário, não o login completo. Não se considera a oficina pronta até concluir essas etapas.

Em 2026-11-08, o grupo 01 foi criado no Firebase real com 13 projetos fictícios, quatro avaliações
de exemplo, dois registros técnicos do seed e um registro técnico anterior de diagnóstico, conta
`grupo01@example.com` e site `fomentu-15f33-g01`. As regras foram publicadas. O login por SDK web,
a claim do grupo, leitura dos exemplos, escrita e releitura de diagnóstico e negação de acesso ao
grupo 02 foram verificados. Os demais grupos e a função de IA real ainda estão pendentes.

Os testes de regras foram executados no emulador. O fluxo Playwright exercitou entrada pública,
login e diagnóstico com Auth e Firestore emulados, gerando capturas das etapas e relatório HTML.
