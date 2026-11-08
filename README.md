# Fomentu — treinamento

Nesta oficina, seu grupo vai especificar e construir uma aplicação para cadastrar ideias e registrar
avaliações humanas e de IA. Cada grupo trabalha em sua própria cópia e área de dados.

## Começar

Copie `.env.example` para `.env.local` e preencha a configuração pública do Firebase fornecida pelo
instrutor. Depois, copie e execute o bloco abaixo na raiz do projeto:

```bash
yarn install && \
yarn --cwd admin install && \
yarn playwright install chromium && \
yarn dev
```

Abra o endereço exibido no terminal e, na área administrativa, entre com o e-mail e a senha
fornecidos pelo instrutor. Leia a [constituição](.specify/memory/constitution.md) e os
[rascunhos das funcionalidades](docs/features-draft.md).

Antes do planejamento, consulte os ADRs da base:

- [Acesso ao Firebase](docs/adr/001-acesso-firebase.md).
- [Estratégia de testes](docs/adr/002-estrategia-de-testes.md).
- [Organização das telas e componentes](docs/adr/003-organizacao-de-telas-e-componentes.md).

Esses documentos registram decisões da base e uma orientação inicial para a organização do código.
O grupo pode adaptá-la e deve registrar suas próprias decisões, incluindo a integração de IA.

O cadastro de projetos será público. A consulta e as avaliações ficam na área administrativa. Os
exemplos já disponíveis no banco são fictícios. Não compartilhe credenciais administrativas do Firebase.

## Etapas da atividade

1. **Especificação:** defina o comportamento e os critérios de aceite.
2. **Planejamento:** considere os ADRs existentes, decida como implementar, organize as tarefas e registre uma decisão técnica em um ADR curto.
3. **Implementação:** construa as funcionalidades e execute testes.
4. **Code review:** revise, corrija e refatore o que for necessário.
5. **Deploy:** peça ao instrutor para publicar a versão do grupo e verifique o fluxo no endereço publicado.

Na etapa de revisão, use o [roteiro de code review](docs/revisao-de-codigo.md). Ele explica como
guardar a referência inicial e traz um prompt que pode ser usado com Codex ou Claude Code.

## Verificações

Em outro terminal, copie e execute o bloco abaixo para verificar a aplicação e acompanhar o teste
no navegador. Os emuladores exigem Java e Firebase CLI instalados.

```bash
yarn lint && \
yarn typecheck && \
yarn test:firebase && \
yarn test:e2e:emulador:visual && \
yarn build
```

Para executar o teste de navegador sem abrir a janela, use `yarn test:e2e:emulador`. Os testes
salvam capturas das etapas previstas e do fim de cada teste no relatório
`playwright-report/index.html`. Não há captura de cada clique. Em caso de falha, há um trace em
`test-results/`.

A integração real de IA e o mecanismo de envio público ainda dependem de preparação pelo instrutor.
