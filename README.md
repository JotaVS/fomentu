# Fomentu — treinamento

Base simples para os grupos construírem o miniapp. Consulte `docs/features-draft.md` e a
constituição antes de especificar as funcionalidades.

Copie `.env.example` para `.env.local` e preencha a configuração pública do Firebase fornecida pelo
instrutor. Execute `yarn install` e `yarn dev`. Entre com a conta do grupo.

Comandos de verificação: `yarn lint`, `yarn typecheck`, `yarn test`, `yarn test:e2e` e `yarn build`.
O instrutor configura os emuladores, contas, regras e serviços compartilhados. Não coloque chaves de
provedor de IA ou credenciais administrativas nas variáveis `VITE_`.

Para acompanhar testes no navegador, execute `yarn test:e2e:visual`. Use
`yarn test:e2e:emulador:visual` para acompanhar também o login e o diagnóstico contra os emuladores
locais. A versão sem janela é `yarn test:e2e:emulador`. Os testes capturam imagens das etapas
previstas e uma imagem ao fim de cada teste; veja os anexos no relatório `playwright-report/index.html`.
Não é uma gravação de cada clique. Em caso de falha, um trace também é salvo em `test-results/`.
Para o teste com login emulado, instale também as dependências de apoio com `yarn --cwd admin install`.

Para testar as regras do Firebase isoladamente, use `yarn test:firebase`. Para navegar pelos dados
dos emuladores, execute `yarn firebase:emuladores` e acesse `http://127.0.0.1:4000`. A interface
mostra dados emulados, não reproduz as etapas dos testes no navegador. Os emuladores exigem Java e
Firebase CLI; o Playwright exige o navegador instalado com `yarn playwright install chromium`.

A administração usa o Firebase CLI autenticado e requer acesso administrativo ao projeto. Instale as
dependências com `yarn install` e `yarn --cwd admin install`. Para criar uma área, conta, exemplos e
site de hospedagem, use `yarn grupo:criar group-01` (ou outro grupo de `group-01` a `group-99`).
O e-mail padrão da conta administrativa segue o formato `grupo01@example.com`; a senha é
`participante`. Existe uma conta administrativa por grupo, com acesso aos dados do próprio grupo.
Proponentes acessam a entrada pública sem conta ou login.
Essa senha previsível é exclusiva para a oficina com dados fictícios. O comando de criação não
publica o frontend no site; para o grupo 01, use `yarn build` e
`firebase deploy --only hosting:group-01 --project fomentu-15f33`.

Cada grupo recebe 13 projetos fictícios, quatro avaliações de exemplo e dois registros técnicos no
seed. Para acrescentar apenas exemplos ausentes a um grupo existente, execute `yarn grupo:seed group-01`.
O seed nunca substitui documentos existentes; outros registros técnicos gerados pelo diagnóstico
continuam no banco.

Para excluir o grupo, use `yarn grupo:apagar group-01` e digite o identificador solicitado para
confirmar. O comando apaga permanentemente o site, todos os usuários com a claim desse grupo,
seus dados e subcoleções no Firestore e seus registros de uso de IA. Ele não apaga o projeto Firebase
compartilhado nem o código local. A publicação de outros grupos exige configurar seus destinos de
hosting. O comando de criação reutiliza os registros existentes sem sobrescrevê-los, mas redefine a
senha da conta padrão segundo o padrão acima.

A função de IA está em `functions/`. O modo simulado requer `AI_MODE=mock` no servidor. O modo real,
modelo e segredo ainda precisam ser implementados e configurados antes da oficina.

Para testar as regras com o emulador: `firebase emulators:exec --only firestore --project demo-fomentu "yarn test"`.
Sem emulador, os testes de regras são ignorados; uma inspeção estática não comprova isolamento.
