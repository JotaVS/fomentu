# Preparação e administração da oficina

Estas instruções são para o gestor do projeto Firebase. Os participantes usam o README principal.
Esta pasta `admin/` contém scripts do gestor para criar grupos, preparar dados e publicar sites;
ela não é a interface administrativa da aplicação. O frontend fica em `src/`, incluindo a área
administrativa em `src/admin/`. O backend da aplicação fica em `functions/`.

## Preparar o ambiente

A administração requer acesso administrativo ao projeto e Firebase CLI autenticado. Instale as
ferramentas com `yarn install` e `yarn --cwd admin install`. A configuração web pública deve ser
fornecida aos grupos; mantenha credenciais administrativas e segredos do provedor fora do frontend.

## Grupos e dados

- Criar ou preparar conta, dados e site: `yarn grupo:criar ninja`.
- Acrescentar apenas exemplos ausentes: `yarn grupo:seed ninja`.
- Apagar o grupo, após confirmação: `yarn grupo:apagar ninja`.
- Apagar todos os grupos encontrados, após confirmação: `yarn grupos:apagar`.

O identificador não precisa ser numérico: pode ser, por exemplo, `01`, `aa` ou `ninja`.
Use de 1 a 15 caracteres, com letras minúsculas, números e hífens; comece e termine
com letra ou número. `01` e `1` são grupos diferentes. O grupo existente continua sendo `01`.
O identificador interno recebe o prefixo `group-`. A conta segue o formato
`grupo-ninja@fomentu.com` e a senha é o trecho antes do `@`: `grupo-ninja`. Todas as contas usam uma senha
previsível: use apenas dados fictícios e considere que qualquer pessoa com essas credenciais pode
entrar no grupo. Ao repetir a criação, a senha da conta padrão é redefinida; os dados existentes não
são sobrescritos.

O seed cria 13 projetos fictícios, quatro avaliações e dois registros técnicos. Registros adicionais
criados pelo diagnóstico permanecem no banco. A exclusão confirmada remove permanentemente o site,
os usuários com a claim do grupo, os dados e subcoleções e os registros de uso de IA. Ela não remove
o projeto Firebase compartilhado nem o código local.
O comando para todos lista os grupos encontrados em dados, contas, uso de IA e sites com o padrão
de nomes da oficina. Após conferir a lista, responda `S` para confirmar ou `N` para cancelar.

## Deploy e verificação

O gestor realiza as publicações. Por exemplo, para o grupo `ninja`:

```bash
yarn grupo:deploy ninja
```

O comando gera o build com o identificador do grupo e publica apenas seu site. A criação do grupo
prepara o site, mas não publica o frontend. O identificador é público e não autoriza acesso aos dados.
Para inspecionar dados dos emuladores, execute
`yarn firebase:emuladores` e acesse `http://127.0.0.1:4000`. Para testar as Security Rules no
emulador, execute `yarn test:firebase`; o comando `yarn test` sozinho não inicia o emulador.

A função de IA em `functions/` possui modo simulado; o modo real, o modelo e o segredo ainda
precisam ser implementados e configurados. O envio público seguro de projetos também está pendente.
