# Preparação e administração da oficina

Estas instruções são para o gestor do projeto Firebase. Os participantes usam o README principal.

## Preparar o ambiente

A administração requer acesso administrativo ao projeto e Firebase CLI autenticado. Instale as
ferramentas com `yarn install` e `yarn --cwd admin install`. A configuração web pública deve ser
fornecida aos grupos; mantenha credenciais administrativas e segredos do provedor fora do frontend.

## Grupos e dados

- Criar ou preparar conta, dados e site: `yarn grupo:criar group-01`.
- Acrescentar apenas exemplos ausentes: `yarn grupo:seed group-01`.
- Apagar o grupo, após confirmação: `yarn grupo:apagar group-01`.

Substitua `group-01` pelo grupo desejado, de `group-01` a `group-99`. A conta padrão segue o formato
`grupo01@fomentu.com` e a senha de demonstração é `participante`. Todas as contas usam uma senha
previsível: use apenas dados fictícios e considere que qualquer pessoa com essas credenciais pode
entrar no grupo. Ao repetir a criação, a senha da conta padrão é redefinida; os dados existentes não
são sobrescritos.

O seed cria 13 projetos fictícios, quatro avaliações e dois registros técnicos. Registros adicionais
criados pelo diagnóstico permanecem no banco. A exclusão confirmada remove permanentemente o site,
os usuários com a claim do grupo, os dados e subcoleções e os registros de uso de IA. Ela não remove
o projeto Firebase compartilhado nem o código local.

## Deploy e verificação

O gestor realiza as publicações. Para o grupo 01:

```bash
yarn build
firebase deploy --only hosting:group-01 --project fomentu-15f33
```

A criação do grupo prepara o site, mas não publica o frontend. Outros grupos precisam de destinos
Hosting configurados antes do deploy. Para inspecionar dados dos emuladores, execute
`yarn firebase:emuladores` e acesse `http://127.0.0.1:4000`. Para testar as Security Rules no
emulador, execute `yarn test:firebase`; o comando `yarn test` sozinho não inicia o emulador.

A função de IA em `functions/` possui modo simulado; o modo real, o modelo e o segredo ainda
precisam ser implementados e configurados. O envio público seguro de projetos também está pendente.
