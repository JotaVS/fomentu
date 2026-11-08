# ADR 001 — Acesso ao Firebase na aplicação

**Estado:** aceito para a base do treinamento.

## Contexto

Os grupos usam o mesmo projeto Firebase, mas trabalham em áreas separadas. A aplicação precisa
permitir login, identificar o grupo autenticado e acessar os projetos e avaliações desse grupo.

## Opções consideradas

1. Usar o Firebase Web SDK e os helpers preparados na base.
2. Usar o Firebase Admin SDK diretamente no código da aplicação.

## Decisão

Usar o Firebase Web SDK na aplicação e autenticação por e-mail e senha. Obter o `groupId` do token
do usuário autenticado e usar os helpers em `src/lib/firebase.ts` para construir referências às
coleções do grupo, projetos e avaliações. As consultas devem apontar diretamente para a área do grupo.

O Admin SDK fica restrito às tarefas administrativas do instrutor e ao backend controlado por ele.
O cadastro público não exige login; seu mecanismo de envio seguro ainda precisa ser preparado.

## Consequências

- A base já oferece inicialização, autenticação e referências que os grupos podem reutilizar.
- Os participantes precisam lidar com ausência de login ou vínculo de grupo e erros de acesso.
- As equipes podem definir campos e consultas do miniapp sem alterar o projeto das outras equipes.
- A configuração web identifica o projeto; credenciais administrativas e chaves de IA não devem
  estar no frontend.
