# Fomentu — treinamento

Nesta oficina, seu grupo vai especificar e construir uma aplicação para cadastrar ideias e registrar
avaliações humanas e de IA. Cada grupo trabalha em sua própria cópia e área de dados.

## Começar

1. Copie `.env.example` para `.env.local` e preencha a configuração pública do Firebase fornecida pelo instrutor.
2. Instale as dependências com `yarn install`.
3. Inicie a aplicação com `yarn dev` e abra o endereço exibido no terminal.
4. Na área administrativa, entre com o e-mail e a senha fornecidos pelo instrutor.
5. Leia a [constituição](.specify/memory/constitution.md) e os [rascunhos das funcionalidades](docs/features-draft.md).

O cadastro de projetos será público. A consulta e as avaliações ficam na área administrativa. Os
exemplos já disponíveis no banco são fictícios. Não compartilhe credenciais administrativas do Firebase.

## Etapas da atividade

1. **Especificação:** defina o comportamento e os critérios de aceite.
2. **Planejamento:** decida como implementar, organize as tarefas e registre uma decisão técnica em um ADR curto.
3. **Implementação:** construa as funcionalidades e execute testes.
4. **Code review:** revise, corrija e refatore o que for necessário.
5. **Deploy:** peça ao instrutor para publicar a versão do grupo e verifique o fluxo no endereço publicado.

## Comandos

```bash
yarn dev                    # Inicia a aplicação
yarn lint                   # Verifica o código
yarn typecheck              # Verifica os tipos
yarn test                   # Executa os testes locais
yarn test:firebase          # Testa as regras no emulador Firestore
yarn test:e2e               # Executa os testes de navegador
yarn test:e2e:visual        # Abre o navegador durante os testes
yarn test:e2e:emulador      # Testa login e diagnóstico com emuladores
yarn test:e2e:emulador:visual  # Faz o mesmo com o navegador visível
yarn build                  # Gera a versão de produção
```

Os testes de navegador salvam capturas das etapas previstas e do fim de cada teste no relatório
`playwright-report/index.html`. Não há captura de cada clique. Em caso de falha, há um trace em
`test-results/`. O teste com emuladores requer Java, Firebase CLI e as dependências de apoio
instaladas com `yarn --cwd admin install`. Para instalar o navegador: `yarn playwright install chromium`.

A integração real de IA e o mecanismo de envio público ainda dependem de preparação pelo instrutor.
