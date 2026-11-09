# Verificação rápida: Avaliar como humano (F04)

## Testes automatizados

```bash
yarn test:firebase
```

```bash
yarn test:e2e:emulador
```

## Verificação manual

1. Entre no grupo e abra um projeto criado pelo cadastro público.
2. Escolha "Registrar parecer" e tente salvar vazio. As mensagens devem aparecer no nome e na
   síntese.
3. Preencha o nome, a síntese e dois critérios e salve. O parecer deve aparecer no topo, e a lista
   deve mostrar o selo "Parecer humano".
4. Edite o parecer e confira "Editado em".
5. Abra um projeto do seed com parecer de exemplo e confira que ele não tem "Editar".
6. Caso de borda manual (ADR 002): com texto não salvo, tente sair da página e confira o aviso.
